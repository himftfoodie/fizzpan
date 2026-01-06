import { createBrowserRouter, redirect } from "react-router-dom";

// Pages
import LandingPage from "../pages/landing page/index.jsx";
import Login from "../pages/autentikasi/Login.jsx";
import Register from "../pages/autentikasi/Register.jsx";
import Dashboard from "../pages/dashboard admin/Dashboard.jsx";
import ErrorePage from "../pages/error page/ErrorePage.jsx";

// Customer Pages
import CustomerApp from "../pages/customer/UserView.jsx"; 

// Components - Admin
import ProtectedRoute from "../components/publicProtectedRoute/ProtectedRoute.jsx";
import AlreadyLoggedInRoute from "../components/publicProtectedRoute/AlreadyLoggedInRoute.jsx";
import UserList from "../components/UserList.jsx";
import TableList from "../components/TableList.jsx";
import FoodList from "../components/FoodList.jsx";
import OrderItem from "../components/OrderItem.jsx";
import AllOrdersList from "../components/AllOrdersList.jsx";
import AddNewUser from "../components/AddNewUser.jsx";
import AddNewTable from "../components/AddNewTable.jsx";
import AddNewFood from "../components/AddNewFood.jsx";
import EditUser from "../components/EditUserPage.jsx";
import EditFood from "../components/EditFood.jsx";
// import Carts from "../components/Carts.jsx";
// import AllRevenue from "../components/AllRevenue.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorePage />
  },

  {
    path: "/login",
    element: <AlreadyLoggedInRoute><Login /></AlreadyLoggedInRoute>
  },
  {
    path: "/register",
    element: <AlreadyLoggedInRoute><Register /></AlreadyLoggedInRoute>
  },

  {
    path: "/logout",
    loader: () => redirect("/")
  },

  // Customer Routes
  {
    path: "/user",
    element: <ProtectedRoute><CustomerApp /></ProtectedRoute>,
    errorElement: <ErrorePage />
  },

  // Admin Routes
  {
    path: "/admin",
    element: <ProtectedRoute requiredRole="admin"><Dashboard /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <UserList />
      },
      {
        path: "add-user",
        element: <AddNewUser />
      },
      {
        path: "edit-user/:id",
        element: <EditUser />
      },
      {
        path: "table-list",
        element: <TableList />
      },
      {
        path: "add-table",
        element: <AddNewTable />
      },
      {
        path: "food-list",
        element: <FoodList />
      },
      { 
        path: "add-food",
        element: <AddNewFood />
      },
      { 
        path: "edit-food/:id",
        element: <EditFood />
      },
      {
        path: "order-list",
        element: <OrderItem />
      },
      {
        path: "all-orders-list",
        element: <AllOrdersList />
      },
      // {
      //   path: "cart-list",
      //   element: <Carts />
      // },
      // {
      //   path: "revenue",
      //   element: <AllRevenue />
      // }
    ]
  }
]);

export default routes;