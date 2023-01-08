import { ReactNode, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import axios from "axios";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";

function App({ children }: { children?: ReactNode }) {
  return (
    <div className="App">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      {/* <div id="content" contentEditable style={{flexGrow: "1"}}>

    </div>
    <div>
      <button>submit</button>
    </div> */}
    </div>
  );
}

export default App;
