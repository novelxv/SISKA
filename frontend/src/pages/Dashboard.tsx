import React from 'react';
import Sidebar from '../components/Navbar';
import "../styles/Global.css"

const Dashboard: React.FC = () => {
    return (
        <div>
            <Sidebar></Sidebar>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard page. This is a placeholder content.</p>
        </div>
    );
};

export default Dashboard;