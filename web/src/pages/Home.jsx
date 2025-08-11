
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'; 

import { useNavigate } from "react-router-dom"; // Import useNavigate
import '../styles/components/buttons.scss';
                    import '../styles/pages/home.scss';  
                                                                                                                                                                                                                            

export default function Home() {
 const navigate = useNavigate();
// const [count, setCount] = useState(0)

  return (
    <>
    <div className="home-container">
      <div>

      <img src="../assets/logo.png" alt="React logo" className="logo-home" />
    </div>
    <div>
      <h1>مرحبًا بكم في منصة توثيق</h1>
      <p>نظام إدارة العملية الإعلامية، وأرشفة المخرجات، وتوثيقها</p>
    </div>
<br/>
<br/>
<button  onClick={() => navigate("/login")}>
     الدخول إلى النظام
    </button>
   </div>
    </>
  );
}


