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

                {/* Example Dashboard Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2">Your Profile</h3>
                        <p className="text-gray-400">Manage your account details and password.</p>
                    </div>

                    <div className="bg-zinc-900 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2">Bus Tracking</h3>
                        <p className="text-gray-400">Track your college bus in real-time.</p>
                    </div>

                    <div className="bg-zinc-900 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold mb-2">Notifications</h3>
                        <p className="text-gray-400">Stay updated with important alerts.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

