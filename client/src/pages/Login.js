import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../helpers/api";
import Notification from "../components/Notification";
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../helpers/AuthContext";
import { Person as PersonOutlineIcon, Lock as LockOutlinedIcon } from "@mui/icons-material";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthState } = useContext(AuthContext);
  const [notif, setNotif] = useState({ open: false, message: "", severity: "error" });
  let navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required("Enter username"),
    password: Yup.string().min(4).max(20).required("Enter password"),
  });

  const onSubmit = (data) => {
    api.post("/auth/login", data).then((response) => {
      if (response.data.error) {
        setNotif({ open: true, message: response.data.error, severity: "error" });
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({ username: response.data.username, id: response.data.id, status: true });
        navigate("/");
      }
    });
  };

  return (
    <div
      className="loginContainer"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/LRP.jpeg)` }}
    >
      <div className="glassCard">
        <h1>Login</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <ErrorMessage name="username" component="span" />
            <div className="inputWithIcon">
              <Field autocomplete="off" name="username" placeholder="username" />
              <PersonOutlineIcon className="icon" />
            </div>

            <ErrorMessage name="password" component="span" />
            <div className="inputWithIcon">
              <Field
                autocomplete="off"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
              />
              <LockOutlinedIcon className="icon" />
            </div>

            <div className="rememberRow">
              <label>
                <input
                  type="checkbox"
                  onChange={(event) => setShowPassword(event.target.checked)}
                /> Show password
              </label>
            </div>

            <button type="submit" className="pillButton">Login</button>
          </Form>
        </Formik>

        <p className="switchLink">
          Don't have an account? <Link to="/registration">Register</Link>
        </p>
      </div>

      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={() => setNotif({ ...notif, open: false })}
      />
    </div>
  );
}

export default Login;