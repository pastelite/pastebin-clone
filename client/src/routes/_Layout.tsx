import { ReactNode, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./_Layout.css";
import axios from "axios";
import { Header } from "../components/Header";
import { Outlet } from "react-router-dom";

function App({ children }: { children?: ReactNode }) {
  return (
    <div className="App">
      <Header />
      {/* <div className="grid place-items-center"> */}
      <div className="flex-grow flex flex-col md:flex-row max-w-screen-lg w-screen m-auto">
        <Outlet />
      </div>
      {/* </div> */}
      {/* <div id="content" contentEditable style={{flexGrow: "1"}}>

    </div>
    <div>
      <button>submit</button>
    </div> */}
    </div>
  );
}

export default App;
