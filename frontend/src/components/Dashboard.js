import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import logo from "../assests/Sangeetalaya_logo.png";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState({ name: "" });
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();
  // ======================
  // Load user info
  // ======================
  useEffect(() => {
    const tokenData = localStorage.getItem("user");
    if (tokenData) setUser(JSON.parse(tokenData));
    else setUser({ name: "Guest" });
    
    fetch("http://localhost:5000/api/courses") // backend route
      .then((res) => res.json())
      .then((data)=> setCourses(data))
      .catch((err) => console.error("Error fetching the courses:", err));
  }, []);

  // ======================
  // Fetch all courses
  // ======================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Error loading courses:", error);
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
            <span className="user-icon">🎵</span>
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
                    <button className="purchase-btn">Purchase</button>
                    <button
                      className="view-btn"
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

      {/* Modal */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedCourse(null)}>
              ×
            </button>
            <img
              src={selectedCourse.thumbnail || "https://via.placeholder.com/500"}
              alt={selectedCourse.title}
              className="modal-image"
            />
            <h2>{selectedCourse.title}</h2>
            <p>{selectedCourse.description}</p>

            {selectedCourse.lessons?.length > 0 && (
              <div className="lesson-list">
                <h4>Lessons:</h4>
                <ul>
                  {selectedCourse.lessons.map((lesson, idx) => (
                    <li key={idx}>
                      🎬 {lesson.title} ({lesson.duration} min)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="purchase-btn">Purchase</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
