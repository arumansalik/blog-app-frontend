import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/*<Route path="/" element={<HomePage />} />*/}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
              path="/"
              element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
              }
          />
      </Routes>
    </Router>
  );
}

export default App;
