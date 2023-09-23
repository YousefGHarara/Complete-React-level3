//

import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/Config";
import { HashLoader } from "react-spinners";
import Moment from "react-moment";
import { useRef, useState } from "react";
import ReactLoading from "react-loading";

const SubTitleSection = ({ user, id, completedCheckBox, deleteSubTask }) => {
  const [value, loading, error] = useDocument(doc(db, user.uid, id));
  const [showAddNewTask, setShowAddNewTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState("");
  const [showLoadOnAddTask, setShowLoadOnAddTask] = useState(true);
  const ref = useRef();

  /*
  ========================
  FUNCTIONS
  ========================
  */

  const showNewTask = () => {
    setShowAddNewTask(true);
    // @ts-ignore
    // ref.current.focus();
  };

  const hideNewTask = () => {
    setShowAddNewTask(false);
  };

  const addNewTask = async (e) => {
    e.preventDefault();
    setNewTaskData("");
    if (newTaskData === "") {
      console.log("Item is empty");
    } else {
      setShowLoadOnAddTask(false);
      await updateDoc(doc(db, user.uid, id), {
        details: arrayUnion(newTaskData),
      });
      setShowLoadOnAddTask(true);
    }
  };

  if (loading) {
    return (
      <section className="edit-task__tasks">
        <HashLoader color="#36d7b7" size={150} />
      </section>
    );
  }

  if (value) {
    return (
      <section className="edit-task__tasks">
        <article>
          <p>
            Created: <Moment fromNow date={value.data().id} />
          </p>
          <label htmlFor="ch-completed" className="edit-task__label-checkbox">
            Complete
            <input
              type="checkbox"
              defaultChecked={value.data().completed}
              id="ch-completed"
              className="edit-task__input-checkbox"
              onChange={(e) => completedCheckBox(e)}
            />
          </label>
        </article>

        <ul>
          {value.data().details.map((item, index) => {
            return (
              <li key={index}>
                <p>{item}</p>
                <i
                  className="fa-solid fa-trash"
                  onClick={() => deleteSubTask(item)}
                ></i>
              </li>
            );
          })}

          {showAddNewTask && (
            <li className="add-new-task">
              <form className="add-new-task-form">
                <input
                  type="text"
                  value={newTaskData}
                  className="input-add-task"
                  ref={ref}
                  onChange={(e) => setNewTaskData(e.target.value)}
                />
                <button
                  className="add btn-all"
                  onClick={(e) => addNewTask(e)}
                >
                  {showLoadOnAddTask ? (
                    "Add"
                  ) : (
                    <ReactLoading
                      type={"spinningBubbles"}
                      color={"white"}
                      height={20}
                      width={20}
                    />
                  )}
                </button>
                
                <button className="cancel btn-all" onClick={() => hideNewTask()}>
                  Cancel
                </button>
              </form>
            </li>
          )}
        </ul>
        <div style={{ textAlign: "center" }}>
          <button className="btn-all" onClick={() => showNewTask()}>
            Add More
          </button>
        </div>
      </section>
    );
  }
};

export default SubTitleSection;
