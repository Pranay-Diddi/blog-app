import Post from "./Post";
import { usePostsContext } from "../contexts/PostsContext";
const PostList = () => {
  const { currentPosts } = usePostsContext();
  return (
    <div className="container mt-4">
      <div className="row g-4">
        {currentPosts.map((post) => (
          <div key={post.id} className="col-md-4">
            <Post post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
