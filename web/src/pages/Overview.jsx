
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'; 

import { useNavigate } from "react-router-dom"; // Import useNavigate
                 import '../styles/main.scss';                                                                                                                                                                                                                                       

export default function Overview() {
 const navigate = useNavigate();
// const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <img src="../assets/logo.png" alt="React logo" className="logo-home" />
    </div>
    <div>
      <h1>مرحبًا بكم في منصة توثيق</h1>
      <p>نظرة عامة</p>
    </div>
<br/>
<br/>

    </>
  );
}


