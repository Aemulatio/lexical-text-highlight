import type {LexicalEditor} from 'lexical';

import {useEffect, useState} from 'react';
import type {ReviewStatus} from "../../nodes/ReviewNode/types.ts";

export type Review = {
    author: string;
    content: string;
    deleted: boolean;
    status: ReviewStatus;
    id: string;
    timeStamp: number;
    type: 'review';
};

export type Thread = {
    comments: Array<Review>;
    id: string;
    quote: string;
    type: 'review-thread';
};

export type Reviews = Array<Thread | Review>;

function createUID(): string {
    return Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5);
}

export function createReview(
    content: string,
    author: string,
    id?: string,
    timeStamp?: number,
    deleted?: boolean,
): Review {
    return {
        author,
        content,
        deleted: deleted === undefined ? false : deleted,
        id: id === undefined ? createUID() : id,
        timeStamp: timeStamp === undefined ? performance.now() : timeStamp,
        type: 'review',
        status: 'wait'
    };
}

export function createReviewThread(
    quote: string,
    comments: Array<Review>,
    id?: string,
): Thread {
    return {
        comments,
        id: id === undefined ? createUID() : id,
        quote,
        type: 'review-thread',
    };
}

function cloneReviewThread(thread: Thread): Thread {
    return {
        comments: Array.from(thread.comments),
        id: thread.id,
        quote: thread.quote,
        type: 'review-thread',
    };
}

function markDeleted(comment: Review): Review {
    return {
        author: comment.author,
        content: '[Deleted Review]',
        deleted: true,
        id: comment.id,
        timeStamp: comment.timeStamp,
        type: 'review',
        status: 'decline'
    };
}

function changeStatus(comment: Review, status: Exclude<ReviewStatus, 'wait'>): Review {
    return {
        author: comment.author,
        content: comment.content,
        deleted: comment.deleted,
        id: comment.id,
        timeStamp: comment.timeStamp,
        type: 'review',
        status
    };
}

function triggerOnChange(commentStore: ReviewStore): void {
    const listeners = commentStore._changeListeners;
    for (const listener of listeners) {
        listener();
    }
}

export class ReviewStore {
    _editor: LexicalEditor;
    _reviews: Reviews;
    _changeListeners: Set<() => void>;

    constructor(editor: LexicalEditor) {
        this._reviews = [];
        this._editor = editor;
        this._changeListeners = new Set();
    }


    getReviews(): Reviews {
        return this._reviews;
    }

    addReview(
        commentOrThread: Review | Thread,
        thread?: Thread,
        offset?: number,
    ): void {
        const nextComments = Array.from(this._reviews);

        if (thread !== undefined && commentOrThread.type === 'review') {
            for (let i = 0; i < nextComments.length; i++) {
                const comment = nextComments[i];
                if (comment.type === 'review-thread' && comment.id === thread.id) {
                    const newThread = cloneReviewThread(comment);
                    nextComments.splice(i, 1, newThread);
                    const insertOffset =
                        offset !== undefined ? offset : newThread.comments.length;
                    newThread.comments.splice(insertOffset, 0, commentOrThread);
                    break;
                }
            }
        } else {
            const insertOffset = offset !== undefined ? offset : nextComments.length;
            nextComments.splice(insertOffset, 0, commentOrThread);
        }
        this._reviews = nextComments;
        triggerOnChange(this);
    }

    deleteCommentOrThread(
        commentOrThread: Review | Thread,
        thread?: Thread,
    ): { markedComment: Review; index: number } | null {
        const nextComments = Array.from(this._reviews);
        // The YJS types explicitly use `any` as well.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let commentIndex: number | null = null;

        if (thread !== undefined) {
            for (let i = 0; i < nextComments.length; i++) {
                const nextComment = nextComments[i];
                if (nextComment.type === 'review-thread' && nextComment.id === thread.id) {
                    const newThread = cloneReviewThread(nextComment);
                    nextComments.splice(i, 1, newThread);
                    const threadComments = newThread.comments;
                    commentIndex = threadComments.indexOf(commentOrThread as Review);
                    threadComments.splice(commentIndex, 1);
                    break;
                }
            }
        } else {
            commentIndex = nextComments.indexOf(commentOrThread);
            nextComments.splice(commentIndex, 1);
        }
        this._reviews = nextComments;
        triggerOnChange(this);

        if (commentOrThread.type === 'review') {
            return {
                index: commentIndex as number,
                markedComment: markDeleted(commentOrThread as Review),
            };
        }

        return null;
    }

    registerOnChange(onChange: () => void): () => void {
        const changeListeners = this._changeListeners;
        changeListeners.add(onChange);
        return () => {
            changeListeners.delete(onChange);
        };
    }
}

export function useReviewStore(reviewStore: ReviewStore): Reviews {
    const [reviews, setReviews] = useState<Reviews>(
        reviewStore.getReviews(),
    );

    useEffect(() => {
        return reviewStore.registerOnChange(() => {
            setReviews(reviewStore.getReviews());
        });
    }, [reviewStore]);

    return reviews;
}
