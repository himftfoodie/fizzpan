import { createSlice } from "@reduxjs/toolkit";
import ApiCall from "../components/apiCollection/ApiCall";
import axios from "axios";

export const tableSlice = createSlice({
    name: "table",
    initialState: {
        data: [],
        totalData: 0,
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload.data;
            state.totalData = action.payload.total;
        },
        // deleteEntry: (state, action) => {
        //     state.data = state.data.filter(entry => entry.id !== action.payload);
        //     state.totalData--; // Assuming you decrement the totalData count
        // },
    },
});

export const { setData, deleteEntry } = tableSlice.actions;

export const fetchData = ({ page, rowsPerPage }) => (dispatch) => {
    axios
        .get(`${ApiCall.baseUrl}Table/datatable?page=${page + 1}&per_page=${rowsPerPage}`)
        .then((res) => {
            dispatch(setData({ data: res.data.data, total: res.data.total }));
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
        });
};

// export const deleteDataEntry = (id) => (dispatch) => {
//     axios
//         .delete(`${ApiCall.baseUrl}Table/delete/${id}`)
//         .then(() => {
//             dispatch(deleteEntry(id));
//         })
//         .catch((err) => {
//             console.error("Error deleting data entry:", err);
//         });
// };

export const updateCartLengthManually = (length) => (dispatch) => {
    dispatch(setData(length));
};

export default tableSlice.reducer;