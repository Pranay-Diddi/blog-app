import { useContext, createContext, useReducer, useEffect } from "react";
import usePostStore from "../store/post-list-store";
import axios from "axios";

// Reducer function
function PostsManipulationReducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload;

    case "ADD":
      return [...state, action.payload];

    case "DELETE":
      return state.filter((post) => post.id !== action.payload);

    case "EDIT":
      return state.map((post) =>
        post.id === action.payload.id ? { ...post, ...action.payload } : post
      );

    default:
      return state;
  }
}

// Create context
const PostsContext = createContext();

export const PostsContextProvider = ({ children }) => {
  const fetchedPosts = usePostStore(); // fetches asynchronously
  const [currentPosts, dispatchCurrentPosts] = useReducer(
    PostsManipulationReducer,
    []
  );

  // Set posts from API after they're fetched
  useEffect(() => {
    if (fetchedPosts.length > 0) {
      dispatchCurrentPosts({ type: "SET", payload: fetchedPosts });
    }
  }, [fetchedPosts]);

  // Action methods
  const addPost = async (post) => {
    try {
      // First, send to backend
      const userId = localStorage.getItem("userId");
      await axios.post(
        "http://localhost:4000/addPost",
        post,
        {
          headers: {
            userid: userId,
          },
        }
        // id: localStorage.getItem()
      );

      // Then update local state
      dispatchCurrentPosts({ type: "ADD", payload: post });
    } catch (err) {
      console.error("Failed to add post:", err);
    }
  };

  const deletePost = async (id) => {
    // const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      await axios.delete("http://localhost:4000/deletePost", {
        headers: {
          userid: userId,
        },
        data: {
          id, // <-- this goes under 'data'
        },
      });

      dispatchCurrentPosts({ type: "DELETE", payload: id });
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("You are not authorized to delete this post.");
      } else {
        console.error("Failed to delete post:", err);
        alert("Something went wrong while deleting the post.");
      }
    }
  };

  const editPost = async (updatedPost) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:4000/editPost", updatedPost, {
        headers: {
          userid: userId,
        },
      });
      dispatchCurrentPosts({ type: "EDIT", payload: updatedPost });
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("You are not authorized to edit this post.");
      } else {
        console.error("Failed to edit post", err);
        alert("Something went wrong while deleting the post.");
      }
    }
  };

  return (
    <PostsContext.Provider
      value={{ currentPosts, addPost, deletePost, editPost }}
    >
      {children}
    </PostsContext.Provider>
  );
};

// Custom hook
export const usePostsContext = () => useContext(PostsContext);
