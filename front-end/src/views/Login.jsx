import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { InputTextField, PasswordTextField } from '../components/Inputs';
import { ButtonSizes } from '../components/Buttons';
import { UnderlineLink, AlignRight} from '../components/Link';
import { BasicModal } from '../components/Model';
import axios from 'axios';

export default function Login() {
    //* 路由跳转
    const navigate = useNavigate();
    const goRegister = () => {
        navigate("/register");
    }
    const goDashboard = () => {
        navigate("/home");
    }
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = () => {
        axios.post('http://127.0.0.1:8000/invoice/login/', null, {
            params: {
                username: username,
                password: password
            }, // Query parameters
            headers: {
              'Accept': 'application/json' // Setting the Accept header
            }
          })
        .then(response => {
        console.log(response.data);
        // const token = response.data.token;
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('userid', response.data.userid);
        alert(response.data.state);
        goDashboard();
        })
        .catch(error => {
        if (error.response) {
            alert(error.response.data.detail || 'Login failed');
            console.log(username, password)
            console.log(error.response);

        } else {
            alert(error.message);
            console.log(error.message);
        }
        });
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Login</h1>
                <InputTextField label="username" id="Login-username" defaultValue="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <PasswordTextField id="Login-password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <AlignRight>
                    <UnderlineLink onClick={goRegister} fontsize='9px'>
                        Forget your password?
                    </UnderlineLink>
                </AlignRight>
                
                <ButtonSizes onClick={handleLogin}>
                    Login
                </ButtonSizes>
                <UnderlineLink onClick={goRegister}  fontsize='10px'>
                    Don't have an account? Go register
                </UnderlineLink>
                <BasicModal 
                    title="Terms of Service and Privacy Policy" 
                    description="This is a dynamic description. Hi, you found us!"
                >
                    By clicking Login, you agree to our Terms of Service and Privacy Policy
                </BasicModal>
            </div>
        </div>
    );
}
