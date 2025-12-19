import React from "react"; 
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ResumeApp from "./ResumeApp"; // your existing AI Analyzer App
import AppExecHome from "./appexe/src/main"; // new imported app

function App() {
  return (
    <Router>
      <nav className="flex gap-4 bg-gray-100 p-4 shadow">
        <Link to="/">AI Resume Analyzer</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ResumeApp />} />
        <Route path="/appexe/*" element={<AppExecHome />} />
      </Routes>
    </Router>
  );
}

export default App;
