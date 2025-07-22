import Sidebar from "../components/Sidebar";
import { Outlet, Navigate } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 h-screen overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;