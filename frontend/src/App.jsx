import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import AddSubscription from "./pages/AddSubscription";
import Profile from "./pages/Profile";
function App() {
  return (
    <BrowserRouter>

     <Routes>

  <Route path="/" element={<Home />} />

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/subscriptions" element={<Subscriptions />} />
  <Route path="/add-subscription" element={<AddSubscription />} />
  <Route path="/profile" element={<Profile />} />

</Routes>
    </BrowserRouter>
  );
}

export default App;