// ======================================
// Profile.jsx (Tailwind Version)
// ======================================

import { useEffect, useState } from "react";
import {
  FaEdit,
  FaUpload,
  FaPhone,
  FaBirthdayCake,
  FaWeight,
  FaMale,
  FaFemale,
  FaTrash,
} from "react-icons/fa";

import { db } from "../../config/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import { useAuth } from "../../context/UserContext";

const Profile = () => {
  const { user } = useAuth();

  // ================= STATE =================
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    weight: "",
    gender: "",
    photoURL: "",
  });

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const refDoc = doc(db, "users", user.uid);
      const snap = await getDoc(refDoc);

      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setFormData(data);
      }
    } catch (error) {
      alert("Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  // ================= CLOUDINARY UPLOAD =================
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "StriveFit");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxk09jcw2/image/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();
    if (!result.secure_url) throw new Error("Upload failed");

    return result.secure_url;
  };

  // ================= REAUTH =================
  const reauthenticate = async () => {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return await reauthenticateWithCredential(user, credential);
  };

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    setUpdating(true);

    try {
      let updatedData = { ...formData };

      if (imageFile) {
        const url = await uploadImage(imageFile);
        updatedData.photoURL = url;
      }

      const refDoc = doc(db, "users", user.uid);
      await updateDoc(refDoc, updatedData);

      if (newPassword) {
        await reauthenticate();
        await updatePassword(user, newPassword);
        alert("Password updated successfully");
      }

      setUserData(updatedData);
      alert("Profile updated successfully");

      setOpen(false);
      setImageFile(null);
    } catch (error) {
      alert("Update failed: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      const refDoc = doc(db, "users", user.uid);
      await updateDoc(refDoc, { photoURL: "" });

      setUserData({ ...userData, photoURL: "" });
      setFormData({ ...formData, photoURL: "" });
      setImageFile(null);

      alert("Profile picture removed");
    } catch (error) {
      alert("Failed to remove profile picture");
    }
  };

  useEffect(() => {
    if (user) fetchUser();
  }, [user]);

  // ================= LOADING =================
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-black via-gray-950 to-purple-950 text-white flex items-center justify-center p-4">
      
      {/* ================= PROFILE CARD ================= */}
      <div className="relative w-full max-w-2xl bg-gray-900/70 border border-purple-800 rounded-2xl shadow-2xl overflow-hidden">

        <div className="h-20 bg-gradient-to-r from-purple-700 to-indigo-600"></div>

        <button
          onClick={() => setOpen(true)}
          className="absolute top-5 right-5 bg-purple-600 p-3 rounded-full hover:bg-purple-700"
        >
          <FaEdit />
        </button>

        <div className="px-6 pb-8 -mt-14">
          <div className="flex flex-col items-center">
            <img
              src={userData?.photoURL || "https://via.placeholder.com/150"}
              alt="profile"
              className="w-28 h-28 rounded-full ring-4 ring-purple-500 object-cover"
            />
            <h2 className="text-2xl font-bold mt-3">
              {userData?.name || "N/A"}
            </h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <InfoCard icon={<FaPhone />} label="Phone" value={userData?.phone} />
            <InfoCard icon={<FaBirthdayCake />} label="Age" value={userData?.age} />
            <InfoCard icon={<FaWeight />} label="Weight" value={userData?.weight} />
            <InfoCard
              icon={userData?.gender === "Male" ? <FaMale /> : <FaFemale />}
              label="Gender"
              value={userData?.gender}
            />
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE DRAWER ================= */}
      {open && (
        <div className="fixed inset-0 z-50">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-purple-700 shadow-2xl p-6 overflow-y-auto">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

            {/* Image Section */}
            <div className="flex flex-col items-center mb-6 relative">
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : formData.photoURL || "https://via.placeholder.com/150"
                }
                className="w-24 h-24 rounded-full ring-4 ring-purple-500 object-cover"
              />

              <label className="mt-3 bg-purple-600 px-4 py-2 rounded cursor-pointer hover:bg-purple-700">
                <FaUpload className="inline mr-2" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </label>

              <button
                onClick={handleRemoveProfilePic}
                className="mt-2 text-red-500 text-sm flex items-center gap-2"
              >
                <FaTrash /> Remove
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <InputField label="Full Name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              
              <InputField label="Phone" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

              <InputField label="Age" type="number" value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })} />

              <InputField label="Weight" type="number" value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />

              <select
                className="w-full p-3 rounded bg-gray-800 border border-purple-600"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <InputField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <InputField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded font-semibold"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= REUSABLE COMPONENTS =================
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-gray-800/70 border border-purple-800 rounded-lg p-4 flex items-center gap-3">
    <span className="text-purple-400 text-lg">{icon}</span>
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-medium">{value || "N/A"}</p>
    </div>
  </div>
);

const InputField = ({ label, ...props }) => (
  <input
    {...props}
    placeholder={label}
    className="w-full p-3 rounded bg-gray-800 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
);

export default Profile;
