import { useNavigate, useLocation } from "react-router-dom";
import { useReducer, useState, useEffect } from "react";
import { intialState, createPostReducer } from "../contexts/CreatePostReducer";
import { usePostsContext } from "../contexts/PostsContext";
import { useOutletContext } from "react-router-dom";
import { setIsEditing } from "../js/isEditing";

const CreatePost = () => {
  const location = useLocation();
  const postToEdit = location.state?.postToEdit;
  const { addPost, editPost } = usePostsContext();
  const navigate = useNavigate();
  const { selectedTab, setSelectedTab } = useOutletContext();

  const [currentPost, dispatchPost] = useReducer(
    createPostReducer,
    postToEdit || intialState
  );

  const isEditing = !!postToEdit;
  // setIsEditing(isEditing);

  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (postToEdit) {
      setTagsInput(postToEdit.tags.join(", "));
    }
  }, [postToEdit]);

  useEffect(() => {
    setIsEditing(true);
    return () => setIsEditing(false);
  }, [isEditing]);

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const tagsArray = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    dispatchPost({ type: "tags", payload: tagsArray });

    const updatedPost = { ...currentPost, tags: tagsArray };

    if (isEditing) {
      editPost(updatedPost);
    } else {
      addPost(updatedPost);
    }
    setSelectedTab("Home");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setTagsInput(value); // store string
    } else {
      dispatchPost({
        type: name,
        payload: value,
      });
    }
  };

  return (
    <form className="create-post" onSubmit={handleOnSubmit}>
      <div className="mb-3">
        <label htmlFor="userName" className="form-label">
          Enter Your Name
        </label>
        <input
          type="text"
          name="username" // changed from userId
          className="form-control"
          id="userName" // changed from userId
          value={currentPost.username} // changed from currentPost.userId
          onChange={handleChange}
          placeholder="Sanju"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title of the Post
        </label>
        <input
          type="text"
          name="title"
          className="form-control"
          id="title"
          placeholder="Travelling..."
          value={currentPost.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="body" className="form-label">
          Post Content
        </label>
        <textarea
          rows="4"
          type="text"
          name="description"
          className="form-control"
          id="body"
          value={currentPost.description}
          placeholder="Tell us more about it..."
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="tags" className="form-label">
          Tags
        </label>
        <input
          type="text"
          className="form-control"
          name="tags"
          id="tags"
          placeholder="Chill, Travel, Beach"
          value={tagsInput}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {isEditing ? "Edit" : "Post"}
      </button>
    </form>
  );
};

export default CreatePost;
