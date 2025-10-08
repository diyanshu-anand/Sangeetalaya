import React, { useEffect, useState, useRef } from "react";
import { FaPlay, FaPause, FaMusic } from "react-icons/fa"
import "../styles/LandingPage.css";
import logo from "../assests/Sangeetalaya_logo.png";
import parth from "../assests/Parth.jpeg"
import spicmacay from "../assests/spicmacay.png"
import AuthModal from "./AuthModal";
const performances = [
  {
    id: 1,
    title: "Raga Yaman - Evening Serenity",
    description: "A soothing performance bringing calmness to the listener.",
    image: "/images/performance1.jpg",
  },
  {
    id: 2,
    title: "Tabla Solo - Rhythm of Heart",
    description: "An energetic tabla solo to mesmerize rhythm lovers.",
    image: "/images/performance2.jpg",
  },
  {
    id: 3,
    title: "Bhajan - Spiritual Bliss",
    description: "Traditional devotional music to elevate the soul.",
    image: "/images/performance3.jpg",
  },
  {
    id: 4,
    title: "Founder's Desk",
    description: "Mona Anand",
    image: "/images/profile.jpg"
  },
  {
    id: 5,
    title: "Assist Head",
    description: "Basant Rajak",
    image: "/images/basant_sir.jpg"
  }
];

const feedbacks = [
  {
    id: 1,
    student: "PARTH SINGH",
    image: parth,
    feedback: "The classes are really fun and interactive! I have improved a lot in my singing.",
  },
  {
    id: 2,
    student: "Meera Patel",
    image: "/images/student2.jpg",
    feedback: "Learning tabla here has been amazing. The rhythm practice is well structured.",
  },
  {
    id: 3,
    student: "Rahul Verma",
    image: "/images/student3.jpg",
    feedback: "I feel more confident performing on stage thanks to these sessions!",
  },

];

const organizers = [
  { id: 1, name: "SPIC MACAY", logo: spicmacay },
  { id: 2, name: "All India Radio", logo: "/images/air.png" },
  { id: 3, name: "Sangeet Natak Akademi", logo: "/images/sna.png" },
  { id: 4, name: "Doordarshan", logo: "/images/doordarshan.png" },
  { id: 5, name: "Prayag Sangeet Samiti", logo: "/images/prayag.png" }
]

