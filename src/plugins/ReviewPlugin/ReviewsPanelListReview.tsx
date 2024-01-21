import useModal from "../../hooks/useModal.tsx";
import {Button} from "antd";
import {Review, Thread} from "./ReviewStore.ts";
import {ShowDeleteReviewOrThreadDialog} from "./ShowDeleteReviewOrThreadDialog.tsx";


export const ReviewsPanelListReview =
    ({
         comment,
         deleteComment,
         thread,
         rtf,
     }: {
        comment: Review;
        deleteComment: (
            commentOrThread: Review | Thread,
            // eslint-disable-next-line no-shadow
            thread?: Thread,
        ) => void;
        rtf: Intl.RelativeTimeFormat;
        thread?: Thread;
    }): JSX.Element => {
        const seconds = Math.round((comment.timeStamp - performance.now()) / 1000);
        const minutes = Math.round(seconds / 60);
        const [modal, showModal] = useModal();

        return (
            <li className="CommentPlugin_CommentsPanel_List_Comment">
                <div className="CommentPlugin_CommentsPanel_List_Details">
        <span className="CommentPlugin_CommentsPanel_List_Comment_Author">
          {comment.author}
        </span>
                    <span className="CommentPlugin_CommentsPanel_List_Comment_Time">
          · {seconds > -10 ? 'Just now' : rtf.format(minutes, 'minute')}
        </span>
                </div>
                <p
                    className={
                        comment.deleted ? 'CommentPlugin_CommentsPanel_DeletedComment' : ''
                    }>
                    {comment.content}
                </p>
                {!comment.deleted && (
                    <>
                        <Button
                            onClick={() => {
                                showModal('Delete Comment', (onClose) => (
                                    <ShowDeleteReviewOrThreadDialog
                                        commentOrThread={comment}
                                        deleteCommentOrThread={deleteComment}
                                        thread={thread}
                                        onClose={onClose}
                                    />
                                ));
                            }}
                            className="CommentPlugin_CommentsPanel_List_DeleteButton">
                            <i className="delete"/>
                        </Button>
                        {modal}
                    </>
                )}
            </li>
        );
    }
