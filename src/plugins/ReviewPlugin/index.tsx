import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Review, ReviewStore, Thread, useReviewStore} from "./ReviewStore.ts";
import {
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    $isTextNode,
    COMMAND_PRIORITY_EDITOR,
    NodeKey,
    RangeSelection
} from "lexical";
import {
    $createReviewNode, $getReviewIDs,
    $isReviewNode,
    $unwrapReviewNode,
    $wrapSelectionInReviewNode,
    ReviewNode
} from "../../nodes/ReviewNode";
import {INSERT_INLINE_COMMAND} from "../CommentPlugin";
import {mergeRegister, registerNestedElementResolver} from '@lexical/utils';
import {createPortal} from "react-dom";
import {Button} from "antd";
import {ReviewInputBox} from "./ReviewInputBox.tsx";
import {AddReviewBox} from "./AddReviewBox.tsx";
import {ReviewsPanel} from "./ReviewsBox.tsx";

export const ReviewPlugin = () => {
    const [editor] = useLexicalComposerContext();

    const reviewStore = useMemo(() => new ReviewStore(editor), [editor]);
    const reviews = useReviewStore(reviewStore);
    const reviewNodeMap = useMemo<Map<string, Set<NodeKey>>>(() => new Map(), [])

    const [activeAnchorKey, setActiveAnchorKey] = useState<NodeKey | null>();
    const [activeIDs, setActiveIDs] = useState<Array<string>>([]);
    const [showReviewInput, setShowReviewInput] = useState(false);
    const [showReviews, setShowReviews] = useState(false);

    const cancelAddReview = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection !== null) {
                selection.dirty = true;
            }
        });
        setShowReviewInput(false)
    }, [editor])


    const deleteReviewOrThread = useCallback(
        (comment: Review | Thread, thread?: Thread) => {
            if (comment.type === 'review') {
                const deletionInfo = reviewStore.deleteCommentOrThread(
                    comment,
                    thread,
                );
                if (!deletionInfo) return;
                const {markedComment, index} = deletionInfo;
                reviewStore.addReview(markedComment, thread, index);
            } else {
                reviewStore.deleteCommentOrThread(comment);
                // Remove ids from associated marks
                const id = thread !== undefined ? thread.id : comment.id;
                const markNodeKeys = reviewNodeMap.get(id);
                if (markNodeKeys !== undefined) {
                    // Do async to avoid causing a React infinite loop
                    setTimeout(() => {
                        editor.update(() => {
                            for (const key of markNodeKeys) {
                                const node: null | ReviewNode = $getNodeByKey(key);
                                if ($isReviewNode(node)) {
                                    node.deleteID(id);
                                    if (node.getIDs().length === 0) {
                                        $unwrapReviewNode(node);
                                    }
                                }
                            }
                        });
                    });
                }
            }
        },
        [reviewStore, editor, reviewNodeMap],
    );

    const submitAddReview = useCallback(
        (
            reviewOrThread: Review | Thread,
            isInlineComment: boolean,
            thread?: Thread,
            selection?: RangeSelection | null,
        ) => {
            reviewStore.addReview(reviewOrThread, thread);
            if (isInlineComment) {
                editor.update(() => {
                    if ($isRangeSelection(selection)) {
                        const isBackward = selection.isBackward();
                        const id = reviewOrThread.id;

                        // Wrap content in a MarkNode
                        $wrapSelectionInReviewNode(selection, isBackward, id);
                    }
                });
                setShowReviewInput(false);
            }
        },
        [reviewStore, editor],
    );

    useEffect(() => {
        const changedElems: Array<HTMLElement> = [];
        for (let i = 0; i < activeIDs.length; i++) {
            const id = activeIDs[i];
            const keys = reviewNodeMap.get(id);
            if (keys !== undefined) {
                for (const key of keys) {
                    const elem = editor.getElementByKey(key);
                    if (elem !== null) {
                        elem.classList.add('selected');
                        changedElems.push(elem);
                        setShowReviews(true);
                    }
                }
            }
        }
        return () => {
            for (let i = 0; i < changedElems.length; i++) {
                const changedElem = changedElems[i];
                changedElem.classList.remove('selected');
            }
        };
    }, [activeIDs, editor, reviewNodeMap]);

    useEffect(() => {
        const markNodeKeysToIDs: Map<NodeKey, Array<string>> = new Map();

        return mergeRegister(
            registerNestedElementResolver<ReviewNode>(
                editor,
                ReviewNode,
                (from: ReviewNode) => {
                    return $createReviewNode(from.getIDs());
                },
                (from: ReviewNode, to: ReviewNode) => {
                    // Merge the IDs
                    const ids = from.getIDs();
                    ids.forEach((id) => {
                        to.addID(id);
                    });
                },
            ),
            editor.registerMutationListener(ReviewNode, (mutations) => {
                editor.getEditorState().read(() => {
                    for (const [key, mutation] of mutations) {
                        const node: null | ReviewNode = $getNodeByKey(key);
                        let ids: NodeKey[] = [];

                        if (mutation === 'destroyed') {
                            ids = markNodeKeysToIDs.get(key) || [];
                        } else if ($isReviewNode(node)) {
                            ids = node.getIDs();
                        }

                        for (let i = 0; i < ids.length; i++) {
                            const id = ids[i];
                            let markNodeKeys = reviewNodeMap.get(id);
                            markNodeKeysToIDs.set(key, ids);

                            if (mutation === 'destroyed') {
                                if (markNodeKeys !== undefined) {
                                    markNodeKeys.delete(key);
                                    if (markNodeKeys.size === 0) {
                                        reviewNodeMap.delete(id);
                                    }
                                }
                            } else {
                                if (markNodeKeys === undefined) {
                                    markNodeKeys = new Set();
                                    reviewNodeMap.set(id, markNodeKeys);
                                }
                                if (!markNodeKeys.has(key)) {
                                    markNodeKeys.add(key);
                                }
                            }
                        }
                    }
                });
            }),
            editor.registerUpdateListener(({editorState, tags}) => {
                editorState.read(() => {
                    const selection = $getSelection();
                    let hasActiveIds = false;
                    let hasAnchorKey = false;

                    if ($isRangeSelection(selection)) {
                        const anchorNode = selection.anchor.getNode();

                        if ($isTextNode(anchorNode)) {
                            const commentIDs = $getReviewIDs(
                                anchorNode,
                                selection.anchor.offset,
                            );
                            if (commentIDs !== null) {
                                setActiveIDs(commentIDs);
                                hasActiveIds = true;
                            }
                            if (!selection.isCollapsed()) {
                                setActiveAnchorKey(anchorNode.getKey());
                                hasAnchorKey = true;
                            }
                        }
                    }
                    if (!hasActiveIds) {
                        setActiveIDs((_activeIds) =>
                            _activeIds.length === 0 ? _activeIds : [],
                        );
                    }
                    if (!hasAnchorKey) {
                        setActiveAnchorKey(null);
                    }
                    if (!tags.has('collaboration') && $isRangeSelection(selection)) {
                        setShowReviewInput(false);
                    }
                });
            }),
            editor.registerCommand(
                INSERT_INLINE_COMMAND,
                () => {
                    const domSelection = window.getSelection();
                    if (domSelection !== null) {
                        domSelection.removeAllRanges();
                    }
                    setShowReviewInput(true);
                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
        );
    }, [editor, reviewNodeMap]);

    const onAddComment = () => {
        editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
    };

    return (
        <>
            {showReviewInput &&
                createPortal(
                    <ReviewInputBox
                        editor={editor}
                        cancelAddComment={cancelAddReview}
                        submitAddComment={submitAddReview}
                    />,
                    document.body,
                )}
            {activeAnchorKey !== null &&
                activeAnchorKey !== undefined &&
                !showReviewInput &&
                createPortal(
                    <AddReviewBox
                        anchorKey={activeAnchorKey}
                        editor={editor}
                        onAddComment={onAddComment}
                    />,
                    document.body,
                )}
            {createPortal(
                <Button
                    className={`CommentPlugin_ShowCommentsButton ${
                        showReviews ? 'active' : ''
                    }`}
                    onClick={() => setShowReviews(!showReviews)}
                    title={showReviews ? 'Hide Comments' : 'Show Comments'}>
                    <i className="comments"/>
                </Button>,
                document.body,
            )}
            {showReviews &&
                createPortal(
                    <ReviewsPanel
                        comments={reviews}
                        submitAddComment={submitAddReview}
                        deleteCommentOrThread={deleteReviewOrThread}
                        activeIDs={activeIDs}
                        markNodeMap={reviewNodeMap}
                    />,
                    document.body,
                )}
        </>
    )

}
