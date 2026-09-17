import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../helpers/api";
import Notification from "../components/Notification";
import { useNavigate, Link } from "react-router-dom";
import { Person as PersonOutlineIcon, Lock as LockOutlinedIcon } from "@mui/icons-material";

function Registration() {
  const [notif, setNotif] = useState({ open: false, message: "", severity: "error" });
  let navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    api.post("/auth", data).then((response) => {
      if (response.data.error) {
        setNotif({ open: true, message: response.data.error, severity: "error" });
      } else {
        setNotif({ open: true, message: "Registered successfully! You can log in now.", severity: "success" });
        navigate("/login");
      }
    });
  };

  return (
    <div
      className="loginContainer"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/LRP.jpeg)` }}
    >
      <div className="glassCard">
        <h1>Register</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <ErrorMessage name="username" component="span" />
            <div className="inputWithIcon">
              <Field
                autocomplete="off"
                id="inputCreatePost"
                name="username"
                placeholder="(Ex. John123...)"
              />
              <PersonOutlineIcon className="icon" />
            </div>

            <ErrorMessage name="password" component="span" />
            <div className="inputWithIcon">
              <Field
                autocomplete="off"
                type="password"
                id="inputCreatePost"
                name="password"
                placeholder="Your Password..."
              />
              <LockOutlinedIcon className="icon" />
            </div>

            <button type="submit" className="pillButton">Register</button>
          </Form>
        </Formik>

        <p className="switchLink">
          Already have an account? <Link to="/login">Login</Link>
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

export default Registration;