import Navbar from "@/components/Navbar"; // adjust path based on your structure
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 md:ml-64 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
