import {useContext, useEffect} from "react";
import { AuthContext} from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {

    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-bold mb-4">
                    Welcome back, {user?.username} !
                </h2>
                <p className="text-gray-400 mb-8">
                    You are successfully logged in with <span className="text-blue-400">{user?.email}</span>.
                </p>

            </div>
        </div>
    )
}

