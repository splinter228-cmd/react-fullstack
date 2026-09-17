import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../helpers/api";
import Notification from "../components/Notification";
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [notif, setNotif] = useState({ open: false, message: "", severity: "error" });
    let navigate = useNavigate();

    const initialValues = {
        oldPassword: "",
        newPassword: "",
    };

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().min(3).max(15).required("Enter old password"),
        newPassword: Yup.string().min(4).max(20).required("Enter new password"),
    });

    const onSubmit = (data) => {
        api
            .put(
                "/auth/changepassword",
                {
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                if (response.data.error) {
                    setNotif({ open: true, message: response.data.error, severity: "error" });
                } else {
                    setNotif({ open: true, message: "Password changed successfully!", severity: "success" });
                    navigate("/");
                }
            });
    };

    return (
        <div 
        className="loginContainer"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/LRP.jpeg)` }}
        >
            <h1>Change Password</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Old Password:</label>
                    <ErrorMessage name="oldPassword" component="span" />
                    <Field
                        autocomplete="off"
                        type={showPassword ? "text" : "password"}
                        name="oldPassword"
                    />

                    <label>New Password:</label>
                    <ErrorMessage name="newPassword" component="span" />
                    <Field
                        autocomplete="off"
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                    />

                    <label>
                        <input
                            type="checkbox"
                            onChange={(event) => setShowPassword(event.target.checked)}
                        /> Show password
                    </label>

                    <button type="submit"> Save Change </button>
                </Form>
            </Formik>

            <Notification
                open={notif.open}
                message={notif.message}
                severity={notif.severity}
                onClose={() => setNotif({ ...notif, open: false})}
            />
        </div>
    );
}

export default ChangePassword;
