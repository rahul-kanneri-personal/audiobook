'use client';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export function VisitStoreButton() {
  const { user, isLoaded } = useUser();
  return (
    <>
      {isLoaded && user && user.publicMetadata?.role === 'admin' && (
        <div className="text-black rounded-full font-medium text-xs sm:text-xs sm:px-3 cursor-pointer">
          <Link href="/">Visit Store</Link>
        </div>
      )}
    </>
  );
}
