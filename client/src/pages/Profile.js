import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../helpers/api";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
    let { id } = useParams();
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const { authState } = useContext(AuthContext);

    const totalLikes = listOfPosts.reduce(
        (sum, post) => sum + (post.Likes?.length || 0),
        0
    );

    useEffect(() => {
        api.get(`/auth/basicinfo/${id}`).then((response) => {
            setUsername(response.data.username);
        });

        api.get(`/posts/byuserId/${id}`).then((response) => {
            setListOfPosts(response.data);
        })
    }, [id]);

    return (
        <div
            className="profilePageContainer"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Pr.jpeg)` }}
        >
            <div className="profileCard">
                <div
                    className="profileBanner"
                    style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Ba.jpeg)` }}
                ></div>

                <div className="profileHeader">
                    <div className="avatar">{username.charAt(0).toUpperCase()}</div>

                    <div className="profileHeaderRow">
                        <div className="profileDetails">
                            <h1>{username}</h1>
                            <div className="profileStats">
                                <span>{listOfPosts.length} posts</span>
                                <span>{totalLikes} likes</span>
                            </div>
                        </div>
                        {authState.username === username && (
                            <button onClick={() => { navigate("/changepassword"); }}>
                                Change Password
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="listOfPosts">
                {listOfPosts.map((value) => (
                    <div
                        key={value.id}
                        className="post"
                        onClick={() => navigate(`/post/${value.id}`)}
                    >
                        <div>
                            <div className="title">{value.title}</div>
                            <div className="body">{value.postText}</div>
                        </div>
                        <div className="likesInline">♥ {value.Likes?.length || 0}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Profile