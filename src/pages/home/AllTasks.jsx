import React, { useState } from "react";
import { Link } from "react-router-dom";
import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/Config";
import { ClimbingBoxLoader, ClockLoader, HashLoader } from "react-spinners";
import Moment from "react-moment";

const AllTasks = ({ user, btnAddTask }) => {
  const [order, setOrder] = useState("asc");
  const [select, setSelect] = useState("all");
  const [initalData, setInitalData] = useState(
    // @ts-ignore
    query(collection(db, user.uid))
  );
  const [value, loading, error] = useCollection(initalData);

  if (loading) {
    return (
      <section className="all-tasks">
        <HashLoader color="#36d7b7" size={150} />
      </section>
    );
  }

  if (error) {
    return <h1>Error ......</h1>;
  }

  if (value) {
    console.log(value.docs);
    if (value.docs.length === 0) {
      return (
        <section className="all-tasks">
          {/* <h1>Nice you completed your Tasks 😍</h1> */}
          {/* <ClimbingBoxLoader color="#36d7b7" /> */}
          <ClockLoader color="#36d7b7" />
        </section>
      );
    } else {
      return (
        <>
          <section className="home-btns">
            {select === "all" && (
              <>
                <button
                  className=""
                  onClick={() => {
                    setOrder("desc");
                    setInitalData(
                      // @ts-ignore
                      query(collection(db, user.uid), orderBy("id", "desc"))
                    );
                  }}
                  style={{ opacity: order === "asc" ? "1" : ".3" }}
                >
                  Newest First
                </button>
                <button
                  style={{ opacity: order === "asc" ? ".3" : "1" }}
                  className=""
                  onClick={() => {
                    setOrder("asc");
                    setInitalData(
                      // @ts-ignore
                      query(collection(db, user.uid), orderBy("id", "asc"))
                    );
                  }}
                >
                  Oldest First
                </button>
              </>
            )}
            <select
              name=""
              id=""
              className="opt"
              value={select}
              onChange={(e) => {
                if (e.target.value === "com") {
                  setInitalData(
                    query(
                      collection(db, user.uid),
                      where("completed", "==", true)
                    )
                  );
                  setSelect("com");
                } else if (e.target.value === "not") {
                  setInitalData(
                    query(
                      collection(db, user.uid),
                      where("completed", "==", false)
                    )
                  );
                  setSelect("not");
                } else if (e.target.value === "all") {
                  setInitalData(query(collection(db, user.uid)));
                  setSelect("all");
                }
              }}
            >
              <option value="all">All Tasks</option>
              <option value="com">Completed</option>
              <option value="not">Not Completed</option>
            </select>
          </section>
          <section className="all-tasks">
            {value.docs.map((item, index) => {
              return (
                <article key={index}>
                  <Link to={`/edit-task/${item.data().id}`}>
                    <h2>{item.data().title}</h2>
                    <ul>
                      {item.data().details.map((item, index) => {
                        if (index < 2) {
                          return <li key={index}>{item}</li>;
                        }
                        return false;
                      })}
                    </ul>

                    <p className="all-tasks__time">
                      <Moment fromNow date={item.data().id} />
                    </p>
                  </Link>
                </article>
              );
            })}
          </section>
          <section>
            <button onClick={() => btnAddTask()}>Add Task</button>
          </section>
        </>
      );
    }
  }
};

export default AllTasks;
