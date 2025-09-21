'use client';

import { useUser } from '@clerk/nextjs';

import { UnifiedSidebar, SidebarItem } from '@/components/ui/unified-sidebar';

interface AdminSidebarProps {
  className?: string;
}

const adminMenuItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Reviews', href: '/admin/reviews' },
  { name: 'User Management', href: '/admin/users' },
];

export function AdminSidebar({ className }: AdminSidebarProps) {
  const { user } = useUser();

  const userInfo = (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
        {user?.firstName?.charAt(0) ||
          user?.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {user?.firstName || user?.emailAddresses[0].emailAddress}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
      </div>
    </div>
  );

  return (
    <UnifiedSidebar
      items={adminMenuItems}
      title="Admin Panel"
      footer={userInfo}
      variant="admin"
      className={className}
    />
  );
}
