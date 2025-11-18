// CourseIntro.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CourseIntro.css";
import logo from "../assests/Sangeetalaya_logo.png";

function CourseIntro() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => setCourse(data))
      .catch((err) => console.error("Error fetching course:", err));
  }, [id]);

  if (!course) {
    return <div className="loading">Loading course details...</div>;
  }

  return (
    <div className="course-intro-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="nav-logo" />
        </div>
        <div className="nav-center">
          <h1 className="nav-title">SANGEETALAYA</h1>
        </div>
        <div className="nav-right">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </nav>

      {/* Course Info */}
      <div className="course-intro-content">
        <img src={course.image} alt={course.title} className="intro-image" />
        <h2>{course.title}</h2>
        <p className="course-full-desc">{course.fullDescription}</p>

        {/* Optional: Course metadata */}
        <div className="course-meta">
          <p><strong>Duration:</strong> {course.duration || "N/A"}</p>
          <p><strong>Level:</strong> {course.level || "All Levels"}</p>
          <p><strong>Instructor:</strong> {course.instructor || "Sangeetalaya Faculty"}</p>
        </div>

        <button className="purchase-btn">Purchase Course</button>
      </div>
    </div>
  );
}

export default CourseIntro;
