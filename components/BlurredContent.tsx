// components/BlurredContentWithSignInPrompt.tsx
"use client";

import React from "react";
import ShortCard from "@/components/shorts/short-card";
import { SignInButton } from "@clerk/nextjs";
import { Shorts } from "@prisma/client";
import { ShortWithUser } from "@/lib/types/types";

// type Props = {
//   shorts: Array<any >;
// };

type Props = {
  shorts: ShortWithUser[];
};

export default function BlurredContent({ shorts }: Props) {
  return (
   <div className="relative h-screen overflow-y-scroll snap-y snap-mandatory  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
  {/* Blurred shorts container */}
  <div className="flex flex-col items-center blur-sm pointer-events-none select-none">
    {shorts.map((short) => (
      <div key={short.id} className="snap-start flex justify-center items-center h-screen">
        <ShortCard short={short} />
      </div>
    ))}
  </div>

  {/* Overlay text without black bg */}
 <div className="fixed inset-0 flex items-center justify-center pointer-events-auto z-50">
  <div className="bg-opacity-70 text-black px-6 py-4 rounded text-center max-w-md mx-4">
    <p className="text-lg font-semibold">
      Please{" "}
      <SignInButton >
        <span className="cursor-pointer text-blue-600 underline">sign in</span>  
      </SignInButton>{" "}
      to see full content
    </p>
  </div>
</div>

</div>

  );
}
