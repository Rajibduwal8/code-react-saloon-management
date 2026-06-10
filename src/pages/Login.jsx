import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AuthenticationsServices from "../services/AuthenticationService/AuthenticationsServices";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Login() {
  const navigate = useNavigate();
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedUsers, setSavedUsers] = useState([]);

  useEffect(() => {
    // Load saved users
    const storedUsers = localStorage.getItem("savedUsers");
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        const uniqueUsers = parsedUsers.filter(
          (v, i, a) => a.findIndex((u) => u.user.email === v.user.email) === i
        );
        setSavedUsers(uniqueUsers);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSavedUsers([]);
    }
  }, []);

  const validation = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMsg("");
      try {
        const response = await AuthenticationsServices.login(values);
        toast.success("Login successful");
        
        // Save token & user to localStorage
        if (response) {
          localStorage.setItem("user", JSON.stringify(response));
        }

        navigate("/");
      } catch (error) {
        const message = error?.response?.data?.message || error.message || "Login failed";
        setErrorMsg(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCardClick = (email) => {
    validation.setFieldValue("username", email);
  };

  const handleDeleteUser = (email, e) => {
    e.stopPropagation();
    const updatedUsers = savedUsers.filter((item) => item?.user?.email !== email);
    setSavedUsers(updatedUsers);
    localStorage.setItem("savedUsers", JSON.stringify(updatedUsers));
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* LEFT SIDE (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-6/12 relative h-full flex-col justify-center items-start">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 w-full px-12 pt-12 flex flex-col h-full justify-center">
          <div className="flex items-center gap-4 mb-16">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Saloon Management System
            </h1>
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
              <path d="M20 80 Q 40 20, 80 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M65 30 L 85 43 L 70 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          {/* User Cards */}
          <div className="w-full">
            {savedUsers.length > 0 && (
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  576: { slidesPerView: 2 },
                  768: { slidesPerView: 2 },
                  992: { slidesPerView: 2 },
                  1200: { slidesPerView: 2 },
                }}
                loop={savedUsers.length > 1}
                className="py-3"
              >
                {savedUsers.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div 
                      onClick={() => handleCardClick(item?.user?.email)}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer hover:bg-white/20 transition duration-300 border border-white/20 h-full"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                          {item?.user?.email?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h6 className="text-white font-semibold truncate text-sm">
                            {item?.user?.email}
                          </h6>
                          <div className="flex justify-between items-center mt-2">
                            <span className="bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
                              {item?.user?.roles?.[0] || "User"}
                            </span>
                            <button 
                              onClick={(e) => handleDeleteUser(item?.user?.email, e)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Form for Large screens, Full screen for Small screens) */}
      <div className="w-full lg:w-6/12 h-full pt-12 pb-20 relative flex flex-col items-center justify-center bg-[#0f403b] lg:bg-[#0f403b]">
        {/* Background Image for Mobile Only */}
        <div 
          className="lg:hidden absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="lg:hidden absolute inset-0 bg-black/60" />

        <div className="relative z-10 w-full max-w-lg p-8 sm:p-10 flex flex-col h-full justify-center">
          <div className="text-center mb-8">
            {/* Mobile Title */}
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <h3 className="text-2xl font-bold text-white text-center">
                Saloon Management System
              </h3>
            </div>
            <p className="text-gray-300 lg:text-gray-300 text-lg">
              Sign in to continue to Saloon System admin panel.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 border border-red-500/50">
              {errorMsg}
            </div>
          )}

          <form onSubmit={validation.handleSubmit} className="flex flex-col gap-5">
            <div>
              <input
                name="username"
                type="text"
                placeholder="Enter email"
                className={`w-full p-4 rounded-md outline-none bg-white text-gray-800 ${
                  validation.touched.username && validation.errors.username ? 'border-2 border-red-500' : ''
                }`}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.username}
              />
              {validation.touched.username && validation.errors.username && (
                <div className="text-red-400 text-sm mt-1">{validation.errors.username}</div>
              )}
            </div>

            <div className="relative">
              <input
                name="password"
                type={passwordShow ? "text" : "password"}
                placeholder="Enter Password"
                className={`w-full p-4 pr-12 rounded-md outline-none bg-white text-gray-800 ${
                  validation.touched.password && validation.errors.password ? 'border-2 border-red-500' : ''
                }`}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.password}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setPasswordShow(!passwordShow)}
              >
                {passwordShow ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {validation.touched.password && validation.errors.password && (
                <div className="text-red-400 text-sm mt-1">{validation.errors.password}</div>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center text-white cursor-pointer select-none">
                <input type="checkbox" className="mr-2 w-4 h-4 rounded accent-green-600" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-white hover:text-gray-200 text-sm transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#75B787] hover:bg-[#5da06e] text-white font-semibold py-4 rounded-md transition duration-300 mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center text-white mt-4">
              Not registered account?{" "}
              <Link to="/register" className="text-[#e2a84a] hover:text-[#f3b552] font-medium transition-colors">
                Register
              </Link>
            </div>
          </form>

          <footer className="mt-auto pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Danfe solution
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
