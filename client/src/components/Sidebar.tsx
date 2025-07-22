import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users,Bot } from "lucide-react";

const Sidebar = () => {
  return (
    <div className=" h-screen bg-white text-gray-800 border-r pt-7">
      <div className="p-4 flex items-center w-full justify-center">
        <Bot className="h-8 w-8 text-purple-600" />
        <h2 className="text-xl  font-bold ml-2">AI CRM</h2>
      </div>
      <nav className="mt-4 px-5 flex flex-col gap-5">
        <NavLink
          to="/home/dashboard"
          className={({ isActive }) =>
            `flex items-center py-2.5 px-4 rounded-lg transition duration-200 hover:bg-purple-100 ${
              isActive ? "bg-purple-200 text-purple-800" : ""
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/home/contacts"
          className={({ isActive }) =>
            `flex items-center py-2.5 px-4 rounded-lg transition duration-200 hover:bg-purple-100 ${
              isActive ? "bg-purple-200 text-purple-800" : ""
            }`
          }
        >
          <Users className="h-5 w-5 mr-3" />
          Contacts
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
