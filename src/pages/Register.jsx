import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import AuthenticationsServices from "../services/AuthenticationService/AuthenticationsServices";

export default function Register() {
  const navigate = useNavigate();
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validation = useFormik({
    initialValues: {
      organizationName: "",
      confirmPassword: "",
      panNumber: "",
      address1: "",
      tel: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      organizationName: Yup.string().required("Organization name is required"),
      panNumber: Yup.string().required("PAN number is required"),
      address1: Yup.string().required("Address is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      tel: Yup.string().required("Telephone number is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMsg("");
      try {
        await AuthenticationsServices.orgRegister(values);
        toast.success("New organization registered successfully.");
        navigate("/login");
      } catch (error) {
        const message = error?.response?.data?.message || error.message || "Registration failed";
        setErrorMsg(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
  });

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
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Saloon Management System
            </h1>
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
              <path d="M20 80 Q 40 20, 80 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M65 30 L 85 43 L 70 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Form for Large screens, Full screen for Small screens) */}
      <div className="w-full lg:w-6/12 h-full relative flex flex-col items-center justify-center bg-[#0f403b] overflow-y-auto">
        {/* Background Image for Mobile Only */}
        <div 
          className="lg:hidden absolute inset-0 bg-cover bg-center fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="lg:hidden absolute inset-0 bg-black/60 fixed" />

        <div className="relative z-10 w-full max-w-lg p-6 sm:p-10 flex flex-col justify-center min-h-full py-12">
          <div className="text-center mb-8">
            {/* Mobile Title */}
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <h3 className="text-2xl font-bold text-white text-center">
                Saloon Management System
              </h3>
            </div>
            <h5 className="text-gray-300 lg:text-gray-300 text-lg">
              Sign up to continue to Saloon System admin panel
            </h5>
          </div>

          {errorMsg && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 border border-red-500/50">
              {errorMsg}
            </div>
          )}

          <form onSubmit={validation.handleSubmit} className="flex flex-col gap-4">
            {/* Organization Name */}
            <div>
              <input
                name="organizationName"
                type="text"
                placeholder="Enter organization name"
                className={`w-full p-3.5 rounded-md outline-none bg-white text-gray-800 ${
                  validation.touched.organizationName && validation.errors.organizationName ? 'border-2 border-red-500' : ''
                }`}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.organizationName}
              />
              {validation.touched.organizationName && validation.errors.organizationName && (
                <div className="text-red-400 text-sm mt-1">{validation.errors.organizationName}</div>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                placeholder="Enter email address"
                className={`w-full p-3.5 rounded-md outline-none bg-white text-gray-800 ${
                  validation.touched.email && validation.errors.email ? 'border-2 border-red-500' : ''
                }`}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.email}
              />
              {validation.touched.email && validation.errors.email && (
                <div className="text-red-400 text-sm mt-1">{validation.errors.email}</div>
              )}
            </div>

            {/* Address */}
            <div>
              <input
                name="address1"
                type="text"
                placeholder="Enter address"
                className={`w-full p-3.5 rounded-md outline-none bg-white text-gray-800 ${
                  validation.touched.address1 && validation.errors.address1 ? 'border-2 border-red-500' : ''
                }`}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.address1}
              />
              {validation.touched.address1 && validation.errors.address1 && (
                <div className="text-red-400 text-sm mt-1">{validation.errors.address1}</div>
              )}
            </div>

            {/* PAN & Telephone */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  name="panNumber"
                  type="text"
                  placeholder="Enter PAN number"
                  className={`w-full p-3.5 rounded-md outline-none bg-white text-gray-800 ${
                    validation.touched.panNumber && validation.errors.panNumber ? 'border-2 border-red-500' : ''
                  }`}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.panNumber}
                />
                {validation.touched.panNumber && validation.errors.panNumber && (
                  <div className="text-red-400 text-sm mt-1">{validation.errors.panNumber}</div>
                )}
              </div>
              <div className="flex-1">
                <input
                  name="tel"
                  type="tel"
                  placeholder="Enter telephone number"
                  className={`w-full p-3.5 rounded-md outline-none bg-white text-gray-800 ${
                    validation.touched.tel && validation.errors.tel ? 'border-2 border-red-500' : ''
                  }`}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.tel}
                />
                {validation.touched.tel && validation.errors.tel && (
                  <div className="text-red-400 text-sm mt-1">{validation.errors.tel}</div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type={passwordShow ? "text" : "password"}
                placeholder="Enter password"
                className={`w-full p-3.5 pr-12 rounded-md outline-none bg-white text-gray-800 ${
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

            {/* Confirm Password */}
            <div className="relative">
              <input
                name="confirmPassword"
                type={confirmPasswordShow ? "text" : "password"}
                placeholder="Confirm password"
                className={`w-full p-3.5 pr-12 rounded-md outline-none bg-white text-gray-800 ${
                  validation.touched.confirmPassword && validation.errors.confirmPassword ? 'border-2 border-red-500' : ''
                }`}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.confirmPassword}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
              >
                {confirmPasswordShow ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {validation.touched.confirmPassword && validation.errors.confirmPassword && (
                <div className="text-red-400 text-sm mt-1">{validation.errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#75B787] hover:bg-[#5da06e] text-white font-semibold py-4 rounded-md transition duration-300 mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                "Register"
              )}
            </button>

            <div className="text-center text-white mt-2">
              Already registered account?{" "}
              <Link to="/login" className="text-[#e2a84a] hover:text-[#f3b552] font-medium transition-colors">
                Login
              </Link>
            </div>
          </form>

          <footer className="mt-8 text-center pb-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Danfe Solution
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
