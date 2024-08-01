import React, { useEffect, useState } from 'react';
import { Outlet} from "react-router-dom";
import { ResponsiveAppBar } from "../components/Navbar";
import { VirtualizedList } from "../components/List";

export default function Dashboard() {
    //* 
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    useEffect(() => {
        const handleResize = () => {
          setViewportHeight(window.innerHeight);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    
    const listHeight = viewportHeight - 70; //AppBar 的高度70
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
                  width: '90%',
                  padding: '10px',             
              }}>
              <DashboardCard
                total={total}
                success={success}
                fail={fail}
                unvalidated={unvalidated}
              ></DashboardCard>
              <div style={{ display: 'flex', gap: '20px', marginTop:'30px' }}>
                <Card style={{ width: '50%', padding: '20px' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      NUMBERS
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Total invoices and sent invoices
                    </Typography>
                    <SimpleLineChart 
                xLabels={xLabels}
                aLine={totalInvoiceCounts}
                bLIne={sendInvoiceCounts}
                />
                  </CardContent>
                </Card>
                <Card style={{ width: '50%', padding: '20px' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Current Numbers
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Hover your mouse
                    </Typography>
                    <PieActiveArc data={data} />
                  </CardContent>
                </Card>
              </div>
            </div>  
        </div>
    );
}