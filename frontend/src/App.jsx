import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../src/components/Home/Home";
import Addrecipe from "../src/components/Addrecipe/Addrecipe";
import Welcome from "./Page/Welcome";
import "./App.css";
import Displayrecipe from "./components/Displayrecipe/Displayrecipe";
import Updaterecipe from "./components/Updaterecipe/Updaterecipe";
import Login from "./Page/Login";
import Register from "./Page/Register";




function App() {
  return (
    <div>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/wel" element={<Welcome />} />
        <Route path="/addrecipe" element={<Addrecipe />} />
        <Route path="/display" element={<Displayrecipe />} />
        <Route path="/updaterecipe/:id" element={<Updaterecipe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Catch-all route for 404 Not Found */}
      </Routes>
    </div>
  );
}

export default App;
