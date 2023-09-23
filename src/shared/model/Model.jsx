import "./model.css";

const Model = ({ closeModel, children }) => {
  return (
    <div className="parent-of-model">
      <form action="" className={`form-forgot`}>
        {children}
        <span
          className="form-forgot__icon"
          onClick={() => {
            closeModel();
          }}
        >
          <span></span>
        </span>
      </form>
    </div>
  );
};

export default Model;
