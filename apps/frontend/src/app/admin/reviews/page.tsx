'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Dummy data for reviews
const reviews = [
  {
    id: 'REV-001',
    customer: 'John Doe',
    product: 'The Great Gatsby',
    rating: 5,
    title: 'Absolutely fantastic narration!',
    content:
      "Jake Gyllenhaal's narration brings this classic to life in a way I never expected. His voice perfectly captures the essence of the Jazz Age.",
    date: '2024-01-15',
    helpful: 23,
    verified: true,
    status: 'Published',
  },
  {
    id: 'REV-002',
    customer: 'Jane Smith',
    product: '1984',
    rating: 4,
    title: 'Great book, good narration',
    content:
      'The story is timeless and the narration is solid. Simon Prebble does a good job, though I wish there was more variation in character voices.',
    date: '2024-01-14',
    helpful: 15,
    verified: true,
    status: 'Published',
  },
  {
    id: 'REV-003',
    customer: 'Bob Johnson',
    product: 'To Kill a Mockingbird',
    rating: 5,
    title: 'Perfect for a long drive',
    content:
      "Sissy Spacek's southern accent is perfect for this story. Made my 12-hour drive feel like 2 hours. Highly recommend!",
    date: '2024-01-13',
    helpful: 31,
    verified: true,
    status: 'Published',
  },
  {
    id: 'REV-004',
    customer: 'Alice Brown',
    product: 'Pride and Prejudice',
    rating: 3,
    title: 'Decent but not exceptional',
    content:
      "The narration is okay, but I've heard better versions. Rosamund Pike does a good job, but the pacing feels a bit slow at times.",
    date: '2024-01-12',
    helpful: 8,
    verified: true,
    status: 'Published',
  },
  {
    id: 'REV-005',
    customer: 'Charlie Wilson',
    product: 'The Catcher in the Rye',
    rating: 2,
    title: "Narrator doesn't fit the character",
    content:
      "Ray Porter's voice is too mature for Holden Caulfield. The character is supposed to be a teenager, but the narrator sounds like a middle-aged man.",
    date: '2024-01-11',
    helpful: 12,
    verified: true,
    status: 'Published',
  },
  {
    id: 'REV-006',
    customer: 'Diana Prince',
    product: 'The Hobbit',
    rating: 5,
    title: 'Masterful storytelling',
    content:
      'Rob Inglis is a master narrator. His character voices are distinct and engaging. This is how audiobooks should be done!',
    date: '2024-01-10',
    helpful: 45,
    verified: true,
    status: 'Published',
  },
  {
    id: 'REV-007',
    customer: 'Eva Martinez',
    product: '1984',
    rating: 1,
    title: 'Terrible audio quality',
    content:
      'The audio quality is poor and there are background noises throughout. Very disappointing for the price.',
    date: '2024-01-09',
    helpful: 3,
    verified: false,
    status: 'Pending',
  },
  {
    id: 'REV-008',
    customer: 'Frank Thompson',
    product: 'The Great Gatsby',
    rating: 4,
    title: 'Good but could be better',
    content:
      "Overall a good listen, but the narrator's pacing is inconsistent. Some chapters are rushed while others drag on.",
    date: '2024-01-08',
    helpful: 7,
    verified: true,
    status: 'Published',
  },
];

const reviewStats = [
  { label: 'Total Reviews', value: reviews.length, color: 'text-blue-600' },
  { label: 'Average Rating', value: '4.1', color: 'text-green-600' },
  {
    label: '5-Star Reviews',
    value: reviews.filter(r => r.rating === 5).length,
    color: 'text-yellow-600',
  },
  {
    label: 'Pending Review',
    value: reviews.filter(r => r.status === 'Pending').length,
    color: 'text-orange-600',
  },
];

export default function ReviewsPage() {
  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getStatusColor = (status: string) => {
    return status === 'Published'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reviews
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monitor customer feedback and manage product reviews.
            </p>
          </div>
          <Button variant="outline">
            <span className="mr-2">📊</span>
            Review Analytics
          </Button>
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reviewStats.map((stat, index) => (
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
                  placeholder="Search reviews by customer, product, or content..."
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  All Reviews
                </Button>
                <Button variant="outline" size="sm">
                  5 Stars
                </Button>
                <Button variant="outline" size="sm">
                  Pending
                </Button>
                <Button variant="outline" size="sm">
                  Verified
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map(review => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {review.customer
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {review.customer}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {review.product}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(review.status)}>
                      {review.status}
                    </Badge>
                    {review.verified && (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`text-lg font-semibold ${getRatingColor(review.rating)}`}
                    >
                      {getRatingStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {review.rating}/5
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {review.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{review.date}</span>
                      <span>{review.helpful} helpful</span>
                    </div>
                    <div className="flex space-x-2">
                      {review.status === 'Pending' && (
                        <>
                          <Button size="sm" variant="outline">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        Reply
                      </Button>
                      <Button size="sm" variant="outline">
                        Flag
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = (count / reviews.length) * 100;
                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="w-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {rating}⭐
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-sm text-gray-600 dark:text-gray-400">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Reviewed Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  reviews.reduce(
                    (acc, review) => {
                      acc[review.product] = (acc[review.product] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number>
                  )
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([product, count]) => (
                    <div
                      key={product}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {count} reviews
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {(
                            reviews
                              .filter(r => r.product === product)
                              .reduce((sum, r) => sum + r.rating, 0) / count
                          ).toFixed(1)}
                          ⭐
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
