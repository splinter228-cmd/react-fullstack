import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          if (response.data.listOfPosts) {
            setListOfPosts(response.data.listOfPosts);
            setLikedPosts(
              response.data.likedPosts.map((like) => like.PostId)
            );
          } else {
            setListOfPosts(response.data);
          }
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...(post.Likes || []), 0] };
              } else {
                return {
                  ...post,
                  Likes: (post.Likes || []).slice(0, -1),
                };
              }
            }
            return post;
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
      {listOfPosts.map((value) => (
        <div key={value.id} className="post">
          <div className="title">{value.title}</div>

          <div
            className="body"
            onClick={() => navigate(`/post/${value.id}`)}
          >
            {value.postText}
          </div>

          <div className="footer">
            <div className="username">
              <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
            </div>
            <div className="buttons">
              <ThumbUpIcon
                onClick={() => likeAPost(value.id)}
                className={
                  likedPosts.includes(value.id)
                    ? "unlikeBttn"
                    : "likeBttn"
                }
              />

              <label>{value.Likes?.length}</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
