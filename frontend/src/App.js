import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import LandingPage from "./components/LandingPage"
function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(res => setMsg(res.data))
      .catch(err => console.log(err));
  }, []);

  return <LandingPage />;
}

export default App;
