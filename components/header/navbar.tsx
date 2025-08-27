// import React from 'react'
// import { Input } from '../ui/input'
// import { Button } from '../ui/button'
// import { Plus } from 'lucide-react'
// import { ModeToggle } from '../mode-toggle'
// import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
// import Link from 'next/link'

// const Navbar = () => {
//     return (
//         <div className='flex items-center h-14 border-b justify-between '>
//             {/* Log0 text  */}
//             <div>
//                 <h1 className='font bold text-xl'>YT<span className='text-red-500'>Shorts</span></h1>
//             </div>
//             {/* Search input Field */}
//             <div className='w-1/2'>
//                 <Input
//                     type='text'
//                     placeholder='Search'
//                 />
//             </div>
//             {/* Account Management  */}
//             <div className='flex items-center space-x-2'>
//                 <Link href="/upload"><Button><Plus/>Create</Button></Link>
//                  <header className="flex justify-end items-center p-4 gap-4 h-16">
//             <SignedOut>
//               <SignInButton>
//                 <Button>Sign In</Button>
//               </SignInButton>
//               <SignUpButton>
//                 <Button >
//                   Sign Up
//                 </Button>
//               </SignUpButton>
//             </SignedOut>
//             <SignedIn>
//               <UserButton />
//             </SignedIn>
//           </header>
//                 <ModeToggle/>
//             </div>
//         </div>
//     )
// }

// export default Navbar



'use client'

import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/nextjs'
import Link from 'next/link'

const Navbar = () => {
  return (
    // Make navbar fixed at top and give it high z-index so it stays above everything
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background border-b">
      {/* Container for navbar content */}
      <div className="flex items-center h-14 justify-between px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div>
          <h1 className="font-bold text-xl">
            YT<span className="text-red-500">Shorts</span>
          </h1>
        </div>

        {/* Search input field */}
        <div className="w-1/2">
          <Input type="text" placeholder="Search" />
        </div>

        {/* Account management */}
        <div className="flex items-center space-x-2">
          <Link href="/upload">
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Create
            </Button>
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton>
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="outline">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Light/Dark toggle */}
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}

export default Navbar
