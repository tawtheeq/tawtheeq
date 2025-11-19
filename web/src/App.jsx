// import './styles/main.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Signin";
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Missions from './pages/Missions';
import AddMission from './pages/Addmission';
import AddEmp from './pages/Addemp';
import Addcategory from "./pages/Addcategory";
import Categories from "./pages/Categories";
import UpdateMission from "./pages/Updatemission";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="categories" element ={<Categories/>} />
          <Route path="categories/addcategory" element={<Addcategory/>}/>
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="missions" element={<Missions />} />
          <Route path="missions/addmission" element={<AddMission />} />
          <Route path="/dashboard/missions/update/:id" element={<UpdateMission/>}/>
          <Route path="users/addemp" element={<AddEmp />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />

        </Route>


      </Routes>
    </BrowserRouter>
  );

}

export default App
