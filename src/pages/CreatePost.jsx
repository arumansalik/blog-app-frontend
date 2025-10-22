import React, { useState, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

export default function CreatePost() {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [cover, setCover] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const { data } = await API.post("/posts", {
                title,
                content,
                tags: tags.split(",").map((t) => t.trim()),
                cover,
            });

            setMessage("✅ Post created successfully!");
            setTitle("");
            setContent("");
            setTags("");
            setCover("");
        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-poppins flex justify-center py-10 px-6">
            <div className="max-w-3xl w-full bg-zinc-900 p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">✍️ Create New Post</h2>

                {message && (
                    <div
                        className={`mb-4 text-center p-3 rounded-lg ${
                            message.includes("✅") ? "bg-green-700" : "bg-red-700"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-300 mb-2">Post Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your post title"
                            required
                        />
                    </div>

                    {/* Cover Image URL */}
                    <div>
                        <label className="block text-gray-300 mb-2">Cover Image URL</label>
                        <input
                            type="text"
                            value={cover}
                            onChange={(e) => setCover(e.target.value)}
                            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter image URL"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-gray-300 mb-2">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="E.g., tech, coding, studentlife"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-gray-300 mb-2">Post Content</label>
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            theme="snow"
                            className="bg-white rounded-lg text-black"
                            placeholder="Write your thoughts here..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg font-semibold"
                    >
                        {loading ? "Publishing..." : "Publish Post 🚀"}
                    </button>
                </form>
            </div>
        </div>
    );
}
