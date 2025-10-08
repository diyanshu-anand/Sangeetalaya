import React, { useState} from "react";
import "../styles/AuthModal.css";
import logo from "../assests/Sangeetalaya_logo.png";

function AuthModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("login")

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Close Button  */}
                <button className="close-btn" onClick={onClose}>x</button>

                {/* Logo  */}
                <div className="modal-logo">
                    <img src={logo} alt="Logo" />
                </div>

                {/* Tabs  */}
                <div className="tabs">
                    <button className={activeTab ==="signup"? "active": ""} onClick={()=> setActiveTab("signup")}>Signup</button>
                    <button className={activeTab ==="login"? "active": ""} onClick={() => setActiveTab("login")}>Login</button>
                </div>

                {/* Forms  */}
                {activeTab === "login" ? (
                    <form className="auth-form">
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button type="submit"  className="submit-btn">Login</button>
                    </form>
                ):(
                    <form className="auth-form">
                        <input type="text" placeholder="Full Name" />
                        <input type="number" placeholder="Phone Number" />
                        <input type="password" placeholder="Password" />
                        {/* <input type="text" placeholder="Full Name" /> */}
                        <button type="submit" className="submit-btn">Signup</button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AuthModal;