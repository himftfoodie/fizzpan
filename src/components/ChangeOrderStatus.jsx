import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from "axios";
import ApiCall from '../components/apiCollection/ApiCall';
import '../styles/AssignUserToTable.css';
import UseLoader from './loader/UseLoader';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const ModalComponent = ({ open, handleClose, orderInfo }) => {
    const [loader, showLoader, hideLoader] = UseLoader();
    const [orderStatus, setOrderStatus] = useState({ id: orderInfo, status: '' });
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderStatus({ ...orderStatus, [name]: value });
        setValue('status', e.target.value);
    };

    const handleAssign = async () => {
        showLoader();
        try {
            const response = await axios.put(`${ApiCall.baseUrl}Order/update-status/${orderInfo}`, orderStatus);

            if (response.status === 204) {
                const navigate = useNavigate();
                navigate("/admin/all-order-list");
                hideLoader();
            }
            handleClose();

        } catch (error) {
            setTimeout(() => {
                hideLoader();
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: "",
                });
            }, 3000);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box className="mainContainer">
                    <div className='titleContainer'>
                        <Typography className='bodyText' sx={{textAlign: 'center', paddingTop: "20px !important"}} id="modal-title" variant="h6" component="h2" gutterBottom>
                            Change The Order Status
                        </Typography>
                    </div>

                    <form onSubmit={handleSubmit(handleAssign)}>
                        <Box className='bodyContainerBox'>
                            <FormControl fullWidth error={!orderStatus.status && !!errors.status} >

                                <InputLabel >Order Status</InputLabel>
                                <Select
                                    label="Order Status"
                                    name="status"
                                    value={orderStatus.status}
                                    {...register('status', { required: 'Order Status is required' })}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Pending</MenuItem>
                                    <MenuItem value={1}>Confirmed</MenuItem>
                                    <MenuItem value={2}>Preparing</MenuItem>
                                    <MenuItem value={3}>Prepared To Serve</MenuItem>
                                    <MenuItem value={4}>Served</MenuItem>
                                    <MenuItem value={5}>Paid</MenuItem>
                                </Select>
                                {orderStatus.status ? <FormHelperText>{""}</FormHelperText> : <FormHelperText>{errors.status?.message}</FormHelperText>}
                            </FormControl>

                        </Box>
                        <Box className="buttonContainer">
                            <Button type='submit' variant="contained" className='buttonStyle'>
                                Change
                            </Button>
                            <Button onClick={handleClose} variant="contained" className='buttonStyle' sx={{ ml: 2 }}>
                                Close
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
            {loader}
        </>
    );
};

export default ModalComponent;
