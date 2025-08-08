import { Link } from "react-router-dom";
import { getIsEditing } from "../js/isEditing";
// import isEditing from "./CreatePost";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark sidebar"
      style={{ width: "200px" }}
    >
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <svg className="bi pe-none me-2" width="40" height="32">
          <use xlinkHref="#bootstrap"></use>
        </svg>
        {/* <span className="fs-4"></span> */}
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li
          className="nav-item"
          onClick={() => {
            // console.log("Home CLicked");
            setSelectedTab(() => (selectedTab = "Home"));
          }}
        >
          <Link
            to="/"
            // className={`nav-link text-white ${
            //   selectedTab === "Home" && "active"
            // }`}

            className={`nav-link text-white ${
              selectedTab === "Home" ? "active" : ""
            }`}
            aria-current="page"
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#home"></use>
            </svg>
            Home
          </Link>
        </li>
        <li
          onClick={() => {
            // console.log("CreatePost CLicked");
            setSelectedTab(() => (selectedTab = "Create Post"));
          }}
        >
          <Link
            to="/create-post"
            onClick={(e) => {
              if (getIsEditing()) {
                e.preventDefault(); // block navigation
                alert("Finish editing before navigating.");
              } else {
                setSelectedTab("Create Post"); // only set if not editing
              }
            }}
            className={`nav-link text-white ${
              selectedTab === "Create Post" ? "active" : ""
            }`}
          >
            <svg className="bi pe-none me-2" width="16" height="16">
              <use xlinkHref="#speedometer2"></use>
            </svg>
            Create Post
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
