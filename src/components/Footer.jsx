import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

// Importing images
import fitness from "../assets/home/fitness.jpg";
import home from "../assets/home/home.jpg";
import equipment from "../assets/home/equipment.jpg";
import trainer from "../assets/home/trainer.jpg";
import logo from "../assets/logob.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await addDoc(collection(db, "newsletter"), {
        email: email.trim(),
        subscribedAt: new Date(),
      });

      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  const imageUrls = [fitness, home, equipment, trainer];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-t from-[#1e0f38] via-[#1c1330] to-[#18181F] text-gray-300 pt-12 px-6"
    >
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Branding & Contact Section */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="StriveFit Logo"
              className="w-12 h-12 object-contain"
            />
            <h2 className="text-3xl font-bold text-purple-500">StriveFit</h2>
          </div>

          <div className="flex flex-col gap-3 mt-3">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-500" />
              Aligarh, Uttarpradesh, India
            </p>

            <p className="flex items-center gap-2">
              <FaPhone className="text-purple-500" />
              +91 XXXXXXXXXX
            </p>

            <p className="flex items-center gap-2">
              <FaEnvelope className="text-purple-500" />
              adibadeveloper02@gmail.com
            </p>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col gap-5">
          <h3 className="text-xl font-semibold mb-2 text-purple-400">
            Subscribe to Our Newsletter
          </h3>

          <p className="text-sm text-gray-400">
            Get fitness tips, training guides, and exclusive StriveFit updates.
          </p>

          <div className="flex gap-2 mb-3 flex-col sm:flex-row">
            
            {/* Tailwind Input */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#1c1330]/70 border border-purple-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Tailwind Button */}
            <button
              onClick={handleSubscribe}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-transform transform hover:scale-105"
            >
              Subscribe
            </button>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-5 text-xl text-purple-400 mt-2">
            <a
              href="#"
              className="hover:text-white transition-transform transform hover:scale-110"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className="hover:text-white transition-transform transform hover:scale-110"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="hover:text-white transition-transform transform hover:scale-110"
            >
              <FaTwitter />
            </a>

            <a
              href="mailto:support@strivefit.com"
              className="hover:text-white transition-transform transform hover:scale-110"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Footer Image Gallery */}
        <div className="grid grid-cols-2 gap-3 justify-items-center">
          {imageUrls.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`footer-img-${i}`}
              className="w-24 h-24 object-cover rounded-lg shadow-md hover:scale-105 transition"
            />
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 border-t border-purple-800 mt-12 pt-6 pb-6">
        © {new Date().getFullYear()} StriveFit. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
