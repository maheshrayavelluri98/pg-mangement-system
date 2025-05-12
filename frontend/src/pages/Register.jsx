import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";

const Register = ({ auth }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pgName: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { name, email, password, confirmPassword, pgName, address, phone } =
    formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    // Remove confirmPassword from data sent to API
    const registerData = { ...formData };
    delete registerData.confirmPassword;

    await auth.register(registerData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 responsive-p">
      <div className="max-w-md w-full space-y-8 responsive-container">
        <div className="text-center">
          <div className="logo-container">
            <img
              src="/sebzy1-removebg-preview.png"
              alt="Sebzy Logo"
              className="logo-image"
            />
          </div>
          <h2 className="mt-3 text-center responsive-title font-extrabold text-white">
            <span className="font-bold">Sebzy</span> PG Management
          </h2>
          <h3 className="mt-2 text-center responsive-subtitle text-blue-100">
            Create your account
          </h3>
        </div>

        {/* Glassmorphism Card */}
        <div className="backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 rounded-xl border border-gray-200 border-opacity-20 shadow-lg p-8 transform transition-all duration-500 ease-in-out hover:shadow-xl hover:bg-opacity-15 glass-effect card-entrance">
          {error && (
            <div
              className="bg-red-400 bg-opacity-20 border border-red-400 border-opacity-30 text-white px-4 py-3 rounded-lg mb-4 transform transition-all duration-300 ease-in-out animate-pulse shake-animation"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="transform transition-all duration-300 ease-in-out">
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent sm:text-sm transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-15 auth-input auth-input-focus"
                placeholder="Full Name"
                value={name}
                onChange={onChange}
              />
            </div>
            <div className="transform transition-all duration-300 ease-in-out">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent sm:text-sm transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-15"
                placeholder="Email address"
                value={email}
                onChange={onChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent sm:text-sm transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-15"
                placeholder="Password"
                value={password}
                onChange={onChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white opacity-70 hover:opacity-100 transition-opacity duration-200 password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent sm:text-sm transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-15"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={onChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white opacity-70 hover:opacity-100 transition-opacity duration-200 password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="transform transition-all duration-300 ease-in-out">
              <label htmlFor="pgName" className="sr-only">
                PG Name
              </label>
              <input
                id="pgName"
                name="pgName"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent sm:text-sm transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-15"
                placeholder="PG Name"
                value={pgName}
                onChange={onChange}
              />
            </div>
            <div className="transform transition-all duration-300 ease-in-out">
              <label htmlFor="address" className="sr-only">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent sm:text-sm transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-15"
                placeholder="Address"
                value={address}
                onChange={onChange}
              />
            </div>
            <div className="transform transition-all duration-300 ease-in-out">
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent sm:text-sm transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-15"
                placeholder="Phone Number"
                value={phone}
                onChange={onChange}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="responsive-button group relative w-full flex justify-center py-3 px-4 border border-transparent font-medium rounded-md text-white bg-blue-600 bg-opacity-80 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg btn-hover-effect"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaUserPlus className="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
                </span>
                <span className="transition-all duration-300 ease-in-out">
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "Register"
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        <div className="text-center transform transition-all duration-300 ease-in-out hover:scale-105">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-200 hover:text-white transition-all duration-300 ease-in-out hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
