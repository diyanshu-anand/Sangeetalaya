import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import LandingPage from "./components/LandingPage";
import ForgotPassword from "./pages/ForgetPassowrd"; // import page
import Dashboard from "./components/Dashboard";
import CourseIntro from "./components/CourseIntro";
import LoginPanel from "./components/Login";
function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      // .get("https://sangeetalaya.onrender.com/")
      .get("https://sangeetalaya.onrender.com")
      .then((res) => setMsg(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CourseIntro />} />
        {/* <Route path="/login" element={<AuthModal />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
