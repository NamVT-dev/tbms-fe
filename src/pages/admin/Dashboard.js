import React from 'react';
import { UserGroupIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="bg-indigo-50 rounded-lg p-3">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
    <div className="mt-4">
      <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}
      </span>
      <span className="text-sm text-gray-500 ml-2">vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Customers"
          value="3,782"
          icon={UserGroupIcon}
          trend="up"
          trendValue="11.01%"
        />
        <StatCard
          title="Orders"
          value="5,359"
          icon={ShoppingBagIcon}
          trend="down"
          trendValue="9.05%"
        />
      </div>

      {/* Monthly Sales Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Monthly Sales</h2>
        </div>
        <div className="h-72">
          {/* Add your chart component here */}
          <div className="flex items-center justify-center h-full text-gray-500">
            Chart will be implemented here
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Statistics</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-md">
              Monthly
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
              Quarterly
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
              Annually
            </button>
          </div>
        </div>
        <div className="h-72">
          {/* Add your statistics chart component here */}
          <div className="flex items-center justify-center h-full text-gray-500">
            Statistics chart will be implemented here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 