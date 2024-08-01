import React, { useEffect, useState } from 'react';
import { Badge, Descriptions } from 'antd';
import axios from 'axios';
import { ResponsiveAppBar } from "../components/Navbar";

export default function CompanyDetails() {
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8000/invoice/company-info/', {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIyNTE2NDA5LCJpYXQiOjE3MjI0MzAwMDksImp0aSI6ImQyZjgyZGQ2NDRiNzQ5NWNiZWIzOWJiNDdmZmY3NDU5IiwidXNlcl9pZCI6MX0.Rtb0u2MNHD66W1e5Ndw6jrDqvKJzj9eJcWeYe6Tpcj0'
          }
        });
        setCompanyInfo(response.data);
      } catch (error) {
        console.error('Error fetching company info:', error);
      }
    };

    fetchCompanyInfo();
  }, []);

  if (!companyInfo) {
    return <div>Loading...</div>;
  }

  const items = [
    {
      key: '1',
      label: 'Company Name',
      children: companyInfo.name,
    },
    {
      key: '2',
      label: 'Company Phone Number',
      children: companyInfo.phone_number,
    },
    {
      key: '3',
      label: 'Company Email',
      children: companyInfo.email,
    },
    {
      key: '4',
      label: 'Company Address',
      span: 2,
      children: companyInfo.address,
    },
    {
      key: '5',
      label: 'ABN',
      children: companyInfo.ABN,
    },
    {
      key: '6',
      label: 'Status',
      span: 3,
      children: <Badge status="processing" text="Active" />,
    },
    {
      key: '7',
      label: 'Create Date',
      children: companyInfo.create_date,
    },
    {
      key: '8',
      label: 'Update Date',
      children: companyInfo.update_date,
    },
    {
      key: '9',
      label: 'Others',
      children: (
        <>
          Boss ID: {companyInfo.boss_id}
          <br />
          {/* Add any other relevant config info here */}
        </>
      ),
    },
  ];

  return (
    <div>
        <ResponsiveAppBar />
        <div style={{ margin: "30px"}}>
            <Descriptions title="Company Information" layout="vertical" bordered items={items} />
        </div>
       
    </div>

    
  );
};


