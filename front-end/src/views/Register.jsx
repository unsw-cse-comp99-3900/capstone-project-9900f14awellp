import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { InputTextField, PasswordTextField } from '../components/Inputs';
import { ButtonSizes } from '../components/Buttons';
import { UnderlineLink} from '../components/Link';
import { BasicModal } from '../components/Model';
import axios from 'axios';

export default function Register() {
    //* 路由跳转
    const navigate = useNavigate();
    const goLogin = () => {
        navigate("/login");
    }
    // const goDashboard = () => {
    //     navigate("/home");
    // }
    const goChoice = () => {
        navigate("/choice");
    }
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // console.log(username,password,confirmPassword,name,email)
        axios.post('http://localhost:8000/invoice/register/', {
            username: username,
            password: password,
            name: name,
            email: email,
            confirm_password: confirmPassword,
        })
        .then(response => {
            // localStorage.setItem('token', response.data.token);
            // localStorage.setItem('userid', response.data.userid);
            console.log(response.data);
            goChoice();
        })
        .catch(error => {
            if (error.response) {
                console.log(username,password,confirmPassword,name,email)
                alert(error.response.data.detail || 'Registration failed');
                console.log(error.response.data.detail);

            } else {
                alert(error.message);
                console.log(error.message);
            }
        });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center',flexDirection: 'column', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
                <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Create an account</h1>
                <InputTextField 
                label="Username" 
                id="Register-Username" 
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}  
                />
                <InputTextField 
                label="Email" 
                id="Register-Email" 
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
                />
                <InputTextField 
                label="Name" 
                id="Register-Name" 
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}  
                />
                <PasswordTextField 
                id="Register-password"
                label="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                /> 
                <PasswordTextField
                id="Register-confirm-password"
                label="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                /> 
                <ButtonSizes onClick={handleRegister}>
                    Sign up
                </ButtonSizes>
                <UnderlineLink onClick={goLogin}  fontsize='10px'>
                    Have an account? Go Login
                </UnderlineLink>
                <BasicModal 
                    title="Terms of Service and Privacy Policy" 
                    description="This is a dynamic description. Hi, you found us!"
                >
                    By clicking Login, you agree to our Terms of Service and Privacy Policy
                </BasicModal>
        </div>
    );
}