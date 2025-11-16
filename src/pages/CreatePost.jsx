import React, { useState, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";
// import "@uiw/react-md-editor/dist/mdeditor.css";
// import "@uiw/react-markdown-preview/dist/markdown.css";

import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Send } from "lucide-react";

export default function CreatePost() {
    const { user } = useContext(AuthContext);

    const [form, setForm] = useState({
        title: "",
        cover: "",
        tags: "",
    });

    const [content, setContent] = useState(""); // markdown
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!form.title || !form.cover || !content) {
            return setMessage("❌ Please fill all fields.");
        }

        setLoading(true);

        try {
            await API.post("/posts", {
                title: form.title,
                cover: form.cover,
                tags: form.tags.split(",").map((t) => t.trim()),
                content,
            });

            setMessage("🎉 Post published successfully!");
            setForm({ title: "", cover: "", tags: "" });
            setContent("");

        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to publish post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-white font-poppins flex justify-center py-10 px-6">
            <div className="max-w-5xl w-full bg-[#131319] p-10 rounded-2xl shadow-xl border border-gray-800">

                <h1 className="text-3xl font-bold text-center mb-6">
                    ✍️ Create New Blog Post
                </h1>

                {message && (
                    <div
                        className={`p-3 mb-5 rounded-xl text-center ${
                            message.includes("🎉") ? "bg-green-700" : "bg-red-700"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Title */}
                    <div>
                        <label className="block text-gray-300 mb-2">Blog Title</label>
                        <input
                            type="text"
                            placeholder="Enter your title"
                            className="w-full bg-[#1A1A23] p-4 rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    {/* Cover URL */}
                    <div>
                        <label className="block text-gray-300 mb-2">Cover Image URL</label>
                        <input
                            type="text"
                            placeholder="https://your-image.jpg"
                            className="w-full bg-[#1A1A23] p-4 rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={form.cover}
                            onChange={(e) => setForm({ ...form, cover: e.target.value })}
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-gray-300 mb-2">Tags</label>
                        <input
                            type="text"
                            placeholder="tech, design, college..."
                            className="w-full bg-[#1A1A23] p-4 rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={form.tags}
                            onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        />
                    </div>

                    {/* Markdown Editor */}
                    <div data-color-mode="dark">
                        <label className="block text-gray-300 mb-2">Content</label>

                        <div className="bg-[#1A1A23] rounded-xl border border-gray-700 p-2 shadow-xl">
                            <MDEditor
                                value={content}
                                onChange={setContent}
                                height={500}
                                preview="edit"
                                className="rounded-xl overflow-hidden"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? "Publishing..." : "Publish Blog"}
                        <Send size={20} />
                    </button>

                </form>
            </div>
        </div>
    );
}
