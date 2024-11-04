import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Collaborator from "./components/pages/Collaborator";

function App() {
  return (
    <Routes>
     <Route path="/" element={<Login />}></Route>
     <Route path="/signUp" element={<Register />}></Route>
     <Route path="/collaborator" element={<Collaborator />}></Route>
    </Routes>
  );
}

export default App;
