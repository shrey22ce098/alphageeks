import { useState } from "react";
import "./App.css";
import NavBar from "./components/main/NavBar";
import { Outlet } from "react-router-dom";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
