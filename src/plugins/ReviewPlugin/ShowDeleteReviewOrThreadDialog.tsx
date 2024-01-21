import {Button} from "antd";
import {Review, Thread} from "./ReviewStore.ts";

export const ShowDeleteReviewOrThreadDialog=({
    commentOrThread,
    deleteCommentOrThread,
    onClose,
    thread = undefined,
}: {
    commentOrThread: Review | Thread;

    deleteCommentOrThread: (
        comment: Review | Thread,
        // eslint-disable-next-line no-shadow
        thread?: Thread,
    ) => void;
    onClose: () => void;
    thread?: Thread;
}): JSX.Element =>{
    return (
        <>
            Are you sure you want to delete this {commentOrThread.type}?
            <div className="Modal__content">
                <Button
                    onClick={() => {
                        deleteCommentOrThread(commentOrThread, thread);
                        onClose();
                    }}>
                    Delete
                </Button>{' '}
                <Button
                    onClick={() => {
                        onClose();
                    }}>
                    Cancel
                </Button>
            </div>
        </>
    );
}
