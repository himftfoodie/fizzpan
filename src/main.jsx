import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./components/App/store";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./Routes/Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={routes} />
        </CartProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);