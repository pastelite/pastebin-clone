import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/_Layout";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { InputPage } from "./routes/InputPage";
import { ShowPage } from "./routes/ShowPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <InputPage />,
      },
      {
        path: "/:link",
        loader: async ({ params }) => {
          let data: any = {};
          await axios
            .get(`/api/${params.link}`)
            .then((a) => {
              // console.log(a.data.data);
              data.data = JSON.parse(a.data.data);
            })
            .catch((e) => {
              console.log(e);
              data = { message: "Not found", error: e };
            });

          data.url = params.link;
          // return data;
          return data;
          // return data
        },
        element: <ShowPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
