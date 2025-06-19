import React, { useEffect, useState } from 'react';
import { UserGroupIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
    {trend && (
      <div className="mt-4">
        <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </span>
        <span className="text-sm text-gray-500 ml-2">vs last period</span>
      </div>
    )}
  </div>
);

// Hàm tạo mảng ngày liên tục từ from đến to
function getDateRange(from, to) {
  const result = [];
  let current = new Date(from);
  const end = new Date(to);
  while (current <= end) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return result;
}

const Dashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [timeRange, setTimeRange] = useState('1m');
  const [revenueRange, setRevenueRange] = useState('month');
  const [loading, setLoading] = useState(true);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/stats/view-new-user?range=${timeRange}&groupBy=day`,
        { withCredentials: true }
      );
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchRevenueStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/stats/revenue?range=${revenueRange}&groupBy=day`,
        { withCredentials: true }
      );
      setRevenueStats(response.data);
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUserStats(), fetchRevenueStats()]);
      setLoading(false);
    };
    fetchData();
  }, [timeRange, revenueRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  // Xử lý labels và datasets cho user chart
  let labels = [];
  let customerData = [];
  let partnerData = [];
  if (userStats?.from && userStats?.to) {
    const dateRange = getDateRange(userStats.from, userStats.to);
    labels = dateRange.map(date => date.toLocaleDateString('vi-VN'));
    const mapDataToLabels = (dataArr) =>
      dateRange.map(date => {
        const found = dataArr.find(
          item => new Date(item._id.date).toDateString() === date.toDateString()
        );
        return found ? found.count : 0;
      });
    customerData = mapDataToLabels(userStats.data.customer || []);
    partnerData = mapDataToLabels(userStats.data.partner || []);
  }

  // Xử lý labels và datasets cho revenue chart
  let revenueLabels = [];
  let revenueData = [];
  if (revenueStats?.data?.from && revenueStats?.data?.to) {
    const dateRange = getDateRange(revenueStats.data.from, revenueStats.data.to);
    revenueLabels = dateRange.map(date => date.toLocaleDateString('vi-VN'));
    revenueData = dateRange.map(date => {
      const found = (revenueStats.data.stats || []).find(
        item => {
          if (!item._id) return false;
          // Xử lý cho groupBy=day
          if (item._id.day && item._id.month && item._id.year) {
            return new Date(item._id.year, item._id.month - 1, item._id.day).toDateString() === date.toDateString();
          }
          // Xử lý cho groupBy=week/tháng/năm nếu cần
          return false;
        }
      );
      return found ? found.totalRevenue : 0;
    });
  }

  const userChartData = {
    labels,
    datasets: [
      {
        label: 'Khách hàng',
        data: customerData,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Đối tác',
        data: partnerData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  const revenueChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: 'Doanh thu',
        data: revenueData,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
      },
    ],
  };

  // Chart options: không cho phép giá trị âm
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Thống kê và phân tích dữ liệu hệ thống
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Tổng khách hàng"
          value={userStats?.data?.totals?.customer || 0}
          icon={UserGroupIcon}
        />
        <StatCard
          title="Tổng đối tác"
          value={userStats?.data?.totals?.partner || 0}
          icon={UserIcon}
        />
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(revenueStats?.data?.totalAllRevenue || 0)}
          icon={ShoppingBagIcon}
        />
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Thống kê người dùng</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setTimeRange('1d')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === '1d' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hôm nay
            </button>
            <button 
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === '7d' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              7 ngày
            </button>
            <button 
              onClick={() => setTimeRange('1m')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === '1m' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              1 tháng
            </button>
          </div>
        </div>
        <div className="h-72">
          <Line 
            data={userChartData}
            options={chartOptions}
          />
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Thống kê doanh thu</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setRevenueRange('day')}
              className={`px-3 py-1 text-sm rounded-md ${
                revenueRange === 'day' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Ngày
            </button>
            <button 
              onClick={() => setRevenueRange('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                revenueRange === 'week' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Tuần
            </button>
            <button 
              onClick={() => setRevenueRange('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                revenueRange === 'month' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Tháng
            </button>
          </div>
        </div>
        <div className="h-72">
          <Line 
            data={revenueChartData}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 