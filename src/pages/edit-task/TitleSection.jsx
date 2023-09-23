//

import { useRef, useState } from "react";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/Config";
import { HashLoader } from "react-spinners";

const TitleSection = ({ user, id, updateTitle }) => {
  const [value, loading, error] = useDocument(doc(db, user.uid, id));
  const ref = useRef();

  if (loading) {
    return (
      <section className="title">
        <HashLoader color="#36d7b7" size={150} />
      </section>
    );
  }

  if (value) {
    return (
      <section className="title">
        <input
          type="text"
          className="input-title"
          // id="input-title"
          defaultValue={value.data().title}
          onChange={(e) => updateTitle(e)}
          ref={ref}
        />
        {/* <label htmlFor="input-title"> */}
        <i
          className="fa-solid fa-pen-to-square edit-icon"
          onClick={() =>
            // @ts-ignore
            ref.current.focus()
          }
        ></i>
        {/* </label> */}
      </section>
    );
  }
};

export default TitleSection;
