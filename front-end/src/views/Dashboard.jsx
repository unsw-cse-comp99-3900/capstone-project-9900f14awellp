import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ResponsiveAppBar } from "../components/Navbar";
import OutlinedAlerts from '../components/Alert';
import SparklesText from '@/components/SparklesText';
import { DashboardCard } from '@/components/CardBorder';

export default function Dashboard() {
  const token = localStorage.getItem('token');
  const [alert, setAlert] = useState(null); // 初始状态设置为null
  const fetchNumData = useCallback(() => {
    axios.get('http://localhost:8000/invoice/invoice-number', {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log(response.data);
        setAlert({ severity: 'success', message: 'upload successfully' });
    })
    .catch(error => {
        console.log(error.message);
        setAlert({ severity: 'error', message: error.message });
    });
}, [token]);

useEffect(() => {
  fetchNumData();
}, [fetchNumData]);
    

    return (
        <div>
            <ResponsiveAppBar />
            {alert && (
              <div style={{
                  position: 'fixed',
                  top: '11vh',
                  right: 10,
                  width: '30%',
                  zIndex: 9999
              }}>
                  <OutlinedAlerts severity={alert.severity} onClose={() => setAlert(null)}>
                      {alert.message}
                  </OutlinedAlerts>
              </div>
              )}
              <div className="container mx-auto p-7"style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
              }}>
                <SparklesText
                  text="Hi, Welcome Back!"
                  colors={{ first: "#FFD700", second: "#FF4500" }}
                  className="my-custom-class"
                  sparklesCount={8}
                  style={{ textAlign: 'left', fontSize: '2rem' }} // 直接在style中设置
                />
              </div>
              <div style={{
                  margin: '10px',
                  width: '40%',
                  padding: '10px',
                  
                               
              }}>
              <DashboardCard></DashboardCard>
              </div>
              
        </div>
    );
}