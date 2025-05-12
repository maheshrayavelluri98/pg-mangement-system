import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ auth }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await auth.login(email, password);
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
            Sign in to your account
          </h3>
        </div>

        {/* Glassmorphism Card */}
        <div className="backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 rounded-xl border border-gray-200 border-opacity-20 shadow-lg p-8 transform transition-all duration-500 ease-in-out hover:shadow-xl hover:bg-opacity-15 glass-effect card-entrance">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
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
                  className="responsive-input appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-15 auth-input auth-input-focus"
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
                  autoComplete="current-password"
                  required
                  className="responsive-input appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-15 auth-input auth-input-focus"
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
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="responsive-button group relative w-full flex justify-center py-3 px-4 border border-transparent font-medium rounded-md text-white bg-blue-600 bg-opacity-80 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg btn-hover-effect"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaSignInAlt className="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
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
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        <div className="text-center transform transition-all duration-300 ease-in-out hover:scale-105">
          <p className="text-sm text-white">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-200 hover:text-white transition-all duration-300 ease-in-out hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
