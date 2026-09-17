import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../helpers/api";
import Notification from "../components/Notification";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const [notif, setNotif] = useState({ open: false, message: "", severity: "error" });
  let navigate = useNavigate();

  useEffect(() => {
    api.get(`/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    api.get(`/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    api
      .post(
        "/comments",
        { commentBody: newComment, PostId: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        if (response.data.error) {
          setNotif({ open: true, message: response.data.error, severity: "error" });
        } else {
          setComments([...comments, response.data]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    api
      .delete(`/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(comments.filter((val) => val.id != id));
      });
  };

  const deletePost = (id) => {
    api
      .delete(`/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      api.put(
        "/posts/title",
        { newTitle: newTitle, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text:");
      api.put(
        "/posts/postText",
        { newText: newPostText, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  return (
    <div
      className="postPage"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Home.jpeg)` }}
    >
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) editPost("title");
            }}>
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) editPost("body");
            }}>
            {postObject.postText}
          </div>
          <div className="footer">
            <div className="postFooterAuthor">
              <div className="postAvatar">
                {postObject.username?.charAt(0).toUpperCase()}
              </div>
              <span className="postAuthor">{postObject.username}</span>
            </div>
            {authState.username === postObject.username && (
              <button className="deletePostBtn" onClick={() => deletePost(postObject.id)}>
                🗑 Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="commentInputRow">
          <input
            type="text"
            placeholder="Write a comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <button onClick={addComment}>Post</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => (
            <div key={key} className="commentRow">
              <div className="postAvatar">
                {comment.username?.charAt(0).toUpperCase()}
              </div>
              <div className="comment">
                <div className="commentContent">
                  <span className="commentUsername">{comment.username}</span>
                  <span className="commentBody">{comment.commentBody}</span>
                </div>
                {authState.username === comment.username && (
                  <button className="deleteCommentBtn" onClick={() => deleteComment(comment.id)}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Notification
          open={notif.open}
          message={notif.message}
          severity={notif.severity}
          onClose={() => setNotif({ ...notif, open: false })}
        />
      </div>
    </div>
  );
}

export default Post;