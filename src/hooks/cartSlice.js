import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import ApiCall from "../components/apiCollection/ApiCall";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    tableId: null,
  },
  reducers: {
    addItem: (state, action) => {
      const { tableId, ...itemData } = action.payload;
      state.items.push(itemData);
      state.tableId = tableId;
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.items.splice(0, state.items.length);
    },
    setTableId: (state, action) => {
      state.tableId = action.payload;
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 0) {
        item.quantity -= 1;
        if (item.quantity === 0) {
          const index = state.items.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            state.items.splice(index, 1);
          }
        }
      }
    },
   
  },
});
export const confirmOrder = (order) => {
    console.log("hitted")
    
       return axios.post(`${ApiCall.baseUrl}/Order/create`, order)
        
    }

export const {
  addItem,
  removeItem,
  clearCart,
  setTableId,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;