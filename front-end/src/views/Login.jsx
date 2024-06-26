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
        axios.post('http://localhost:8000/invoice/login/', {
        username: username,
        password: password
        })
        .then(response => {
        console.log(response.data);
        goDashboard();
        })
        .catch(error => {
        if (error.response) {
            alert(error.response.data || 'Login failed');
            console.log(username, password)
            console.log(error.response.data);
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
