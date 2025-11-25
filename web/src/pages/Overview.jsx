
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';

import { useNavigate } from "react-router-dom";
import '../styles/pages/overview.scss' // Import useNavigate
import '../styles/main.scss';

export default function Overview() {
  const navigate = useNavigate();
  // const [count, setCount] = useState(0)

  return (
    <div className="overview-container">
      <div className="overview-header">
        <img src="../assets/mohanadLogo.png" alt="Mohanad logo" className="logo-home" />
      </div>
      {/* <div>
        <h1>مرحبًا بكم في منصة توثيق</h1>
        <p>هذه المنصة مخصصة لإدارة وتوثيق المهام الداخلية والخارجية بشكل فعال.</p>
      </div> */}
    </div>

  );
}


