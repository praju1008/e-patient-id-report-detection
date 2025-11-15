import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./components/StartPage";
import Login from './pages/Login';
import AdminHomePage from "./pages/AdminHomePage";
import DoctorHome from './pages/DoctorHome';
import Specialization from './pages/Specialization';
import Doctor from './pages/AddDoctor';
import Patient from './pages/AddPatient';
import PatientDetail from './pages/PatientDetail';
//import DoctorLayout from './pages/DoctorLayout'; // ✅ import layout
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<StartPage />} />
      {/* Placeholder for Login Pages */}
      <Route path="/login" element={<Login />} />
      {/* <Route path="/admin-home" element={<AdminHomePage />} /> */}
      <Route path="/admin-home" element={<AdminHomePage>
        <Specialization />
        <Doctor />
        </AdminHomePage>} />
        <Route path="/add-specialization" element={<Specialization />} />
        <Route path="/add-doctor" element={<Doctor />} />
        <Route path="/add-patient" element={<Patient />} />
      <Route path="/doctor-login" element={<h1>Doctor Login Page</h1>} />
      <Route path="/doctor-home" element={<DoctorHome />} />
      <Route path="/patient-detail" element={<PatientDetail />} />
      {/* <Route path="/doctor" element={<DoctorLayout />}>
  <Route path="home" element={<DoctorHome />} />
  <Route path="patient-detail" element={<PatientDetail />} />
</Route> */}
      
    </Routes>
  </Router>
  );
}

export default App;
