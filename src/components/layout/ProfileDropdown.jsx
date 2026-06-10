import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Activity, LogOut, FileText, Monitor, ChevronDown } from "lucide-react";

const ProfileDropdown = ({ toggleKotOpen, isSuperAdmin, isPrivilegedUser, usesPos, usesKds }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const auth = userString ? JSON.parse(userString) : null;
  const userRoles = auth?.roles || [];
  
  const isKitchenStaff = userRoles.includes("Kitchen");
  const isOrgAdmin = userRoles.includes("OrgAdmin");

  // Fallback image
  const avatarUrl = "https://ui-avatars.com/api/?name=" + (auth?.name || "Admin") + "&background=random";

  const handleLogout = () => {
    localStorage.removeItem("cartOrders");
    localStorage.removeItem("selectedOutlet");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleProfileModal = () => setIsProfileModalOpen(!isProfileModalOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
      >
        <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
        <span className="text-sm font-medium hidden sm:block">
          {auth?.name || auth?.userName || "Admin"}
        </span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500">Welcome</p>
            <p className="text-sm font-semibold truncate">{auth?.userName || auth?.name || "Admin"}!</p>
          </div>

          {!isKitchenStaff && (
            <div className="py-1">
              {(!isSuperAdmin && (usesPos || isPrivilegedUser)) && (
                <button onClick={() => { setIsDropdownOpen(false); navigate("/pos"); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 md:hidden">
                  <Monitor size={16} /> POS
                </button>
              )}

              {(!isSuperAdmin && (usesKds || isPrivilegedUser)) && (
                <button onClick={() => { setIsDropdownOpen(false); navigate("/kds"); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 md:hidden">
                  <Monitor size={16} /> KDS
                </button>
              )}

              <button onClick={() => { setIsDropdownOpen(false); if (toggleKotOpen) toggleKotOpen(); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 md:hidden">
                <FileText size={16} /> KOT
              </button>

              <button onClick={() => { setIsDropdownOpen(false); toggleProfileModal(); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <User size={16} /> My Profile
              </button>

              <button onClick={() => { setIsDropdownOpen(false); navigate("/change-password"); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <Lock size={16} /> Change password
              </button>
            </div>
          )}

          {!isSuperAdmin && !isOrgAdmin && (
            <div className="py-1 border-t border-gray-100">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <Activity size={16} /> Activity
              </button>
            </div>
          )}

          <div className="py-1 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">My Profile</h3>
              <button onClick={toggleProfileModal} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <h4 className="text-xl font-bold">{auth?.name || auth?.userName || "Admin"}</h4>
                  <p className="text-gray-500 text-sm">Email: {auth?.email || "-"}</p>
                  <p className="text-gray-500 text-sm">Username: {auth?.userName || "-"}</p>
                  <p className="text-gray-500 text-sm">ID: #{auth?.id || "-"}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
              <button onClick={toggleProfileModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Close</button>
              <button onClick={() => { toggleProfileModal(); navigate("/profile"); }} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded">Open Full Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
