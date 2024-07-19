import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { OutlinedCard } from '../components/Card'
// import { BasicModal } from '../components/Model';
import { ChoiceCompanyForm } from '../components/Form'
import { CreateCompanyForm } from '../components/Form'
import axios from 'axios';
import OutlinedAlerts from '../components/Alert';

export default function Choice() {
    //const userid = '9'; // Replace with the actual user ID
    // const userid = localStorage.getItem('userid'); // 从 localStorage 获取 userid
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openCreateForm, setOpenCreateForm] = useState(false);
    const [names, setNames] = useState([]);
    const [alert, setAlert] = useState(null); // 初始状态设置为null

  
    const handleOpen = () => {
        axios.get(`http://127.0.0.1:8000/invoice/join-company/`,{
            headers: {
                'Accept': 'application/json', // Setting the Accept header
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data);
            setNames(response.data); // 确保响应数据是一个数组
            // handleSubmitCreateForm();
            setOpen(true);
        })
        .catch(error => {
            console.log(formData);
            console.log(error.message);
            setAlert({ severity: 'error', message: error.message });
        });
        
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (names) => {
        axios.post(`http://127.0.0.1:8000/invoice/join-company/`,
            {
                company_name: names
            },
            {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            
        })
        .then(response => {
            console.log(response.data);
            console.log(formData);
            handleSubmitCreateForm();
            // alert(response.data.success);
            setAlert({ severity: 'success', message: 'You join a company!'});
        })
        .catch(error => {
            console.log(formData);
            console.log(error.message);
            setAlert({ severity: 'error', message: error.message });
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
        axios.post(`http://127.0.0.1:8000/invoice/create-company/`, formData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Response:', response.data);
            console.log(formData);
            // alert('You create a company!');
            setAlert({ severity: 'success', message: 'You create a company!' });
            handleSubmitCreateForm();
        })
        .catch(error => {
            console.log(formData);
            console.log(error.message);
            setAlert({ severity: 'error', message: error.message });
        });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
            {alert && (
                    <div style={{
                        position: 'fixed',
                        top: '11vh',
                        right: 10,
                        // transform: 'translateX(-50%)',  
                        width: '30%',
                        zIndex: 9999
                    }}>
                        <OutlinedAlerts severity={alert.severity} onClose={() => setAlert(null)}>
                            {alert.message}
                        </OutlinedAlerts>
                    </div>
                )}
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