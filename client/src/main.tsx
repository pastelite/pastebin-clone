import React from "react";
import ReactDOM from "react-dom/client";
import App from "./AppLayout";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Header } from "./components/Header";
import { ShowText } from "./components/ShowText";
import axios from "axios";
import { InputBox } from "./components/InputBox";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <InputBox></InputBox>,
      },
      {
        path: "/:link",
        loader: async ({ params }) => {
          let link = params.link;
          let data: any = {};
          await axios
            .get(`/api/${params.link}`)
            .then((a) => {
              console.log(a);
              data = a.data;
            })
            .catch((e) => {
              console.log(e);
              data = { message: "Not found" };
            });
          return data;
          // return data
        },
        element: <ShowText />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
