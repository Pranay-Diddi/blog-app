import { useState, useEffect } from "react";
import axios from "axios";

const usePostStore = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          "https://blog-server-liry.onrender.com/posts"
        );
        const formattedPosts = res.data.map((post) => ({
          ...post,
          // reactions: Math.floor(Math.random() * 10),
          tags:
            typeof post.tags === "string" ? post.tags.split(" ") : post.tags,
        }));
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return posts;
};

export default usePostStore;
