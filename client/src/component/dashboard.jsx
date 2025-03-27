import React from 'react';
import Chart from "./chart";
import Header from "./header";
import KPICards from "./kpicards";
import Sidebar from "./sidebar";
import StatsCards from "./statsCard";
import PolicyTable from './table';


const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        <Header />
        <StatsCards />
        <KPICards />
        <Chart />
        <PolicyTable />
      </div>
    </div>
  );
};

export default Dashboard;
