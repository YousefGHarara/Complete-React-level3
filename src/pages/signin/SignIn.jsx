import "./signin.css";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import Load from "../load/Load";

import { Helmet } from "react-helmet-async";
// @ts-ignore
import React, { useEffect, useState } from "react";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/Config";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Model from "../../shared/model/Model";

const SignIn = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errAccount, setErrAccount] = useState("");
  const [activeModel, setActiveModel] = useState(false);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [emailReset, setEmailReset] = useState("");

  useEffect(() => {
    if (user && user.emailVerified) {
      navigate("/");
    }
  });

  const resetPassowrd = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, emailReset)
      .then(() => {
        console.log("Done !! Reset . . .");
        setShowSendEmail(true);
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        // @ts-ignore
        const errorMessage = error.message;
        console.log(errorCode);
        // ..
      });
  };

  const signInBTN = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // @ts-ignore
        const user = userCredential.user;
        console.log("Done Sign in !!");
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        // @ts-ignore
        const errorMessage = error.message;
        console.log("Fail in Sign in !!");
        console.log(errorCode);
        switch (errorCode) {
          case "auth/missing-email":
            setErrAccount("Err E-mail");
            break;
          default:
            setErrAccount(errorCode);
        }
      });
  };

  const closeModel = () => {
    setActiveModel(false);
  };

  if (loading) {
    return <Load />;
  }

  return (
    <>
      <Helmet>
        <title>Sign In Page</title>
      </Helmet>

      <Header />
      <div className="my-signin main">
        <div className="signin__content">
          <form action="" className="form-signin">
            <h2 className="signin__title">Sign In</h2>
            <input
              type="email"
              placeholder="E-mail"
              className="signin__input-email"
              // @ts-ignore
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="signin__input-password"
              // @ts-ignore
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="signin__btn-submit"
              onClick={(e) => signInBTN(e)}
            >
              Sign in
            </button>
            <p>
              if you don't have an account <Link to="/signup">Sign Up</Link>
            </p>
          </form>

          {/*
            =============================
            Form - Forgot Passowrd (Model)
            =============================
          */}

          {activeModel && (
            <Model closeModel={closeModel}>
              <input
                type="email"
                placeholder="E-mail"
                onChange={(e) => setEmailReset(e.target.value)}
              />
              <button
                className="btn-all"
                onClick={(e) => {
                  resetPassowrd(e);
                }}
              >
                Reset Password
              </button>
              {showSendEmail && (
                <p className="form-forgot__p-check">
                  Please check your email to reset your password
                </p>
              )}
            </Model>
          )}

          <p
            className="signin__forgot-password"
            onClick={() => setActiveModel(true)}
          >
            Forgot Passowrd !!
          </p>
          {errAccount && (
            <p style={{ color: "red", marginTop: "10px" }}>{errAccount}</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignIn;
