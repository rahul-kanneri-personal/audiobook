'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Dummy data for customers (non-admin users)
const customers = [
  {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-12-15',
    lastActive: '2024-01-15',
    totalOrders: 5,
    totalSpent: '$89.45',
    status: 'Active',
    location: 'New York, NY',
    favoriteGenre: 'Classic Literature',
    avatar: 'JD',
  },
  {
    id: 'CUST-002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 234-5678',
    joinDate: '2023-11-20',
    lastActive: '2024-01-14',
    totalOrders: 3,
    totalSpent: '$45.99',
    status: 'Active',
    location: 'Los Angeles, CA',
    favoriteGenre: 'Dystopian Fiction',
    avatar: 'JS',
  },
  {
    id: 'CUST-003',
    name: 'Bob Johnson',
    email: 'bob.johnson@email.com',
    phone: '+1 (555) 345-6789',
    joinDate: '2023-10-10',
    lastActive: '2024-01-13',
    totalOrders: 7,
    totalSpent: '$156.78',
    status: 'Active',
    location: 'Chicago, IL',
    favoriteGenre: 'Romance',
    avatar: 'BJ',
  },
  {
    id: 'CUST-004',
    name: 'Alice Brown',
    email: 'alice.brown@email.com',
    phone: '+1 (555) 456-7890',
    joinDate: '2023-09-05',
    lastActive: '2024-01-12',
    totalOrders: 2,
    totalSpent: '$29.98',
    status: 'Active',
    location: 'Miami, FL',
    favoriteGenre: 'Fantasy',
    avatar: 'AB',
  },
  {
    id: 'CUST-005',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@email.com',
    phone: '+1 (555) 567-8901',
    joinDate: '2023-08-15',
    lastActive: '2024-01-11',
    totalOrders: 4,
    totalSpent: '$67.45',
    status: 'Active',
    location: 'Seattle, WA',
    favoriteGenre: 'Coming of Age',
    avatar: 'CW',
  },
  {
    id: 'CUST-006',
    name: 'Diana Prince',
    email: 'diana.prince@email.com',
    phone: '+1 (555) 678-9012',
    joinDate: '2023-07-20',
    lastActive: '2023-12-20',
    totalOrders: 1,
    totalSpent: '$13.99',
    status: 'Inactive',
    location: 'Boston, MA',
    favoriteGenre: 'Classic Literature',
    avatar: 'DP',
  },
  {
    id: 'CUST-007',
    name: 'Eva Martinez',
    email: 'eva.martinez@email.com',
    phone: '+1 (555) 789-0123',
    joinDate: '2023-06-10',
    lastActive: '2024-01-10',
    totalOrders: 6,
    totalSpent: '$98.34',
    status: 'Active',
    location: 'Austin, TX',
    favoriteGenre: 'Dystopian Fiction',
    avatar: 'EM',
  },
  {
    id: 'CUST-008',
    name: 'Frank Thompson',
    email: 'frank.thompson@email.com',
    phone: '+1 (555) 890-1234',
    joinDate: '2023-05-25',
    lastActive: '2023-11-15',
    totalOrders: 2,
    totalSpent: '$31.98',
    status: 'Inactive',
    location: 'Denver, CO',
    favoriteGenre: 'Fantasy',
    avatar: 'FT',
  },
];

const customerStats = [
  { label: 'Total Customers', value: customers.length, color: 'text-blue-600' },
  {
    label: 'Active Customers',
    value: customers.filter(c => c.status === 'Active').length,
    color: 'text-green-600',
  },
  { label: 'New This Month', value: 12, color: 'text-purple-600' },
  { label: 'Avg Order Value', value: '$65.25', color: 'text-orange-600' },
];

export default function CustomersPage() {
  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Customers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your customer base and track engagement.
            </p>
          </div>
          <Button variant="outline">
            <span className="mr-2">📊</span>
            Export Customers
          </Button>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {customerStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search customers by name, email, or location..."
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  All Customers
                </Button>
                <Button variant="outline" size="sm">
                  Active Only
                </Button>
                <Button variant="outline" size="sm">
                  High Value
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map(customer => (
            <Card key={customer.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {customer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {customer.name}
                      </h3>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Email
                        </p>
                        <p className="text-gray-900 dark:text-white truncate">
                          {customer.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Location
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {customer.location}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Orders
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {customer.totalOrders}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Total Spent
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {customer.totalSpent}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Favorite Genre
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {customer.favoriteGenre}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Last Active
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {customer.lastActive}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customer Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers by Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers
                  .sort(
                    (a, b) =>
                      parseFloat(b.totalSpent.replace('$', '')) -
                      parseFloat(a.totalSpent.replace('$', ''))
                  )
                  .slice(0, 5)
                  .map((customer, index) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {customer.totalOrders} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {customer.totalSpent}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Active Customers:
                  </span>
                  <span className="font-semibold text-green-600">
                    {customers.filter(c => c.status === 'Active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Inactive Customers:
                  </span>
                  <span className="font-semibold text-gray-600">
                    {customers.filter(c => c.status === 'Inactive').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    New This Month:
                  </span>
                  <span className="font-semibold text-blue-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Avg Orders per Customer:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {(
                      customers.reduce((sum, c) => sum + c.totalOrders, 0) /
                      customers.length
                    ).toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
