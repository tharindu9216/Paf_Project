import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../src/components/Home/Home";
import Addrecipe from "../src/components/Addrecipe/Addrecipe";
import Welcome from "./Page/Welcome";
import "./App.css";
import Displayrecipe from "./components/Displayrecipe/Displayrecipe";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addrecipe" element={<Addrecipe />} />
        <Route path="/display" element={<Displayrecipe />} />
      </Routes>
    </div>
  );
}

export default App;
