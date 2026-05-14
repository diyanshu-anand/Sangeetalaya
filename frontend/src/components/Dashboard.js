import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import logo from "../assests/Sangeetalaya_logo.png";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState({ name: "" });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({ name: "Guest" });
    }

    // Fetch courses
    const fetchCourses = async () => {
      try {
        const res = await fetch("https://sangeetalaya.onrender.com/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="nav-logo" />
        </div>
        <div className="nav-center">
          <h1 className="nav-title">SANGEETALAYA</h1>
        </div>
        <div className="nav-right">
          <div className="user-badge">
            <span className="user-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </span>
            <span className="user-name">{user.name}</span>
          </div>
        </div>
      </nav>

      {/* Signometer Section */}
      <div className="signometer-section">
        <button className="signometer-btn">Go to Signometer</button>
      </div>

      {/* Courses Section */}
      <div className="courses-section">
        <h2 className="section-title">Available Courses</h2>

        {loading ? (
          <p className="loading-text">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="no-courses-text">No courses available yet.</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <img
                  src={course.thumbnail || "https://via.placeholder.com/300"}
                  alt={course.title}
                  className="course-image"
                />

                <div className="course-info">
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                  </div>

                  <div className="course-actions">
                    <button
                      className="purchase-btn"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
