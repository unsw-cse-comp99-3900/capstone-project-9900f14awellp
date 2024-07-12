import React from "react";
import axios from 'axios';
import { ResponsiveAppBar } from "../components/Navbar";
import { SelectSmall } from "../components/Select";
import { ButtonSizes } from "../components/Buttons";
import { MultipleSelect } from "../components/Select";

export default function Validation() {
    const token = localStorage.getItem('token');
    const rules = [
        'AUNZ_PEPPOL_1_0_10',
        'AUNZ_PEPPOL_SB_1_0_10',
        'AUNZ_UBL_1_0_10',
        'FR_EN16931_CII_1_3_11',
        'RO_RO16931_UBL_1_0_8_EN16931',
        'FR_EN16931_UBL_1_3_11',
        'RO_RO16931_UBL_1_0_8_CIUS_RO',
    ];

    const handleValidate = () => {
        axios.post('http://127.0.0.1:8000/invoice/invoice-validation/', {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
        .then(response => {
        console.log(response.data);
        alert(response.data.state);
        // goValiate(); valiate the invoice
        })
        .catch(error => {
        if (error.response) {
            alert(error.response.data.detail || 'validate failed');
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
            <MultipleSelect lists={rules}></MultipleSelect>
            <ButtonSizes onClick={handleValidate}>
                Validate
            </ButtonSizes>
        </div>
    );
}