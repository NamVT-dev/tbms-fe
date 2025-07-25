// components/PartnerHeader.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Header = ({ setSidebarOpen }) => {
  const [user, setUser] = useState({
    name: "",
    photo: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("http://localhost:9999/auth/profile", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.data.data);
    };

    fetchProfile();
  }, []);
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-1">
            <button
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              onClick={() => {}}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 text-gray-400 hover:text-gray-500">
              <BellIcon className="w-6 h-6" />
            </button>
            <Link to="/partner/profile" className="flex items-center">
              <img
                src={user.photo}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">Partner</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
