import React, { useEffect, useState, useContext } from "react";
import api from "../helpers/api";
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
      api
        .get("/posts", {
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
    api
      .post(
        "/likes",
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

  const topLikedPosts = [...listOfPosts]
    .sort((a, b) => (b.Likes?.length || 0) - (a.Likes?.length || 0))
    .slice(0, 3);

  return (
    <div
      className="homePageContainer"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Home.jpeg)` }}
    >
      <div className="homeFeed">
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
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
                <label>{value.Likes?.length}</label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="homeSidebar">
        <div className="sidebarCard">
          <div className="sidebarProfileRow">
            <div className="postAvatar">
              {authState.username?.charAt(0).toUpperCase()}
            </div>
            <span className="sidebarProfileName">{authState.username}</span>
          </div>
          <div className="sidebarProfileStats">
            {listOfPosts.filter((p) => p.username === authState.username).length} posts
          </div>
        </div>

        <div className="sidebarCard">
          <div className="sidebarLabel">Top liked</div>
          {topLikedPosts.map((post) => (
            <div key={post.id} className="sidebarTopRow">
              <span>{post.title}</span>
              <span>♥ {post.Likes?.length || 0}</span>
            </div>
          ))}
        </div>

        <div className="sidebarCta">
          <p>Got something to share?</p>
          <button onClick={() => navigate("/createpost")}>Create a Post</button>
        </div>
      </div>
    </div>
  );
}

export default Home;