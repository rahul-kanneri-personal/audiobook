'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Dummy data for user management (includes both admin and regular users)
const users = [
  {
    id: 'USER-001',
    name: 'Admin User',
    email: 'admin@audiobook.com',
    role: 'admin',
    status: 'Active',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-15',
    permissions: ['Full Access'],
    avatar: 'AU',
  },
  {
    id: 'USER-002',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'customer',
    status: 'Active',
    joinDate: '2023-12-15',
    lastLogin: '2024-01-15',
    permissions: ['Browse', 'Purchase', 'Review'],
    avatar: 'JD',
  },
  {
    id: 'USER-003',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    role: 'customer',
    status: 'Active',
    joinDate: '2023-11-20',
    lastLogin: '2024-01-14',
    permissions: ['Browse', 'Purchase', 'Review'],
    avatar: 'JS',
  },
  {
    id: 'USER-004',
    name: 'Bob Johnson',
    email: 'bob.johnson@email.com',
    role: 'customer',
    status: 'Active',
    joinDate: '2023-10-10',
    lastLogin: '2024-01-13',
    permissions: ['Browse', 'Purchase', 'Review'],
    avatar: 'BJ',
  },
  {
    id: 'USER-005',
    name: 'Alice Brown',
    email: 'alice.brown@email.com',
    role: 'customer',
    status: 'Suspended',
    joinDate: '2023-09-05',
    lastLogin: '2023-12-20',
    permissions: ['Browse'],
    avatar: 'AB',
  },
  {
    id: 'USER-006',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@email.com',
    role: 'customer',
    status: 'Active',
    joinDate: '2023-08-15',
    lastLogin: '2024-01-11',
    permissions: ['Browse', 'Purchase', 'Review'],
    avatar: 'CW',
  },
  {
    id: 'USER-007',
    name: 'Diana Prince',
    email: 'diana.prince@email.com',
    role: 'customer',
    status: 'Inactive',
    joinDate: '2023-07-20',
    lastLogin: '2023-11-15',
    permissions: ['Browse', 'Purchase', 'Review'],
    avatar: 'DP',
  },
  {
    id: 'USER-008',
    name: 'Eva Martinez',
    email: 'eva.martinez@email.com',
    role: 'moderator',
    status: 'Active',
    joinDate: '2023-06-10',
    lastLogin: '2024-01-10',
    permissions: ['Browse', 'Purchase', 'Review', 'Moderate'],
    avatar: 'EM',
  },
];

const userStats = [
  { label: 'Total Users', value: users.length, color: 'text-blue-600' },
  {
    label: 'Active Users',
    value: users.filter(u => u.status === 'Active').length,
    color: 'text-green-600',
  },
  {
    label: 'Admin Users',
    value: users.filter(u => u.role === 'admin').length,
    color: 'text-purple-600',
  },
  {
    label: 'Suspended Users',
    value: users.filter(u => u.status === 'Suspended').length,
    color: 'text-red-600',
  },
];

export default function UsersPage() {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'customer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage user accounts, roles, and permissions.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <span className="mr-2">👤</span>
            Add New User
          </Button>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {userStats.map((stat, index) => (
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
                  placeholder="Search users by name, email, or role..."
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  All Users
                </Button>
                <Button variant="outline" size="sm">
                  Admins
                </Button>
                <Button variant="outline" size="sm">
                  Customers
                </Button>
                <Button variant="outline" size="sm">
                  Active Only
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map(user => (
                <div
                  key={user.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </h3>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Joined: {user.joinDate} • Last login: {user.lastLogin}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Permissions
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {user.permissions.join(', ')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        {user.status === 'Active' ? (
                          <Button size="sm" variant="outline">
                            Suspend
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            Activate
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Reset Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Management Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Export User List
                </Button>
                <Button variant="outline" className="w-full">
                  Send Email to All Users
                </Button>
                <Button variant="outline" className="w-full">
                  Generate User Report
                </Button>
                <Button variant="outline" className="w-full">
                  Clean Up Inactive Users
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Active Today:
                  </span>
                  <span className="font-semibold text-green-600">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    New This Week:
                  </span>
                  <span className="font-semibold text-blue-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Suspended Users:
                  </span>
                  <span className="font-semibold text-red-600">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Admin Users:
                  </span>
                  <span className="font-semibold text-purple-600">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Management */}
        <Card>
          <CardHeader>
            <CardTitle>Role Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Admin
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full access to all features and settings
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• User Management</li>
                  <li>• Product Management</li>
                  <li>• Order Management</li>
                  <li>• System Settings</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Moderator
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Limited administrative access
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Review Moderation</li>
                  <li>• Customer Support</li>
                  <li>• Content Management</li>
                  <li>• Basic Reports</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Customer
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Standard user access
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Browse Products</li>
                  <li>• Make Purchases</li>
                  <li>• Write Reviews</li>
                  <li>• Manage Profile</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
