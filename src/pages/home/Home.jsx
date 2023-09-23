import "./home.css";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import Load from "../load/Load";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase/Config";
import { sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import HomeModel from "./HomeModel";
import AllTasks from "./AllTasks";

const Home = () => {
  const [user, loading, error] = useAuthState(auth);

  const sendAgain = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      // Email verification sent!
      console.log("Done Verfication");
      // ...
    });
  };

  const btnAddTask = () => {
    setActiveModel(true);
  };

  /*
  =================================
  FUNCTONS FOR MODEL
  =================================
  */

  const [activeModel, setActiveModel] = useState(false);
  const [array, setArray] = useState([]);
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [showLoadOnSubmitTask, setShowLoadOnSubmitTask] = useState(true);
  const [showMessageLoad, setShowMessageLoad] = useState(false);

  const titleInput = (e) => {
    setTitle(e.target.value);
  };

  const detailsInput = (e) => {
    setData(e.target.value);
  };

  const closeModel = () => {
    setActiveModel(false);
    setData("");
    setArray([]);
    console.log("Closing Model . . . ");
  };

  const addDetails = (e) => {
    e.preventDefault();
    if (title === "") {
      console.log("Title is empty");
    } else if (data === "") {
      console.log("item is empty");
    } else if (array.includes(data)) {
      console.log("item is already exists");
    } else {
      const newData = data.trim().toLowerCase();
      // setArray([...array, newData]);
      array.push(newData);
      setData("");

      console.log(array);
    }
  };

  const btnSubmit = async (e) => {
    e.preventDefault();
    if (title === "") {
      console.log("Title is empty");
    } else {
      setShowLoadOnSubmitTask(false);
      console.log("Waiting ...");
      const constID = new Date().getTime();

      await setDoc(doc(db, `${user.uid}`, `${constID}`), {
        title: title,
        details: array,
        id: constID,
        completed: false
      });

      console.log("Done !!");
      setArray([]);
      setData("");
      setTitle("");
      closeModel();
      setShowLoadOnSubmitTask(true);
      setShowMessageLoad(true);
      setTimeout(() => {
        setShowMessageLoad(false);
      }, 4000);
    }
  };

  /*
  =================================
  End - FUNCTONS FOR MODEL
  =================================
  */

  if (loading) {
    return <Load />;
    // return <HashLoader color="#36d7b7" />;
  }
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Home Page</title>
        </Helmet>
        <Header />

        <>
          <div className="home-page main">
            <h1>
              Please{" "}
              <Link
                to="/signin"
                style={{
                  color: "teal",
                  textDecoration: "none",
                  borderBottom: "4px solid teal",
                }}
              >
                sign in
              </Link>{" "}
              to continue
            </h1>
          </div>
        </>

        <Footer />
      </>
    );
  }

  if (user) {
    if (user.emailVerified) {
      return (
        <>
          <Helmet>
            <title>Home Page</title>
          </Helmet>
          <Header />

          <div className="home-page main">
            <div className="home-content">
              

              {/*
                =================================
                Section - All Tasks
                =================================
              */}

              <AllTasks user={user} btnAddTask={btnAddTask} />

              
            </div>

            <p
              className="task-message"
              style={{ right: showMessageLoad ? "3%" : "-30%" }}
            >
              add task successfully{" "}
              <i className="fa-regular fa-circle-check icon-correct"></i>
            </p>
          </div>

          {activeModel && (
            <HomeModel
              closeModel={closeModel}
              titleInput={titleInput}
              detailsInput={detailsInput}
              addDetails={addDetails}
              array={array}
              data={data}
              btnSubmit={btnSubmit}
              showLoadOnSubmitTask={showLoadOnSubmitTask}
            />
          )}
          <Footer />
        </>
      );
    }

    if (!user.emailVerified) {
      return (
        <>
          <Helmet>
            <title>Home Page</title>
          </Helmet>
          <Header />

          <div className="home-page main">
            <div className="home-content">
              <h1>Home</h1>
              <h2>Please verify your email to continue</h2>
              <button
                className="btn-all"
                onClick={() => {
                  sendAgain();
                }}
              >
                Send Again
              </button>
            </div>
          </div>

          <Footer />
        </>
      );
    }
  }
};

export default Home;
