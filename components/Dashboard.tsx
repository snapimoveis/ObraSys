import React from 'react';
import DashboardOverview from './dashboard/DashboardOverview';

/**
 * Dashboard Wrapper Component.
 * Delegates the logic to the modular DashboardOverview.
 */
const Dashboard: React.FC = () => {
  return <DashboardOverview />;
};

export default Dashboard;
