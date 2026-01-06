import { configureStore } from '@reduxjs/toolkit';
import tableReducer from "../../hooks/tableSlice" 
import cartReducer from "../../hooks/cartSlice"

const store = configureStore({
  reducer: {
    table: tableReducer,
    cart : cartReducer,
  },
});

export default store;
