import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import { use, useState } from "react";
import { Outlet } from "react-router-dom";
import { PostsContextProvider } from "./contexts/PostsContext";
// import AllPosts from "./components/AllPosts";
// import CreatePost from "./components/CreatePost";

function App() {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <PostsContextProvider>
        <div className="app-container">
          <Sidebar
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          ></Sidebar>
          <div className="content">
            <Header></Header>
            <Outlet
              context={{
                isLoggedIn,
                setIsLoggedIn,
                selectedTab,
                setSelectedTab,
              }}
            />
            <Footer></Footer>
          </div>
        </div>
      </PostsContextProvider>
    </>
  );
}

export default App;
