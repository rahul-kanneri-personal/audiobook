'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Dummy data for products
const products = [
  {
    id: 'PROD-001',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    narrator: 'Jake Gyllenhaal',
    duration: '4h 32m',
    price: '$12.99',
    category: 'Classic Literature',
    status: 'Active',
    sales: 234,
    rating: 4.8,
    publishedDate: '2024-01-15',
    image: '/placeholder-book.jpg',
  },
  {
    id: 'PROD-002',
    title: '1984',
    author: 'George Orwell',
    narrator: 'Simon Prebble',
    duration: '11h 22m',
    price: '$15.99',
    category: 'Dystopian Fiction',
    status: 'Active',
    sales: 189,
    rating: 4.9,
    publishedDate: '2024-01-10',
    image: '/placeholder-book.jpg',
  },
  {
    id: 'PROD-003',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    narrator: 'Sissy Spacek',
    duration: '12h 17m',
    price: '$11.99',
    category: 'Classic Literature',
    status: 'Active',
    sales: 167,
    rating: 4.7,
    publishedDate: '2024-01-08',
    image: '/placeholder-book.jpg',
  },
  {
    id: 'PROD-004',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    narrator: 'Rosamund Pike',
    duration: '11h 35m',
    price: '$13.99',
    category: 'Romance',
    status: 'Active',
    sales: 145,
    rating: 4.6,
    publishedDate: '2024-01-05',
    image: '/placeholder-book.jpg',
  },
  {
    id: 'PROD-005',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    narrator: 'Ray Porter',
    duration: '7h 30m',
    price: '$14.99',
    category: 'Coming of Age',
    status: 'Draft',
    sales: 123,
    rating: 4.5,
    publishedDate: '2024-01-03',
    image: '/placeholder-book.jpg',
  },
  {
    id: 'PROD-006',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    narrator: 'Rob Inglis',
    duration: '11h 8m',
    price: '$16.99',
    category: 'Fantasy',
    status: 'Active',
    sales: 198,
    rating: 4.9,
    publishedDate: '2024-01-01',
    image: '/placeholder-book.jpg',
  },
];

const categories = [
  'All',
  'Classic Literature',
  'Dystopian Fiction',
  'Romance',
  'Coming of Age',
  'Fantasy',
];

export default function ProductsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your audiobook catalog and inventory.
            </p>
          </div>
          <Button>
            Add New Product
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-none p-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search products by title, author, or narrator..."
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={category === 'All' ? 'default' : 'outline'}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="shadow-none p-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">📚</TableHead>
                  <TableHead>Title & Author</TableHead>
                  <TableHead>Narrator</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        📚
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {product.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          by {product.author}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {product.narrator}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {product.duration}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">
                      {product.price}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {product.sales}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      ⭐ {product.rating}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === 'Active' ? 'default' : 'outline'
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
