import React, { useState } from "react";
import "../styles/AuthModal.css";
import logo from "../assests/Sangeetalaya_logo.png";

function AuthModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("login");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // -------------------------
    // LOGIN HANDLER
    // -------------------------
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                alert("Login Successful!");
                window.location.href = "/dashboard";
                onClose();
            } else {
                const message = data.error ||
                    (data.errors ? Object.values(data.errors).join("\n") : "Login Failed");
                alert(message);
            }
        } catch (error) {
            console.error("Frontend login error:", error);
            alert("Server error during login");
        }
    };


    // -------------------------
    // SIGNUP HANDLER
    // -------------------------
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                alert("Signup Successful!");
                onClose();
            } else {
                // backend sends either `error` or `errors` object
                const message = data.error ||
                    (data.errors ? Object.values(data.errors).join("\n") : "Signup Failed");
                alert(message);
            }
        } catch (error) {
            console.error("Frontend signup error:", error);
            alert("Server error during signup");
        }
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    ×
                </button>

                <div className="modal-logo">
                    <img src={logo} alt="Logo" />
                </div>

                <div className="tabs">
                    <button
                        className={activeTab === "signup" ? "active" : ""}
                        onClick={() => setActiveTab("signup")}
                    >
                        Signup
                    </button>
                    <button
                        className={activeTab === "login" ? "active" : ""}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                </div>

                {/* --------------------------- */}
                {/* LOGIN FORM */}
                {/* --------------------------- */}
                {activeTab === "login" ? (
                    <form className="auth-form" onSubmit={handleLogin}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="submit-btn">
                            Login
                        </button>
                    </form>
                ) : (
                    // ---------------------------
                    // SIGNUP FORM
                    // ---------------------------
                    <form className="auth-form" onSubmit={handleSignup}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="submit-btn">
                            Signup
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AuthModal;
