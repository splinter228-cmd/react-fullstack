import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {setAuthState} = useContext(AuthContext);

  let navigate = useNavigate()

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({ username: response.data.username, id: response.data.id, status: true });
        navigate("/");
      }
    });
  };
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type={showPassword ? "text" : "password"}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <label>
        <input
          type="checkbox"
          onChange={(event) => setShowPassword(event.target.checked)}
        /> Show password
      </label>
      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;