import React, { useState, useEffect } from 'react';
import { ResponsiveAppBar } from "../components/Navbar";
import { NestedList } from "../components/List";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { InputTextField } from "../components/Inputs";
import { MultilineTextFields } from '../components/Inputs';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

export default function Sending() {
    const token = localStorage.getItem('token');
    const [firstName, setFirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [passedList, setPassedList] = useState([]);
    const [failedList, setFailedList] = useState([]);
    const [unvalidatedList, setUnvalidatedList] = useState([]);
    const [invoiceUuidMap, setInvoiceUuidMap] = useState({});
    const [selectedInvoices, setSelectedInvoices] = useState([]);

    const handleClear = () =>{
        setFirstName('');
        setlastName('');
        setEmail('');
        setMessage('');
        setSelectedInvoices([]);
    }

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/invoice/invoice-info/`,{
            headers: {
                'Accept': 'application/json', // Setting the Accept header
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data);
            // 筛选出state为"Unvalidated"的数据
            const passedData = response.data.filter(entry => entry.state === "Passed");
            const failedData = response.data.filter(entry => entry.state === "Failed");
            const unvalidatedData = response.data.filter(entry => entry.state === "unvalidated");
            // 三种类型的list
            setPassedList(passedData.map(entry => entry.file.split('/').pop()));
            setFailedList(failedData.map(entry => entry.file.split('/').pop()));
            setUnvalidatedList(unvalidatedData.map(entry => entry.file.split('/').pop()));
            // 理论上是所有发票的uuid--filename
            const uuidMap = response.data.reduce((acc, entry) => {
                acc[entry.file.split('/').pop()] = entry.uuid;
                return acc;
            }, {});
            setInvoiceUuidMap(uuidMap);
        })
        .catch(error => {
            console.log(error.message);
            alert(error.message);
        });
    }, [token]);
    const handleSend = () =>{
        const uuids = selectedInvoices.map(invoice => invoiceUuidMap[invoice]);
        if (!uuids) {
            alert('Please select an invoice');
            return;
        }
        axios.post('http://127.0.0.1:8000/invoice/invoice-validation/',null, {
            params: {
              uuid: uuids,
              email: email 
            }, 
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
        .then(response => {
                console.log(response.data);
                alert(response.data.msg);
        })
        .catch(error => {
        if (error.response) {
            alert(error.response.data.detail || 'Send failed');
        } else {
            alert(error.message);
            console.log(error.message);
        }
        });
    }

    const handleInvoiceSelection = (invoice) => {
        setSelectedInvoices(prevSelected => 
            prevSelected.includes(invoice)
            ? prevSelected.filter(item => item !== invoice)
            : [...prevSelected, invoice]
        );
    };

    return (
        <div>
            <ResponsiveAppBar />
            <Box
            sx={{
                height: '80vh',    
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'divider',
                borderRadius: 2,
                // bgcolor: 'background.paper',
                // color: 'text.secondary',
                marginTop: '10px',
                '& svg': {
                    m: 1,
                },
                }}
            >
            <div style={{ margin: '30px'}}>
            <h1  style={{ fontSize: '45px', marginBottom: '50px', fontWeight: 'bold'}}>Choice  Invoice</h1>
            <NestedList  
            passedList={passedList} 
            failedList={failedList} 
            unvalidatedList={unvalidatedList} 
            onInvoiceSelect={handleInvoiceSelection}
            selectedInvoices={selectedInvoices}
            ></NestedList>
            </div>
            <Divider orientation="vertical" variant="middle" flexItem />
            <div style={{ margin: '30px'}}>
                <h1  style={{ fontSize: '45px', marginBottom: '50px', fontWeight: 'bold' }}>Sending To</h1>
                <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <InputTextField label="First Name" id="first-name" defaultValue="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                    <div style={{ margin: '10px'}}></div>
                    <InputTextField label="Last Name" id="last-name" defaultValue="Last Name" value={lastName} onChange={(e) => setlastName(e.target.value)}/>
                </div>
                
                <InputTextField label="Email Address" id="email-address" defaultValue="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <div style={{ margin: '10px'}}></div>
                <MultilineTextFields label="Your Message" id="your-message" defaultValue="Your Message" value={message} onChange={(e) => setMessage(e.target.value)}/>
                <div style={{ display: 'flex', marginTop: '10px',  justifyContent: 'space-between'}}>
                    <Button variant="contained" startIcon={<DeleteIcon /> } sx = {{backgroundColor: '#eeeeee', color: 'black'}} onClick={handleClear}>
                        Clear
                    </Button>
                    <Button variant="contained" endIcon={<SendIcon />}sx = {{backgroundColor: '#263238', color: 'white'}} onClick={handleSend}>
                        Send
                    </Button>
                </div>
                
            </div>
            
            </Box>
      </div>
    );
}