import React from "react";
import { useNavigate } from "react-router-dom";
import { InputTextField, PasswordTextField } from '../components/Inputs';
import { ButtonSizes } from '../components/Buttons';
import { UnderlineLink, AlignRight} from '../components/Link';
import { BasicModal } from '../components/Model';

export default function Login() {
    //* 路由跳转
    const navigate = useNavigate();
    const goRegister = () => {
        navigate("/register");
    }
    const goDashboard = () => {
        navigate("/home");
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Login</h1>
                <InputTextField label="Email" id="Login-Email" defaultValue="Email" />
                <PasswordTextField />
                <AlignRight>
                    <UnderlineLink onClick={goRegister} fontsize='9px'>
                        Forget your password?
                    </UnderlineLink>
                </AlignRight>
                
                <ButtonSizes onClick={goDashboard}>
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
