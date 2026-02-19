import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  auth,
  db,
  createUserWithEmailAndPassword,
} from "../config/Firebase";
import { toast } from "sonner";

import login from "../assets/home/login.jpg";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
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

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading("Signing up...");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        role: "user",
        createdAt: new Date(),
      });

      toast.success("Signup successful!", { id: toastId });
      setForm({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      <div
        className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center"
        style={{
          backgroundImage: `url(${login})`,
        }}
      />
      <div
        className="w-full md:w-1/2 mt-5 flex items-center justify-center 
                bg-gradient-to-br from-gray-900 via-purple-950 to-gray-800 px-6 py-10"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create Your Account
          </h2>
          <p className="text-center text-sm text-gray-600">
            Sign up to access your personalized fitness dashboard
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.name ? "border-red-500" : ""
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

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
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="********"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-green-400" : "bg-green-600"
              } text-white font-semibold py-2 rounded-lg transition hover:bg-green-700`}
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:underline font-medium"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