function LandingPage() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [Current, setCurrent] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  //Rejecting this use effect AS DESIGN CHANGES
  useEffect(() => {
    const cards = document.querySelectorAll(".performance-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((card) => observer.observe(card));
  }, []);

  //auto-slide after 5 seconds 



  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    }
  }, []);


  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  };
  Issues:

  // You created two intervals inside each other (const interval inside another setInterval).

  // The return () => clearInterval(interval) is inside the wrong place → it never runs.

  // You forgot the dependency array for the outer useEffect.
  // useEffect(()=>{
  //   const interval = setInterval(() => {
  //     const interval = setInterval(() => {
  //       setCurrent((prev) => (prev + 1)% feedbacks.length);
  //     }, 10000);
  //     return () => clearInterval(interval);
  //   }, []);
  // })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % feedbacks.length);
    }, 5000); // 10 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="navbar">
        <img src={logo} alt="Sangeetalaya Logo" className="logo" />
        <div className="nav-links">
          <a href="#signup">Signup</a>
          <a href="#login">Login</a>
        </div>
      </nav>

      {/* Center Content */}
      <div className="hero">
        <h1 className="title">Sangeetalaya</h1>
        <div className="hero-buttons">
          <button className="btn signup" onClick={() => setIsAuthOpen(true)}>Signup</button>
          <button className="btn login" onClick={() => setIsAuthOpen(true)}>Login</button>
        </div>

        <AuthModal isOpen = {isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>

      {/* Performance Section */}
      <section className="performance-section">
        {performances.map((perf, index) => (
          <div
            key={perf.id}
            className={`performance-card ${index % 2 === 0 ? "left" : "right"
              }`}
          >
            <img src={perf.image} alt={perf.title} className="performance-img" />
            <div className="performance-content">
              <h2>{perf.title}</h2>
              <p>{perf.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Sponsors Section  */}

      <section className="organizers-section">
        <h2 className="section-title">Competetion Organizers</h2>
        <div className="organizers-slider">
          <div className="organizers-track">
            {organizers.concat(organizers).map((org, index) => ( //duplicate for infinite scrolling 
              <div key={index} className="organizer-card">
                <img src={org.logo} alt={org.name} className="organizer-logo" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      {/* //Rejected as design changes  */}
      {/* <section className="feedback-section">
        <div className="feedback-container">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-card">
              <img src={fb.image} alt={fb.student} className="student-img" />
              <p className="feedback-text">{fb.feedback}</p>
              <h4 className="student-name">- {fb.student}</h4>
            </div>
          ))}
        </div>
      </section> */}

      <section className="feedback-section">
        <div className="feedback-box">
          <img src={feedbacks[Current].image} alt={feedbacks[Current].student} className="student-img" />
          <p className="feedback-text">{feedbacks[Current].feedback}</p>
          <h4 className="student-name">- {feedbacks[Current].student}</h4>

          {/* Navigation dots  */}
          <div className="dots">
            {feedbacks.map((_, index) => (
              <span key={index} className={`dot ${index === Current ? "active" : ""}`}
                onClick={() => setCurrent(index)} />
            ))}
          </div>
        </div>
      </section>


      {/* Background Music */}
      {/* <audio autoPlay loop controls className="bg-music">
        <source
          src="/music/StockTune-Serene Hindustani Morning Raga_1756660278.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio> */}
      {/* <div className="music-player">
        <div className="music-info">
          <h3 className="music-title">Now Playing</h3>
          <p className="music-desc">Serene Hindustani Morning Raga</p>
        </div>
        <audio autoPlay loop controls className="bg-music">
          <source src = "/music/StockTune-Serene Hindustani Morning Raga_1756660278.mp3" type="audio/mpeg"/>
        </audio>
        Check the browser as it does not support the music element.
      </div> */}

      <div className="circular-player">
        <div className={`circle ${isPlaying ? "rotate" : ""}`} onClick={togglePlay}>
          <svg className="progress-ring" viewBox="0 0 90 90">
            <circle className="progress-ring-bg" cx="45" cy="45" r="40" />

            <circle className="progress-ring-progress" cx="45" cy="45" r="40" style={{ strokeDasharray: `${2 * Math.PI * 40}`, strokeDashoffset: `${2 * Math.PI * 40 - (progress / 100) * (2 * Math.PI * 40)}`, }} />


          </svg>
          {isPlaying ? <FaPause className="music-icon" /> : <FaPlay className="music-icon" />}


        </div>

        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <audio ref={audioRef} src="/music/StockTune-Serene Hindustani Morning Raga_1756660278.mp3" loop />

      </div>

      <footer className="footer">
        <div className="footer-container">

          {/* Left */}
          <div className="footer-left">
            <img src={logo} alt="Sangeetalaya Logo" className="footer-logo" />
            <p className="footer-desc">
              Sangeetalaya is dedicated to nurturing talent and spreading the joy of
              Indian classical and contemporary music through expert training and performances.
            </p>
          </div>

          {/* Center */}
          <div className="footer-center">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#performances">Performances</a></li>
              <li><a href="#feedback">Feedback</a></li>
              <li><a href="#competitions">Competitions</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Right */}
          <div className="footer-right">
            <h3>Contact</h3>
            <p>Email: info@sangeetalaya.com</p>
            <p>Phone: +91 9876543210</p>
            <p>Address: Bhopal, MP, India</p>

            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="footer-bottom">
          <p>© 2025 Sangeetalaya | All Rights Reserved</p>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
