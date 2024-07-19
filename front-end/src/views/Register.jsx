import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { InputTextField, PasswordTextField } from '../components/Inputs';
import { ButtonSizes } from '../components/Buttons';
import { UnderlineLink} from '../components/Link';
import { BasicModal } from '../components/Model';
import axios from 'axios';
import OutlinedAlerts from '../components/Alert';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState(null); // 初始状态设置为null

    //* 路由跳转
    const navigate = useNavigate();
    const goLogin = () => {
        navigate("/login");
    }
    
    const goChoice = () => {
        navigate("/choice");
    }
    const handleRegister = () => {
        if (password !== confirmPassword) {
            // alert('Passwords do not match');
            setAlert({ severity: 'warning', message: 'Passwords do not match' });
            return;
        }
        // console.log(username,password,confirmPassword,name,email)
        axios.post('http://127.0.0.1:8000/invoice/register/', {    
                username: username,
                password: password,
                name: name,
                email: email,
                confirm_password: confirmPassword,
            }, // Query parameters
            {headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
          })
        .then(response => {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('userid', response.data.userid);
            console.log(response.data);
            setAlert({ severity: 'success', message: 'Register successfully!'});
            goChoice();
        })
        .catch(error => {
            if (error.response) {
                console.log(username,password,confirmPassword,name,email)
                // alert(error.response.data.detail || 'Registration failed');
                setAlert({ severity: 'error', message: error.response.data.detail || 'Registration failed' });
                console.log(error.response.data.detail);

            } else {
                setAlert({ severity: 'error', message: error.message });
                console.log(error.message);
            }
        });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center',flexDirection: 'column', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
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