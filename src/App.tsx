import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";

function App() {
  return (
    <Routes>
     <Route path="/" element={<Login />}></Route>
     <Route path="/signUp" element={<Register />}></Route>
    </Routes>
  );
}

export default App;
