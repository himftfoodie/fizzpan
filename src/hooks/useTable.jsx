import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./tableSlice"

const useTable = (page, rowsPerPage) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.table.data);
    const totalData = useSelector((state) => state.table.totalData);

    useEffect(() => {
        dispatch(fetchData({ page, rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    return { data, totalData };
};

export default useTable;
