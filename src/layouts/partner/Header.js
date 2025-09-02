// components/PartnerHeader.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-1">
            <button
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
        
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 text-gray-400 hover:text-gray-500">
              <BellIcon className="w-6 h-6" />
            </button>
            <Link to="/partner/profile" className="flex items-center">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
              
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
