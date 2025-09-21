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

  return (
    <UnifiedSidebar
      items={adminMenuItems}
      variant="admin"
      className={className}
    />
  );
}
