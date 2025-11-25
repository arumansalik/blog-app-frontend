import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";

function App() {
    return (
        <Router>
            <Routes>

                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/posts/:id" element={<SinglePost />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* PROTECTED ROUTES */}
                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <CreatePost />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-profile"
                    element={
                        <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;
