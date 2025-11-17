import React, { useContext, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function EditProfile() {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        bio: user?.bio || "",
        avatar: user?.avatar || "",
        twitter: user?.socialLinks?.twitter || "",
        facebook: user?.socialLinks?.facebook || "",
        website: user?.socialLinks?.website || "",
    });

    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await API.put("/users/update", {
                bio: form.bio,
                avatar: form.avatar,
                socialLinks: {
                    twitter: form.twitter,
                    facebook: form.facebook,
                    website: form.website,
                },
            });

            // Update global AuthContext
            login(res.data, localStorage.getItem("token"));

            setMsg("Profile updated successfully!");
            setTimeout(() => navigate(`/profile/${res.data.username}`), 800);

        } catch (err) {
            console.error(err);
            setMsg("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins px-6 py-10">

            {/* TOP BAR */}
            <div className="flex items-center gap-4 mb-10">
                <Link to={`/profile/${user.username}`} className="text-gray-300 hover:text-white">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">Edit Profile</h1>
            </div>

            <div className="max-w-3xl mx-auto bg-[#131319] p-8 rounded-2xl border border-gray-800">

                {msg && (
                    <p className="text-center mb-4 p-2 rounded bg-indigo-600">
                        {msg}
                    </p>
                )}

                {/* Avatar */}
                <label className="text-sm text-gray-400">Avatar URL</label>
                <input
                    type="text"
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                    className="w-full p-3 bg-[#1A1A23] border border-gray-700 rounded-xl mt-1 mb-6"
                    placeholder="https://your-photo.jpg"
                />

                <div className="mb-8 flex justify-center">
                    <img
                        src={form.avatar || "https://i.pravatar.cc/150"}
                        className="w-32 h-32 rounded-full border border-gray-700 shadow-xl"
                    />
                </div>

                {/* Bio */}
                <label className="text-sm text-gray-400">Bio</label>
                <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full p-4 bg-[#1A1A23] border border-gray-700 rounded-xl mt-1 mb-6"
                    rows={4}
                    placeholder="Tell something about yourself..."
                />

                {/* Social Links */}
                <label className="text-sm text-gray-400">Twitter</label>
                <input
                    type="text"
                    value={form.twitter}
                    onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                    className="w-full p-3 bg-[#1A1A23] border border-gray-700 rounded-xl mt-1 mb-4"
                />

                <label className="text-sm text-gray-400">Facebook</label>
                <input
                    type="text"
                    value={form.facebook}
                    onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                    className="w-full p-3 bg-[#1A1A23] border border-gray-700 rounded-xl mt-1 mb-4"
                />

                <label className="text-sm text-gray-400">Website</label>
                <input
                    type="text"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full p-3 bg-[#1A1A23] border border-gray-700 rounded-xl mt-1 mb-6"
                />

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center gap-2"
                >
                    <Save size={20} />
                    {saving ? "Saving..." : "Save Changes"}
                </button>

            </div>
        </div>
    );
}
