import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./components/App/store";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./Routes/Routes";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes}>
        <App/>
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);