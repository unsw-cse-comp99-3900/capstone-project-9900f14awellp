import React, { useState } from 'react';
import axios from 'axios';
import { ResponsiveAppBar } from "../components/Navbar";
import { SelectSmall } from "../components/Select";
import { ButtonSizes } from "../components/Buttons";
import { MultipleSelect } from "../components/Select";
import { BasicModal } from "../components/Model";
import waiting from '../assets/waiting.gif'

export default function Validation() {
    let fileName = null;
    let uuid = null;
    const token = localStorage.getItem('token');
    const [showIcon, setShowIcon] = useState(false);
    // const [modalContent, setModalContent] = useState(null);
    const [validationReport, setValidationReport] = useState(null);
  
    const rules = [
        'AUNZ_PEPPOL_1_0_10',
        'AUNZ_PEPPOL_SB_1_0_10',
        'AUNZ_UBL_1_0_10',
        'FR_EN16931_CII_1_3_11',
        'RO_RO16931_UBL_1_0_8_EN16931',
        'FR_EN16931_UBL_1_3_11',
        'RO_RO16931_UBL_1_0_8_CIUS_RO',
    ];


    const handleClick = () =>{
        axios.get(`http://127.0.0.1:8000/invoice/invoice-info/`,{
            headers: {
                'Accept': 'application/json', // Setting the Accept header
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data);
            // 筛选出state为"Unvalidated"的数据
            const passedData = response.data.filter(entry => entry.sate === "Unvalidated");
            // 获得filename 的list
            // 跟select对应上，可以对应选择file
            // 找到file对应的uuid，post到后端
            // get its uuid and filename
            const results = passedData.map(entry => {
                fileName = entry.file.split('/').pop();
                uuid = entry.uuid;
            });
            console.log(JSON.stringify(results, null, 4));
        })
        .catch(error => {
            console.log(error.message);
            alert(error.message);
        });
        
    }
    const handleValidate = () => {
        setShowIcon(true);
        axios.post('http://127.0.0.1:8000/invoice/invoice-validation/',null, {
            params: {
              uuid: '0',
              rules: 'AUNZ_PEPPOL_1_0_10'
            }, 
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
        .then(response => {
                console.log(response.data);
                alert(response.data.msg);
                // setModalContent(response.data.msg);
                setValidationReport(response.data.validation_report); // 设置验证报告内容
                setShowIcon(false); // 隐藏等待图标

        })
        .catch(error => {
        if (error.response) {
            alert(error.response.data.detail || 'validate failed');
        } else {
            alert(error.message);
            console.log(error.message);
        }
        setShowIcon(false); // 隐藏等待图标，即使出错也要隐藏
        });
    };
    return (
        <div>
            <ResponsiveAppBar />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                    <h1 style={{ fontSize: '45px', marginBottom: '16px', fontWeight: 'bold' }}>Validate your E-invoice</h1>
                    <h6 style={{ fontSize: '15px', marginBottom: '16px', color: 'gray'  }}>please choose your invoice and rules</h6>
                    <MultipleSelect lists={rules}></MultipleSelect>
                    <SelectSmall onclick={handleClick}></SelectSmall>
                    <ButtonSizes onClick={handleValidate}>
                        Validate
                    </ButtonSizes>
                    {showIcon && (
                        <div style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            zIndex: 9999
                        }}>
                            <img src={waiting} alt="icon" />
                        </div>
                    )}
                    {validationReport && (
                        <BasicModal 
                            title="Validation Result" 
                            //description={modalContent}
                            open={!!validationReport}
                            onClose={() => setValidationReport(null)}
                        >
                            <div>
                                <p>Filename: {validationReport?.filename}</p>
                                <p>Message: {validationReport?.message}</p>
                                <p>Total Errors: {validationReport?.firedAssertionErrorsCount}</p>
                                <p>Total Reports: {validationReport?.firedSuccessfulReportsCount}</p>
                            </div>
                        </BasicModal>
                    )}
                </div>
                
        </div>
    );
}