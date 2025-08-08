import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CommentsModal({ postId, onClose, show }) {
  const staticComments = [
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

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 2;

  const handleNewComment = (e) => {
    setNewComment(e.target.value);
  };

  const postNewComment = () => {
    const content = newComment.trim();
    if (content === "") return;

    const userName = localStorage.getItem("userName") || "anonymous";
    const newC = {
      id: Date.now(),
      user_id: userName,
      content,
      created_at: new Date().toISOString(),
    };

    setComments([newC, ...comments]);
    setNewComment("");
  };

  const fetchComments = () => {
    if (!hasMore) return;
    const more = staticComments.slice(comments.length, comments.length + LIMIT);
    setComments([...comments, ...more]);

    if (comments.length + LIMIT >= staticComments.length) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    setComments([]); // reset on mount
    setHasMore(true);
    fetchComments();
  }, [postId]);

  if (!show) return null; // Don't render modal if `show` is false

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Comments</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Write a comment..."
              value={newComment}
              onChange={handleNewComment}
            />
            <button className="btn btn-primary mb-3" onClick={postNewComment}>
              Submit
            </button>

            <div className="comments-list">
              {comments.map((x) => (
                <div key={x.id} className="border rounded p-2 mb-2">
                  <strong>{x.user_id}:</strong>
                  <p className="mb-1">{x.content}</p>
                </div>
              ))}
            </div>

            {hasMore && (
              <button className="btn btn-link" onClick={fetchComments}>
                Load More...
              </button>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
