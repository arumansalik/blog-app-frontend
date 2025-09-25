import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);


    return(
        <nav className="bg-zinc-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
            <h1>
                Medium Blogs
            </h1>

            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <span className="text-gray-300">Hello, {user.username}</span>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 transition text-white py-1 px-4 rounded-lg font-semibold"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}