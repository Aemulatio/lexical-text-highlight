import {
    $applyNodeReplacement,
    $isElementNode, $isTextNode,
    EditorConfig,
    ElementNode,
    LexicalNode,
    NodeKey,
    RangeSelection, TextNode
} from "lexical";
import type {ReviewStatus, SerializedReviewNode} from "./types.ts";

import {
    addClassNamesToElement,
} from '@lexical/utils';

export class ReviewNode extends ElementNode {

    __ids: Array<string>;
    __status: ReviewStatus;

    static getType(): string {
        return "review"
    }

    static clone(node: ReviewNode): ReviewNode {
        return new ReviewNode(node.__ids, node.__key);
    }

    static importDOM(): null {
        return null;
    }

    static importJSON(serializedNode: SerializedReviewNode): ReviewNode {
        const node = $createReviewNode(serializedNode.ids);
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }

    exportJSON(): SerializedReviewNode {
        return {
            ...super.exportJSON(),
            ids: this.getIDs(),
            type: 'review',
            version: 1,
        };
    }

    constructor(ids: Array<string>, key?: NodeKey) {
        super(key);
        this.__ids = ids || [];
        this.__status = 'wait';
    }


    createDOM(config: EditorConfig): HTMLElement {
        const element = document.createElement('span');
        addClassNamesToElement(element, config.theme.review);
        if (this.__ids.length > 1) {
            addClassNamesToElement(element, config.theme.markOverlap);
        }
        return element;
    }


    getIDs(): Array<string> {
        const self = this.getLatest();
        return $isReviewNode(self) ? self.__ids : [];
    }
}

export const $createReviewNode = (ids: Array<string>): ReviewNode => {
    return $applyNodeReplacement(new ReviewNode(ids))
}

export function $isReviewNode(node: LexicalNode | null): node is ReviewNode {
    return node instanceof ReviewNode;
}

export function $unwrapReviewNode(node: ReviewNode): void {
    const children = node.getChildren();
    let target = null;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (target === null) {
            node.insertBefore(child);
        } else {
            target.insertAfter(child);
        }
        target = child;
    }
    node.remove();
}

export function $wrapSelectionInReviewNode(
    selection: RangeSelection,
    isBackward: boolean,
    id: string,
    createNode?: (ids: Array<string>) => ReviewNode,
): void {
    const nodes = selection.getNodes();
    const anchorOffset = selection.anchor.offset;
    const focusOffset = selection.focus.offset;
    const nodesLength = nodes.length;
    const startOffset = isBackward ? focusOffset : anchorOffset;
    const endOffset = isBackward ? anchorOffset : focusOffset;
    let currentNodeParent;
    let lastCreatedMarkNode;

    // We only want wrap adjacent text nodes, line break nodes
    // and inline element nodes. For decorator nodes and block
    // element nodes, we step out of their boundary and start
    // again after, if there are more nodes.
    for (let i = 0; i < nodesLength; i++) {
        const node = nodes[i];
        if (
            $isElementNode(lastCreatedMarkNode) &&
            lastCreatedMarkNode.isParentOf(node)
        ) {
            // If the current node is a child of the last created mark node, there is nothing to do here
            continue;
        }
        const isFirstNode = i === 0;
        const isLastNode = i === nodesLength - 1;
        let targetNode: LexicalNode | null = null;

        if ($isTextNode(node)) {
            // Case 1: The node is a text node and we can split it
            const textContentSize = node.getTextContentSize();
            const startTextOffset = isFirstNode ? startOffset : 0;
            const endTextOffset = isLastNode ? endOffset : textContentSize;
            if (startTextOffset === 0 && endTextOffset === 0) {
                continue;
            }
            const splitNodes = node.splitText(startTextOffset, endTextOffset);
            targetNode =
                splitNodes.length > 1 &&
                (splitNodes.length === 3 ||
                    (isFirstNode && !isLastNode) ||
                    endTextOffset === textContentSize)
                    ? splitNodes[1]
                    : splitNodes[0];
        } else if ($isReviewNode(node)) {
            // Case 2: the node is a mark node and we can ignore it as a target,
            // moving on to its children. Note that when we make a mark inside
            // another mark, it may utlimately be unnested by a call to
            // `registerNestedElementResolver<MarkNode>` somewhere else in the
            // codebase.

            continue;
        } else if ($isElementNode(node) && node.isInline()) {
            // Case 3: inline element nodes can be added in their entirety to the new
            // mark
            targetNode = node;
        }

        if (targetNode !== null) {
            // Now that we have a target node for wrapping with a mark, we can run
            // through special cases.
            if (targetNode && targetNode.is(currentNodeParent)) {
                // The current node is a child of the target node to be wrapped, there
                // is nothing to do here.
                continue;
            }
            const parentNode = targetNode.getParent();
            if (parentNode == null || !parentNode.is(currentNodeParent)) {
                // If the parent node is not the current node's parent node, we can
                // clear the last created mark node.
                lastCreatedMarkNode = undefined;
            }

            currentNodeParent = parentNode;

            if (lastCreatedMarkNode === undefined) {
                // If we don't have a created mark node, we can make one
                const createMarkNode = createNode || $createReviewNode;
                lastCreatedMarkNode = createMarkNode([id]);
                targetNode.insertBefore(lastCreatedMarkNode);
            }

            // Add the target node to be wrapped in the latest created mark node
            lastCreatedMarkNode.append(targetNode);
        } else {
            // If we don't have a target node to wrap we can clear our state and
            // continue on with the next node
            currentNodeParent = undefined;
            lastCreatedMarkNode = undefined;
        }
    }
    // Make selection collapsed at the end
    if ($isElementNode(lastCreatedMarkNode)) {
        // eslint-disable-next-line no-unused-expressions
        isBackward
            ? lastCreatedMarkNode.selectStart()
            : lastCreatedMarkNode.selectEnd();
    }
}

export function $getReviewIDs(
    node: TextNode,
    offset: number,
): null | Array<string> {
    let currentNode: LexicalNode | null = node;
    while (currentNode !== null) {
        if ($isReviewNode(currentNode)) {
            return currentNode.getIDs();
        } else if (
            $isTextNode(currentNode) &&
            offset === currentNode.getTextContentSize()
        ) {
            const nextSibling = currentNode.getNextSibling();
            if ($isReviewNode(nextSibling)) {
                return nextSibling.getIDs();
            }
        }
        currentNode = currentNode.getParent();
    }
    return null;
}
