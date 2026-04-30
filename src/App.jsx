import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CreateCourse from "./pages/CreateCourse";
import CourseList from "./pages/CourseList";
import ScheduleClass from "./pages/ScheduleClass";
import MyClasses from "./pages/MyClasses";
import ManageUsers from "./pages/ManageUsers";
import CalendarView from "./pages/CalendarView";
import Notifications from "./pages/Notifications";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


function App() {

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Login />;

  if (role && user.role !== role) {
    return <h3>Access Denied</h3>;
  }

  return children;
};

  return (
    <BrowserRouter>
         {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/student" element={<StudentDashboard />} /> */}
        <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>}/>
        <Route path="/instructor" element={<PrivateRoute role="INSTRUCTOR"><InstructorDashboard /></PrivateRoute>}/>
        <Route path="/student" element={<PrivateRoute role="STUDENT"><StudentDashboard /></PrivateRoute>}/>
        <Route path="/create-course" element={<PrivateRoute roles={["ADMIN", "INSTRUCTOR"]}><CreateCourse /></PrivateRoute>}/>
        <Route path="/courses" element={<CourseList />} />
        <Route path="/schedule" element={<ScheduleClass />} />
        <Route path="/my-classes" element={<MyClasses />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin/calendar" element={<CalendarView />} />
        <Route path="/my-classes/:courseId" element={<MyClasses />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />




      </Routes>
    </BrowserRouter>
  );
}

export default App;