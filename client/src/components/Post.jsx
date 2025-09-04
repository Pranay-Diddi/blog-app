import { useNavigate } from "react-router-dom";
import { usePostsContext } from "../contexts/PostsContext";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import CommentsModal from "./CommentsModal";

const Post = ({ post }) => {
  if (!post) return null;
  // const comments = [];
  const comments = [
    {
      id: 1,
      post_id: 101,
      user_id: "user123",
      content: "This is awesome! 🔥",
      created_at: "2025-07-28T10:30:00Z",
    },
    {
      id: 2,
      post_id: 101,
      user_id: "john_doe",
      content: "Great post, thanks for sharing!",
      created_at: "2025-07-28T11:00:00Z",
    },
    {
      id: 3,
      post_id: 101,
      user_id: "dev_girl",
      content: "Very helpful. Learned something new today.",
      created_at: "2025-07-28T11:15:00Z",
    },
  ];

  const { deletePost } = usePostsContext();
  const navigate = useNavigate();
  const userid = localStorage.getItem("userId");

  const [showOptions, setShowOptions] = useState(false);
  const [likes, setLikes] = useState(post.reactions);
  const [hasLiked, setHasLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleEditClick = () => {
    navigate("/create-post", { state: { postToEdit: post } });
  };

  const handleComments = () => {
    return <CommentsModal />;
  };

  const handleLike = async () => {
    if (hasLiked) {
      alert("You've already liked the post");
      return;
    }

    try {
      const res = await axios.put(
        `https://blog-server-liry.onrender.com/like/${post.id}`,
        {
          userid,
        }
      );

      if (res.data.message === "You've liked the post!!") {
        setLikes(res.data.likes);
        setHasLiked(true); // prevent further likes
      } else {
        alert(res.data.message); // "You've already liked it!!"
        setHasLiked(true); // still prevent further likes
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="card post-card" style={{ width: "27rem" }}>
      <div className="card-body">
        <h5 className="card-title d-flex justify-content-between align-items-start">
          {post.title}
          <div style={{ position: "relative" }}>
            <BsThreeDotsVertical
              style={{
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
              onClick={toggleOptions}
            />
            {showOptions && (
              <div
                className="manipulationsDiv bg-light border rounded shadow-sm"
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "0",
                  width: "100px",
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 10,
                  fontSize: "1rem",
                }}
              >
                <p
                  className="m-0 p-2 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={handleEditClick}
                >
                  Edit
                </p>
                <p
                  className="m-0 p-2"
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </p>
              </div>
            )}
          </div>
        </h5>

        <p className="card-text">{post.description}</p>

        {post.tags.map((tag) => (
          <span key={tag} className="badge text-bg-primary hash-tag">
            {tag}
          </span>
        ))}

        <div className="alert alert-success reactions mt-2" role="alert">
          <button onClick={handleLike}>❤️ {likes}</button>
          <button onClick={() => setShowModal(true)}>💬 Open Comments</button>
          {showModal && (
            <CommentsModal
              postId={post.id}
              show={showModal}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
