import React from "react";
import axios from 'axios';
import { ResponsiveAppBar } from "../components/Navbar";
import { SelectSmall } from "../components/Select";
import { ButtonSizes } from "../components/Buttons";

export default function Validation() {
    const handleValicate = () => {
        axios.post('http://127.0.0.1:8000/invoice/login/', null, {
            headers: {
              'Accept': 'application/json'
            }
          })
        .then(response => {
        console.log(response.data);
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('userid', response.data.userid);
        alert(response.data.state);
        goDashboard();
        })
        .catch(error => {
        if (error.response) {
            alert(error.response.data.detail || 'Login failed');
        } else {
            alert(error.message);
            console.log(error.message);
        }
        });
    };
    return (
        <div>
            <ResponsiveAppBar />
            <h1>Validate your E-invoice</h1>
            <h6>please choose your invoice</h6>
            <SelectSmall></SelectSmall>
            <ButtonSizes onClick={handleValicate}>
                Validate
            </ButtonSizes>
        </div>
    );
}