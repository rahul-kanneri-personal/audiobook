'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Dummy data for dashboard
const dashboardStats = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: '👥',
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: '📦',
  },
  {
    title: 'Revenue',
    value: '$45,678',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: '💰',
  },
  {
    title: 'Products',
    value: '156',
    change: '+3.1%',
    changeType: 'positive' as const,
    icon: '📚',
  },
];

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    product: 'The Great Gatsby',
    amount: '$12.99',
    status: 'Completed',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    product: '1984',
    amount: '$15.99',
    status: 'Processing',
    date: '2024-01-14',
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    product: 'To Kill a Mockingbird',
    amount: '$11.99',
    status: 'Shipped',
    date: '2024-01-13',
  },
  {
    id: 'ORD-004',
    customer: 'Alice Brown',
    product: 'Pride and Prejudice',
    amount: '$13.99',
    status: 'Completed',
    date: '2024-01-12',
  },
  {
    id: 'ORD-005',
    customer: 'Charlie Wilson',
    product: 'The Catcher in the Rye',
    amount: '$14.99',
    status: 'Pending',
    date: '2024-01-11',
  },
];

const topProducts = [
  { name: 'The Great Gatsby', sales: 234, revenue: '$3,042.66' },
  { name: '1984', sales: 189, revenue: '$3,022.11' },
  { name: 'To Kill a Mockingbird', sales: 167, revenue: '$2,002.33' },
  { name: 'Pride and Prejudice', sales: 145, revenue: '$2,028.55' },
  { name: 'The Catcher in the Rye', sales: 123, revenue: '$1,844.77' },
];

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome to the admin dashboard. Here&apos;s an overview of your
            audiobook business.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="shadow-none p-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <span className="text-2xl">{stat.icon}</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p
                  className={`text-xs ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="shadow-none p-0">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'Shipped'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.customer} • {order.product}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="shadow-none p-0">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.revenue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
