import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../helpers/api";
import Notification from "../components/Notification";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const [notif, setNotif] = useState({ open: false, message: "", severity: "error" })
  let navigate = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
    username: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    postText: Yup.string().required(),
  });

  const onSubmit = (data) => {
    api
      .post("/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") }
      })
      .then((response) => {
        if (response.data.error) {
          setNotif({ open: true, message: response.data.error, severity: "error" });
        } else {
          navigate("/");
        }
      });
  };

  return (
    <div
      className="createPostPage"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/CP.jpeg)` }}
    >
      <div className="glassCard">
        <h1>Create Post</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <ErrorMessage name="title" component="span" />
            <div className="inputWithIcon">
              <Field
                autocomplete="off"
                name="title"
                placeholder="(Ex. Title...)"
              />
            </div>

            <ErrorMessage name="postText" component="span" />
            <div className="inputWithIcon">
              <Field
                autocomplete="off"
                name="postText"
                placeholder="(Ex. Post...)"
              />
            </div>

            <button type="submit" className="pillButton">Create Post</button>
          </Form>
        </Formik>
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

export default CreatePost;