import React from "react";
import ReactLoading from "react-loading";
import Model from "../../shared/model/Model";

const HomeModel = ({
  closeModel,
  titleInput,
  detailsInput,
  addDetails,
  array,
  data,
  btnSubmit,
  showLoadOnSubmitTask,
}) => {
  return (
    <Model closeModel={closeModel}>
      <div style={{ textAlign: "left" }}>
        <input
          type="text"
          placeholder="Add Title:"
          onChange={(e) => titleInput(e)}
        />
        <div>
          <input
            type="text"
            placeholder="details"
            value={data}
            onChange={(e) => detailsInput(e)}
          />
          <button
            style={{ marginRight: "10px" }}
            className="btn-all"
            onClick={(e) => addDetails(e)}
          >
            Add
          </button>
        </div>

        <ul className="model-details">
          {array.map((item, index) => {
            return (
              <li
                key={index}
                style={{
                  listStylePosition: "inside",
                  listStyleType: "circle",
                }}
              >
                {item}
              </li>
            );
          })}
        </ul>

        <button className="btn-all" onClick={(e) => btnSubmit(e)}>
          {showLoadOnSubmitTask ? (
            "Submit"
          ) : (
            <ReactLoading
              type={"spinningBubbles"}
              color={"white"}
              height={20}
              width={20}
            />
          )}
        </button>
      </div>
    </Model>
  );
};

export default HomeModel;
