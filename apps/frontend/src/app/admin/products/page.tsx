'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { CreateCategoryDialog } from '@/components/admin/create-category-dialog';
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
import { useCategoriesStore, useAudiobooksStore } from '@/stores';

// Helper function to format duration from seconds to human readable
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export default function ProductsPage() {
  const router = useRouter();

  // Zustand stores
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fetchActiveCategories,
  } = useCategoriesStore();

  const {
    audiobooks,
    isLoading: audiobooksLoading,
    error: audiobooksError,
    filters: { searchTerm, selectedCategory },
    setSearchTerm,
    setSelectedCategory,
    fetchAudiobooks,
  } = useAudiobooksStore();

  // Fetch data on component mount
  useEffect(() => {
    // Fetch categories
    fetchActiveCategories();

    // Fetch audiobooks
    fetchAudiobooks();
  }, [fetchActiveCategories, fetchAudiobooks]);

  // Create display categories including "All" option
  const displayCategories = ['All', ...(categories || []).map(cat => cat.name)];

  // Filter audiobooks based on selected category and search term
  const filteredAudiobooks = (audiobooks || []).filter(audiobook => {
    const matchesCategory =
      selectedCategory === 'All' ||
      audiobook.categories?.some(cat => cat.name === selectedCategory);

    const matchesSearch =
      !searchTerm ||
      audiobook.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audiobook.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audiobook.narrator?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

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
          <Button onClick={() => router.push('/admin/audiobooks/create')}>
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
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categoriesLoading ? (
                  <div className="text-sm text-gray-500">
                    Loading categories...
                  </div>
                ) : categoriesError ? (
                  <div className="text-sm text-red-500">{categoriesError}</div>
                ) : (
                  displayCategories.map(category => (
                    <Button
                      key={category}
                      variant={
                        category === selectedCategory ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </Button>
                  ))
                )}
                <CreateCategoryDialog />
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
                {audiobooksLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Loading audiobooks...
                    </TableCell>
                  </TableRow>
                ) : audiobooksError ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-red-500"
                    >
                      {audiobooksError}
                    </TableCell>
                  </TableRow>
                ) : filteredAudiobooks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-500"
                    >
                      No audiobooks found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAudiobooks.map(audiobook => (
                    <TableRow key={audiobook.id}>
                      <TableCell>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          📚
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {audiobook.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            by {audiobook.author}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {audiobook.narrator}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {audiobook.categories.map(category => (
                            <Badge key={category.id} variant="secondary">
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {formatDuration(audiobook.duration)}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-white">
                        ${audiobook.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {/* Sales data not available in current schema - could be added later */}
                        -
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {/* Rating data not available in current schema - could be added later */}
                        -
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            audiobook.status === 'published'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {audiobook.status.charAt(0).toUpperCase() +
                            audiobook.status.slice(1)}
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
