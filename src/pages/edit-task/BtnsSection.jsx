import { db } from "../../firebase/Config";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router-dom";

const BtnsSection = ({ deleteTask, user, id }) => {
  const [value, loading, error] = useDocument(doc(db, user.uid, id));
  const navigate = useNavigate();

  if (value) {
    return (
      <section className="edit-task__btns">
        <button
          className="btn-all"
          onClick={() => {
            deleteTask();
          }}
        >
          Delete Task
        </button>
      </section>
    );
  }
};

export default BtnsSection;
