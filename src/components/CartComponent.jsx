import useCart from "../hooks/useCart";
import { Button, Drawer, Typography } from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useDispatch, useSelector } from "react-redux";
import ApiCall from "../components/apiCollection/ApiCall";
import axios from "axios";
import {clearCart, decreaseQuantity, increaseQuantity,selectCart} from "../hooks/cartSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { removeItem } from "../hooks/cartSlice";
import Swal from "sweetalert2";

const CartComponent = () => {
  const cartItemsWithTable = useSelector(selectCart);
  const { open, handleToggle, classes } = useCart();
  const dispatch = useDispatch();
  const cartItems = cartItemsWithTable.items;

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };
  
  const handleDecreaseQuantity = (itemId) => {
    dispatch(decreaseQuantity(itemId));
  };

  const handleIncreaseQuantity = (itemId) => {
    dispatch(increaseQuantity(itemId));
  };

  const handleConfirmOrder = () => {
    const order = {
      amount: cartItems.reduce(
        (acc, item) => acc + item.price * (item.quantity || 1),
        0
      ),
      items: [
        ...cartItems.map((item) => ({
          foodId: item.id,
          foodPackageId: null,
          quantity: item.quantity,
          totalPrice: item.price * (item.quantity || 1),
          unitPrice: item.price,
        })),
      ],
      orderNumber: new Date().toISOString(),
      phoneNumber: "",
      tableId: cartItemsWithTable.tableId,
    };
    axios.post(ApiCall.orderFood, order).then((res) => {
      console.log(res);
      Swal.fire({
        icon: "success",
        title: "Order Confirmed",
        text: "Your order has been confirmed",
      });
      dispatch(clearCart());
    });
  };

  return (
    <div>
      <div className="relative">
        <Button onClick={handleToggle}>
          <ShoppingBasketIcon className="text-white" />
        </Button>
        <Typography className="text-white absolute -top-2 right-0 rounded-full p-1 text-xs">
          {cartItems?.length}
        </Typography>
      </div>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleToggle}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className="p-2">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl text-red-500 font-bold">Cart</h2>
            <CancelIcon
              className="text-3xl text-red-500 font-bold cursor-pointer"
              onClick={handleToggle}
            />
          </div>
          <hr className="border-red-500 my-4 border-2 -m-2" />
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className=" w-full  rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={`https://restaurantapi.bssoln.com/images/food/${item.image}`}
                      alt={item.title}
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="grid gap-4 ml-4">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <div className="flex items-center justify-between w-16">
                        <button
                          className="text-2xl h-4 btn bg-transparent rounded-none px-3"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          -
                        </button>
                        <span className="text-2xl h-4 btn bg-transparent border-l-0 border-r-0 hover:bg-transparent rounded-none px-4">
                          {item.quantity}
                        </span>
                        <button
                          className="text-2xl h-4 btn bg-transparent rounded-none  px-3"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <DeleteForeverIcon
                      className="text-gray-500 cursor-pointer"
                      onClick={() => handleRemoveItem(item.id)}
                    />
                    <p className="text-gray-500">
                      Price: ৳{item.price * item.quantity || item.price}
                    </p>
                  </div>
                </div>
                <hr className="border-gray-500 my-4 border-1 -m-2" />
              </div>
            ))
          ) : (
            <h3 className="text-lg font-bold">No items in the cart</h3>
          )}
          {cartItems.length > 0 && (
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Subtotal: </h3>
              <h3 className="text-xl font-bold">
                {cartItems.reduce(
                  (acc, item) => acc + item.price * (item.quantity || 1),
                  0
                )}
                ৳
              </h3>
            </div>
          )}
          {cartItems.length > 0 && (
            <button
              onClick={handleConfirmOrder}
              className="w-full bg-red-700 text-white p-2 rounded-lg mt-4"
            >
              Confirm Order
            </button>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default CartComponent;