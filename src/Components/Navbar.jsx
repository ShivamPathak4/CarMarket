import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "../Redux/action";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { 
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineUser,
  HiOutlineLogout 
} from "react-icons/hi";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allState = useSelector((store) => store);

  const userName = JSON.parse(localStorage.getItem("user"))?.name?.replace(/['"]+/g, "") || "";
  const token = localStorage.getItem("Buycartoken");
  const isLoggedIn = allState.loginReducer.loginStatus || token;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const AuthenticatedLinks = () => (
    <>
      <Link to="/">
        <li className="hover:text-blue-500 transition-colors">Home</li>
      </Link>
      <Link to="/sellyourcar">
        <li className="hover:text-blue-500 transition-colors">Sell Your Car</li>
      </Link>
      <Link to="/yourpost">
        <li className="hover:text-blue-500 transition-colors">Your Post</li>
      </Link>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => dispatch(setModalOpen(true))}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          Log out
        </button>
        <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
          {userName}
        </span>
      </div>
    </>
  );

  const UnauthenticatedLinks = () => (
    <>
      <Link to="/signup">
        <li className="hover:text-blue-500 transition-colors">Sign up</li>
      </Link>
      <Link to="/signin">
        <li className="hover:text-blue-500 transition-colors">Sign in</li>
      </Link>
    </>
  );

  const AuthenticatedMobileLinks = () => (
    <>
      <Link to="/" onClick={toggleMobileMenu}>
        <li className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
          <HiOutlineHome className="w-6 h-6" />
          <span>Home</span>
        </li>
      </Link>
      <Link to="/sellyourcar" onClick={toggleMobileMenu}>
        <li className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
          <HiOutlinePlusCircle className="w-6 h-6" />
          <span>Sell Your Car</span>
        </li>
      </Link>
      <Link to="/yourpost" onClick={toggleMobileMenu}>
        <li className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
          <HiOutlineUser className="w-6 h-6" />
          <span>Your Post</span>
        </li>
      </Link>
      <button
        onClick={() => {
          dispatch(setModalOpen(true));
          toggleMobileMenu();
        }}
        className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
      >
        <HiOutlineLogout className="w-6 h-6" />
        <span>Log out</span>
      </button>
      <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
        {userName}
      </div>
    </>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1
              onClick={() => navigate("/")}
              className="text-2xl font-bold text-blue-600 cursor-pointer font-sans"
            >
              SpyneCar
            </h1>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8">
            {isLoggedIn ? <AuthenticatedLinks /> : <UnauthenticatedLinks />}
          </ul>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <HiOutlineX className="block h-6 w-6" />
              ) : (
                <HiOutlineMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <ul className="flex flex-col space-y-4 p-4">
            {isLoggedIn ? <AuthenticatedMobileLinks /> : <UnauthenticatedLinks />}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;