import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, auth } from "../config/Firebase";
import { toast } from "sonner";

import login from "../assets/home/login.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Login successful!", { id: toastId });
      setForm({ email: "", password: "" });
      navigate("/");
    } catch {
      toast.error("Invalid email or password", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Gym Image */}
      <div
        className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center"
        style={{
          backgroundImage: `url(${login})`,
        }}
      />

      {/* Right Side - Login Card */}
      <div
        className="w-full md:w-1/2 mt-5 flex items-center justify-center 
                bg-gradient-to-br from-gray-900 via-purple-950 to-gray-800 px-6 py-10"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-center text-sm text-gray-600">
            Access your account to manage your fitness plans
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : ""
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : ""
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="********"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-blue-400" : "bg-blue-600"
              } text-white font-semibold py-2 rounded-lg transition hover:bg-blue-700`}
            >
              {loading ? "Processing..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
