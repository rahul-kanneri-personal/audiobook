import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { ManageButton } from './manage-button';
import { VisitStoreButton } from './visit-store-button';

export function Menu() {
  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4 flex items-center h-[45px]">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">Audio Book</MenubarTrigger>
      </MenubarMenu>
      <div className="ml-auto flex items-center gap-2">
        <SignedOut>
          <SignInButton>
            <button className="text-black rounded-full font-medium text-xs sm:text-xs sm:px-3 cursor-pointer">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="text-black rounded-full font-medium text-xs sm:text-xs cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <VisitStoreButton />
          <ManageButton />
          <UserButton />
        </SignedIn>
      </div>
    </Menubar>
  );
}
