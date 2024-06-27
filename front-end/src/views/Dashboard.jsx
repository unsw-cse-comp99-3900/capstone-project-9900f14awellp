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
            <div style={{ flexGrow: 1, overflow: 'auto' }}>
                <VirtualizedList height={listHeight}/>
            </div>
            <Outlet />
        </div>
    );
}