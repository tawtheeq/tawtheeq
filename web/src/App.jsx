import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import LoginPage from "./pages/Signin";
import Dashboard from './pages/Dashboard';
import Setup from "./pages/Setup";
import { useAuth } from "./context/AuthContext";
import Overview from './pages/Overview';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Missions from './pages/Missions';
import AddMission from './pages/Addmission';
import AddEmp from './pages/Addemp';
import Addcategory from "./pages/Addcategory";
import Categories from "./pages/Categories";
import UpdateMission from "./pages/Updatemission";
import UpdateEmp from "./pages/UpdateEmp";
import MissionDetails from "./pages/MissionDetails";
import AddParticipantsToMission from "./pages/AddParticipantsToMission";
import Reports from "./pages/Reports";
import About from "./pages/About";
import UserReport from "./pages/UserReport";
import Activate from "./pages/Activate";
import UpdateCategories from "./pages/UpdateCategories";

function AppContent() {
  const { isSetupRequired, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/setup" element={<Setup />} />
      <Route path="/" element={isSetupRequired ? <Setup /> : <LoginPage />} />
      <Route path="/activate/:token" element={<Activate />} />

      <Route element={<ProtectedRoute />}>
        {/* ... dashboard routes ... */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/addcategory" element={<Addcategory />} />
          <Route path="categories/update/:id" element={<UpdateCategories />} />
          <Route path="users" element={<Users />} />
          <Route path="users/update/:id" element={<UpdateEmp />} />
          <Route path="users/:id/report" element={<UserReport />} />
          <Route path="settings" element={<Settings />} />
          <Route path="missions" element={<Missions />} />
          <Route path="missions/addmission" element={<AddMission />} />
          <Route path="about" element={<About />} />
          <Route path="missions/update/:id" element={<UpdateMission />} />
          <Route path="missions/:id" element={<MissionDetails />} />
          <Route path="missions/:id/add-participants" element={<AddParticipantsToMission />} />
          <Route path="users/addemp" element={<AddEmp />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
