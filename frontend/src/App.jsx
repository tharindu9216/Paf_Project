import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../src/components/Home/Home";
import Addrecipe from "../src/components/Addrecipe/Addrecipe";
import Welcome from "./Page/Welcome";
import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addrecipe" element={<Addrecipe />} />
      </Routes>
    </div>
  );
}

export default App;
