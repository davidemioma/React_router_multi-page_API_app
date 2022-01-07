import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./Comments.module.css";
import NewCommentForm from "./NewCommentForm";
import CommentsList from "./CommentsList";
import { getAllComments } from "../../lib/api";
import useHttp from "../../hooks/use-http";
import { useEffect } from "react/cjs/react.development";
import LoadingSpinner from "../UI/LoadingSpinner";

const Comments = () => {
  const param = useParams();

  const quoteId = param.quoteID;

  const [isAddingComment, setIsAddingComment] = useState(false);

  const {
    sendRequest,
    status,
    data: loadedComments,
  } = useHttp(getAllComments, true);

  useEffect(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  const addCommentHandler = useCallback(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  let comments;

  if (status === "pending") {
    comments = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && loadedComments && loadedComments.length > 0) {
    comments = <CommentsList comments={loadedComments} />;
  }

  if (
    status === "completed" &&
    !loadedComments &&
    loadedComments.length === 0
  ) {
    comments = <p className="centered">No comments were added yet!</p>;
  }

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className="btn" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && (
        <NewCommentForm id={quoteId} onAddComment={addCommentHandler} />
      )}
      {comments}
    </section>
  );
};

export default Comments;
