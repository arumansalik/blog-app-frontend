import React, { useState, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Send } from "lucide-react";

export default function CreatePost() {
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: "",
        cover: "",
        tags: "",
    });

    const [content, setContent] = useState(""); // Markdown text
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // VALIDATION
    const validate = () => {
        let err = {};

        if (!formData.title.trim()) err.title = "Title is required";
        if (!formData.cover.trim()) err.cover = "Cover image URL is required";
        if (!formData.tags.trim()) err.tags = "Add at least one tag";
        if (!content.trim()) err.content = "Content cannot be empty";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");

        if (!validate()) return;

        setLoading(true);

        try {
            const res = await API.post("/posts", {
                title: formData.title,
                cover: formData.cover,
                content: content, // stored as markdown
                tags: formData.tags.split(",").map((t) => t.trim()),
            });

            setSuccessMsg("🎉 Blog published successfully!");

            setFormData({ title: "", cover: "", tags: "" });
            setContent("");

        } catch (err) {
            console.log(err);
            setSuccessMsg("❌ Failed to publish blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-white font-poppins px-6 py-10 flex justify-center">
            <div className="max-w-4xl w-full bg-[#131319] p-10 rounded-2xl shadow-xl border border-gray-800">

                <h2 className="text-3xl font-bold mb-6 text-center">
                    📝 Create Blog (Markdown Editor)
                </h2>

                {successMsg && (
                    <div
                        className={`p-3 mb-5 rounded-lg text-center ${
                            successMsg.includes("🎉") ? "bg-green-700" : "bg-red-700"
                        }`}
                    >
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* TITLE */}
                    <div>
                        <label className="block mb-2 text-gray-300 text-sm font-medium">
                            Blog Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your blog title"
                            className="w-full bg-[#1A1A23] border border-gray-700 rounded-lg p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    {/* COVER IMAGE */}
                    <div>
                        <label className="block mb-2 text-gray-300 text-sm font-medium">
                            Cover Image URL
                        </label>
                        <input
                            type="text"
                            placeholder="https://your-image-url.com/photo.jpg"
                            className="w-full bg-[#1A1A23] border border-gray-700 rounded-lg p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.cover}
                            onChange={(e) =>
                                setFormData({ ...formData, cover: e.target.value })
                            }
                        />
                        {errors.cover && <p className="text-red-500 text-sm">{errors.cover}</p>}
                    </div>

                    {/* TAGS */}
                    <div>
                        <label className="block mb-2 text-gray-300 text-sm font-medium">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            placeholder="college, fest, tech, design, motivation"
                            className="w-full bg-[#1A1A23] border border-gray-700 rounded-lg p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.tags}
                            onChange={(e) =>
                                setFormData({ ...formData, tags: e.target.value })
                            }
                        />
                        {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
                    </div>

                    {/* MARKDOWN EDITOR */}
                    <div data-color-mode="dark">
                        <label className="block mb-2 text-gray-300 text-sm font-medium">
                            Blog Content (Markdown)
                        </label>

                        <div className="bg-[#1A1A23] rounded-xl p-2 shadow-lg border border-gray-700">
                            <MDEditor
                                value={content}
                                onChange={setContent}
                                height={400}
                                preview="edit"
                                className="rounded-xl overflow-hidden"
                                textareaProps={{
                                    placeholder: "Start writing your blog in Markdown...",
                                }}
                            />
                        </div>

                        {errors.content && (
                            <p className="text-red-500 text-sm mt-2">{errors.content}</p>
                        )}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition p-4 rounded-lg font-semibold shadow-md"
                    >
                        {loading ? "Publishing..." : "Publish Blog"}
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
