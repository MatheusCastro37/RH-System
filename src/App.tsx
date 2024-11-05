import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Carrer from "./components/pages/Position";

function App() {
  return (
    <Routes>
     <Route path="/" element={<Login />}></Route>
     <Route path="/signUp" element={<Register />}></Route>
     <Route path="/carrer" element={<Carrer />}></Route>
    </Routes>
  );
}

export default App;
