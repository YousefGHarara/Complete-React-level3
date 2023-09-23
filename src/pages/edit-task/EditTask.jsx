import { Helmet } from "react-helmet-async";
import "./editTask.css";

import { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/Config";
import Load from "../../pages/load/Load";
import { useNavigate, useParams } from "react-router-dom";
import TitleSection from "./TitleSection";
import SubTitleSection from "./SubTitleSection";
import BtnsSection from "./BtnsSection";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { HashLoader } from "react-spinners";

const EditTask = () => {
  const [user, loading, error] = useAuthState(auth);
  const [showData, setShowData] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  /*
============================
Fucntions - Title
============================
*/

  const updateTitle = async (e) => {
    await updateDoc(doc(db, user.uid, id), {
      title: e.target.value,
    });
  };

  /*
============================
Fucntions - Sub-Title
============================
*/

  const completedCheckBox = async (e) => {
    await updateDoc(doc(db, user.uid, id), {
      completed: !e.target.defaultChecked,
    });
  };

  const deleteSubTask = async (item) => {
    await updateDoc(doc(db, user.uid, id), {
      details: arrayRemove(item),
    });
  };

  /*
============================
Fucntions - BTNS
============================
*/

  const deleteTask = async () => {
    setShowData(false);
    await deleteDoc(doc(db, user.uid, id));
    console.log("Done Deleted Task !!");
    navigate("/", {replace: true});
  };

  //

  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  });

  if (loading) {
    return <Load />;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (user) {
    if (user.emailVerified) {
      return (
        <>
          <Helmet>
            <title>Home Page</title>
          </Helmet>
          {showData ? (
            <>
              <Header />

              <div className="my-edit-task main">
                <div className="edit-task__content">
                  {/* Title Section */}
                  <TitleSection user={user} id={id} updateTitle={updateTitle} />

                  {/* Sub-Title Section */}
                  <SubTitleSection
                    user={user}
                    id={id}
                    completedCheckBox={completedCheckBox}
                    deleteSubTask={deleteSubTask}
                  />

                  {/* BTNS Section */}
                  <BtnsSection deleteTask={deleteTask} user={user} id={id} />
                </div>
              </div>
              <Footer />
            </>
          ) : (
            <Load />
          )}
        </>
      );
    }
  }
};

export default EditTask;
