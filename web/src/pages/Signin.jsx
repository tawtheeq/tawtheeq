import { useState } from "react";
// import "../styles/pages/signin.scss"; 
// import '../styles/components/buttons.scss';
import { useNavigate } from "react-router-dom";



export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      navigate('/dashboard');
      console.log("Navigation attempted");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
  <>
  <div className="signin-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src="/assets/logo.png" alt="Logo" className="logo-signin" />
      <h2 className="title">تسجيل الدخول</h2>

      <input type="email"
       className="input"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        dir="rtl"
        required />

      <input type="password"
       className="input"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        dir="rtl"
        required />

    <button className="login-button" type="submit">تسجيل الدخول</button>

      </form>


</div>

   </>





    // <form onSubmit={handleSubmit}>
    //   <input type="text" placeholder="Email" required />
    //   <button type="submit">Submit</button>
    // </form>
  );
}
