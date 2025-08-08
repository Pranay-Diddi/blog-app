import axios from "axios";
import { useState, useEffect } from "react";
import Post from "./Post";
export default function Dashboard() {
  const userName = localStorage.getItem("username");
  const userid = localStorage.getItem("userId");
  const [userposts, setUserPosts] = useState([]);
  const getUserPosts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/userposts", {
        params: { userid: userid },
      });
      setUserPosts(response.data.userposts); // Make sure to access `.data`
      console.log("Fetched posts:", response.data.userposts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (userid) {
      getUserPosts();
    }
  }, []);

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          padding: "10px",
          fontFamily: "serif",
          fontSize: "50px",
          marginTop: "10px",
        }}
      >
        Welcome {userName}!!
      </h1>

      <div className="container mt-4">
        <p
          style={{
            fontSize: "25px",
            fontWeight: "700",
            fontFamily: "serif",
            marginLeft: "20px",
          }}
        >
          Your Posts
        </p>
        {userposts && userposts.length > 0 ? (
          <div className="row g-4">
            {userposts.map((post) => (
              <div key={post.id} className="col-md-4">
                <Post post={post} />
              </div>
            ))}
          </div>
        ) : (
          <h1
            style={{
              textAlign: "center",
              padding: "10px",
              fontFamily: "serif",
              fontSize: "30px",
              marginTop: "10px",
            }}
          >
            You havent posted anything!!{" "}
          </h1>
        )}
      </div>
    </>
  );
}
