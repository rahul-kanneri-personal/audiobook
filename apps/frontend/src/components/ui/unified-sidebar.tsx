'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
  collapsible?: boolean;
}

export interface SidebarItem {
  name: string;
  href?: string;
  icon?: string | ReactNode;
  badge?: string | number;
  variant?: 'default' | 'secondary' | 'ghost';
  onClick?: () => void;
  children?: ReactNode;
}

interface UnifiedSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  sections?: SidebarSection[];
  items?: SidebarItem[];
  title?: string;
  footer?: ReactNode;
  variant?: 'default' | 'admin' | 'user';
  className?: string;
}

export function UnifiedSidebar({
  sections,
  items,
  title,
  footer,
  variant = 'default',
  className,
  ...props
}: UnifiedSidebarProps) {
  const pathname = usePathname();

  const renderIcon = (icon: string | ReactNode) => {
    if (typeof icon === 'string') {
      return <span className="text-lg">{icon}</span>;
    }
    return icon;
  };

  const renderItem = (item: SidebarItem, index: number) => {
    const isActive = item.href && pathname === item.href;

    if (item.children) {
      return <div key={index}>{item.children}</div>;
    }

    const buttonContent = (
      <>
        {item.icon && (
          <span className="mr-2 h-4 w-4">{renderIcon(item.icon)}</span>
        )}
        {item.name}
        {item.badge && (
          <span className="ml-auto px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
            {item.badge}
          </span>
        )}
      </>
    );

    if (item.href) {
      return (
        <Link key={index} href={item.href}>
          <Button
            variant={item.variant || (isActive ? 'secondary' : 'ghost')}
            className={cn(
              'w-full justify-start font-normal',
              isActive &&
                'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            )}
          >
            {buttonContent}
          </Button>
        </Link>
      );
    }

    return (
      <Button
        key={index}
        variant={item.variant || 'ghost'}
        className="w-full justify-start font-normal"
        onClick={item.onClick}
      >
        {buttonContent}
      </Button>
    );
  };

  const renderSection = (section: SidebarSection, sectionIndex: number) => (
    <div key={sectionIndex} className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
        {section.title}
      </h2>
      <div className="space-y-1">
        {section.items.map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );

  const getSidebarClasses = () => {
    switch (variant) {
      case 'admin':
        return 'w-64 bg-white dark:bg-gray-800 border-r border-t border-gray-200 dark:border-gray-700 min-h-screen flex flex-col';
      case 'user':
        return 'pb-12';
      default:
        return 'w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen flex flex-col';
    }
  };

  return (
    <div className={cn(getSidebarClasses(), className)} {...props}>
      <div className={variant === 'admin' ? 'p-6 flex-1' : 'space-y-4 py-4'}>
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {title}
          </h2>
        )}

        {sections ? (
          <>{sections.map((section, index) => renderSection(section, index))}</>
        ) : (
          <div className="space-y-1">
            {items?.map((item, index) => renderItem(item, index))}
          </div>
        )}
      </div>

      {footer && (
        <div
          className={
            variant === 'admin'
              ? 'p-6 border-t border-gray-200 dark:border-gray-700'
              : 'px-3 py-2'
          }
        >
          {footer}
        </div>
      )}
    </div>
  );
}
