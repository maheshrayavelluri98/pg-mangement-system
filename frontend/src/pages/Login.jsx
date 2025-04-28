import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaBuilding } from "react-icons/fa";

const Login = ({ auth }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <FaBuilding className="h-16 w-16 text-white" />
          </div>
          <h2 className="mt-3 text-center text-3xl font-extrabold text-white">
            <span className="font-bold">Sebzy</span> PG Management
          </h2>
          <h3 className="mt-2 text-center text-xl text-blue-100">
            Sign in to your account
          </h3>
        </div>

        {/* Glassmorphism Card */}
        <div className="backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 rounded-xl border border-gray-200 border-opacity-20 shadow-lg p-8">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 border-opacity-30 placeholder-gray-300 text-white bg-white bg-opacity-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 bg-opacity-80 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-all duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaSignInAlt className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
                </span>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-white">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-200 hover:text-white transition-colors"
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
