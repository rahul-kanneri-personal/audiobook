'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Dummy data for orders
const orders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john.doe@email.com',
    products: ['The Great Gatsby', '1984'],
    total: '$28.98',
    status: 'Completed',
    paymentMethod: 'Credit Card',
    orderDate: '2024-01-15',
    shippingDate: '2024-01-15',
    trackingNumber: 'TRK123456789',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane.smith@email.com',
    products: ['To Kill a Mockingbird'],
    total: '$11.99',
    status: 'Processing',
    paymentMethod: 'PayPal',
    orderDate: '2024-01-14',
    shippingDate: null,
    trackingNumber: null,
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    email: 'bob.johnson@email.com',
    products: ['Pride and Prejudice', 'The Catcher in the Rye'],
    total: '$28.98',
    status: 'Shipped',
    paymentMethod: 'Credit Card',
    orderDate: '2024-01-13',
    shippingDate: '2024-01-14',
    trackingNumber: 'TRK987654321',
  },
  {
    id: 'ORD-004',
    customer: 'Alice Brown',
    email: 'alice.brown@email.com',
    products: ['The Hobbit'],
    total: '$16.99',
    status: 'Completed',
    paymentMethod: 'Apple Pay',
    orderDate: '2024-01-12',
    shippingDate: '2024-01-12',
    trackingNumber: 'TRK456789123',
  },
  {
    id: 'ORD-005',
    customer: 'Charlie Wilson',
    email: 'charlie.wilson@email.com',
    products: ['The Great Gatsby', '1984', 'To Kill a Mockingbird'],
    total: '$40.97',
    status: 'Pending',
    paymentMethod: 'Credit Card',
    orderDate: '2024-01-11',
    shippingDate: null,
    trackingNumber: null,
  },
  {
    id: 'ORD-006',
    customer: 'Diana Prince',
    email: 'diana.prince@email.com',
    products: ['Pride and Prejudice'],
    total: '$13.99',
    status: 'Cancelled',
    paymentMethod: 'Credit Card',
    orderDate: '2024-01-10',
    shippingDate: null,
    trackingNumber: null,
  },
];

const orderStats = [
  { label: 'Total Orders', value: orders.length, color: 'text-blue-600' },
  {
    label: 'Completed',
    value: orders.filter(o => o.status === 'Completed').length,
    color: 'text-green-600',
  },
  {
    label: 'Processing',
    value: orders.filter(o => o.status === 'Processing').length,
    color: 'text-yellow-600',
  },
  {
    label: 'Pending',
    value: orders.filter(o => o.status === 'Pending').length,
    color: 'text-orange-600',
  },
];

export default function OrdersPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Shipped':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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
              Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage customer orders and track fulfillment.
            </p>
          </div>
          <Button variant="outline">
            <span className="mr-2">📊</span>
            Export Orders
          </Button>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {orderStats.map((stat, index) => (
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
                  placeholder="Search orders by ID, customer name, or email..."
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  All Status
                </Button>
                <Button variant="outline" size="sm">
                  This Week
                </Button>
                <Button variant="outline" size="sm">
                  This Month
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {order.id}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Customer
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.customer}
                          </p>
                          <p className="text-gray-500 dark:text-gray-500">
                            {order.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Products
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.products.join(', ')}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Order Date
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.orderDate}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Payment Method
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.paymentMethod}
                          </p>
                        </div>

                        {order.trackingNumber && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Tracking Number
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {order.trackingNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {order.total}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {order.status === 'Processing' && (
                          <Button size="sm">Process Order</Button>
                        )}
                        {order.status === 'Pending' && (
                          <Button size="sm" variant="outline">
                            Mark as Processing
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Revenue:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $142.89
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    This Month:
                  </span>
                  <span className="font-semibold text-green-600">$89.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Last Month:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $53.44
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    John Doe:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $28.98
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Bob Johnson:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $28.98
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Charlie Wilson:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $40.97
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Process Pending Orders
                </Button>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full">
                  Update Inventory
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
