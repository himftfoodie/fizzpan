import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, TextField, Paper, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import Swal from 'sweetalert2';
import ApiCall from '../components/apiCollection/ApiCall';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import UseLoader from './loader/UseLoader';
import '../styles/CommonStyle.css';
import DefaultAdminImage from '../assets/img/defaultImg.png'

const AddNewTable = () => {

  const [loader, showLoader, hideLoader] = UseLoader();
  const navigate = useNavigate();
  const hiddenFileInput = useRef(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [formData, setFormData] = useState({
    tableNumber: '',
    numberOfSeats: '',
    image: '',
    base64: ''
  });

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, [name]: value, base64: reader.result });
      };
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async () => {
    showLoader();

    try {
      const response = await axios.post(`${ApiCall.baseUrl}Table/create`, formData);


      if (response.status === 200) {
        navigate("/admin/table-list");
        hideLoader();
      }

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
      <Paper className='mainPaperStyle'>
        <div className='page-top' style={{ borderBottom: "3px solid  #CC080B" }}>

          <div >
            <span style={{ paddingBottom: 50 }} className=' page-title'>Add Table</span>
          </div>
        </div>

        <div className='mainTableContainer customPadding' >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
              {/* First Row */}
              <Grid order={{ xs: 3, sm: 3 }} item xs={12} sm={8} >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Table Number"
                      name="tableNumber"
                      value={formData.tableNumber}
                      onInput={handleChange}
                      error={!!errors.tableNumber}
                      helperText={errors.tableNumber && errors.tableNumber.message}
                      {...register('tableNumber', { required: 'Table Number is required' })}

                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!formData.numberOfSeats && !!errors.numberOfSeats}>
                      <InputLabel >Number of Seats</InputLabel>
                      <Select
                        value={formData.numberOfSeats}

                        name="numberOfSeats"

                        label="Number of Seats"
                        {...register('numberOfSeats', { required: 'Number of Seats is required' })}
                        onChange={handleChange}

                      >
                        <MenuItem value={`2`}>2</MenuItem>
                        <MenuItem value={`4`}>4</MenuItem>
                        <MenuItem value={`6`}>6</MenuItem>
                        <MenuItem value={`8`}>8</MenuItem>
                        <MenuItem value={`12`}>12</MenuItem>

                      </Select>
                      {formData.numberOfSeats ? <FormHelperText>{""}</FormHelperText> : <FormHelperText>{errors.numberOfSeats?.message}</FormHelperText>}
                    </FormControl>
                  </Grid>



                  <Grid item xs={12} sx={{ paddingBottom: '10px' }}>
                    <Button type="submit" fullWidth variant="outlined" className='formSubmitButtonStyle'>Submit</Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Image Picker */}
              <Grid order={{ xs: 2, sm: 3 }} item xs={12} sm={4} >
                <div onClick={handleClick} className='image-picker-container'>
                  {
                    formData.base64 ?
                      <img src={formData.base64} alt="Uploaded" className='image-style' />
                      : <img src={DefaultAdminImage} alt="Default" className='image-style' />
                  }
                  <input style={{ display: 'none' }} type="file" accept="image/*" name="image" onChange={handleChange} ref={hiddenFileInput} />
                </div>
              </Grid>

            </Grid>
          </form>
        </div>
      </Paper>
      {loader}
    </>
  );
};

export default AddNewTable;

