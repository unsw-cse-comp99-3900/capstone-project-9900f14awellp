import React from "react";
import { useNavigate } from "react-router-dom";
import { InputTextField, PasswordTextField } from '../components/Inputs';
import { ButtonSizes } from '../components/Buttons';
import { UnderlineLink} from '../components/Link';
import { BasicModal } from '../components/Model';

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

    return (
        <div style={{ display: 'flex', justifyContent: 'center',flexDirection: 'column', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
                <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Create an account</h1>
                <InputTextField label="Email" id="Register-Email" defaultValue="Email" />
                <InputTextField label="Name" id="Register-Name" defaultValue="Name" />
                <PasswordTextField /> 
                <PasswordTextField /> 
                <ButtonSizes onClick={goChoice}>
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