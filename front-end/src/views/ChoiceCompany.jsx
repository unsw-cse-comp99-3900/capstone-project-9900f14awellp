import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { OutlinedCard } from '../components/Card'
// import { BasicModal } from '../components/Model';
import { ChoiceCompanyForm } from '../components/Form'
import { CreateCompanyForm } from '../components/Form'
import axios from 'axios';

export default function Choice() {
    const userid = '9'; // Replace with the actual user ID
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openCreateForm, setOpenCreateForm] = useState(false);
    const [names, setNames] = useState([]);

  
    const handleOpen = () => {
        axios.get(`http://localhost:8000/invoice/join-company/${userid}/`)
        .then(response => {
            console.log(response.data.companies);
            setNames(response.data.companies); // 确保响应数据是一个数组
            // handleSubmitCreateForm();
            setOpen(true);
        })
        .catch(error => {
            console.log(formData);
            console.log(error.message);
            alert(error.message);
        });
        
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (personName) => {
        axios.post(`http://localhost:8000/invoice/join-company/${userid}/`, {
            company_name: personName
        })
        .then(response => {
            console.log(response.data);
            console.log(formData);
            handleSubmitCreateForm();
            alert(response.data.success);
        })
        .catch(error => {
            console.log(formData);
            console.log(error.message);
            alert(error.message);
        });
        navigate("/home");
        setOpen(false);
    };
    

    const handleOpenCreateForm = () => {
        setOpenCreateForm(true);
    };

    const handleCloseCreateForm = () => {
        setOpenCreateForm(false);
    };

    const handleSubmitCreateForm = () => {
        setOpenCreateForm(false);
        navigate("/home");
    };


    
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        email: '',
        ABN: '',
        address: ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };

    const handleChioceCompany = () =>{
        axios.post(`http://localhost:8000/invoice/create-company/${userid}/`, formData)
        .then(response => {
            console.log('Response:', response.data);
            console.log(formData);
            alert('You create a company!');
            handleSubmitCreateForm();
        })
        .catch(error => {
            console.log(formData);
            console.log(error.message);
            alert(error.message);
        });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
            <h1 style={{ fontSize: '30px', marginBottom: '16px' }}>Welcome🥳</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', backgroundColor: 'white' }}>
                <OutlinedCard onClick={handleOpen} button = 'Join' title = 'Join a company'></OutlinedCard>
                <OutlinedCard onClick={handleOpenCreateForm} button = 'Create' title = 'Create a company'></OutlinedCard>
            </div>
            <ChoiceCompanyForm open={open} handleClose={handleClose} handleSubmit={handleSubmit} names={names}/>
            <CreateCompanyForm open={openCreateForm} handleClose={handleCloseCreateForm} handleSubmit={handleChioceCompany} formData={formData} handleChange={handleChange} />
        </div>
    );
}