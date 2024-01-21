import {NodeKey} from "lexical";
import {useRef} from "react";
import {Review, Reviews, Thread} from "./ReviewStore.ts";
import {ReviewsPanelList} from "./ReviewsPanelList.tsx";

export const ReviewsPanel = ({
                                 activeIDs,
                                 deleteCommentOrThread,
                                 comments,
                                 submitAddComment,
                                 markNodeMap,
                             }
                                 :
                                 {
                                     activeIDs: Array<string>;
                                     comments: Reviews;
                                     deleteCommentOrThread: (
                                         commentOrThread: Review | Thread,
                                         thread?: Thread,
                                     ) => void;
                                     markNodeMap: Map<string, Set<NodeKey>>;
                                     submitAddComment: (
                                         commentOrThread: Review | Thread,
                                         isInlineComment: boolean,
                                         thread?: Thread,
                                     ) => void;
                                 }
):
    JSX.Element => {
    const listRef = useRef<HTMLUListElement>(null);
    const isEmpty = comments.length === 0;

    return (
        <div className="CommentPlugin_CommentsPanel">
            <h2 className="CommentPlugin_CommentsPanel_Heading">Reviews</h2>
            {isEmpty ? (
                <div className="CommentPlugin_CommentsPanel_Empty">No Reviews</div>
            ) : (
                <ReviewsPanelList
                    activeIDs={activeIDs}
                    comments={comments}
                    deleteCommentOrThread={deleteCommentOrThread}
                    listRef={listRef}
                    submitAddComment={submitAddComment}
                    markNodeMap={markNodeMap}
                />
            )}
        </div>
    );
}
