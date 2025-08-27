// import ShortCard from "@/components/shorts/short-card";
// import { Button } from "@/components/ui/button";
// import { prisma } from "@/lib/prisma";
// import { currentUser } from "@clerk/nextjs/server";


// export default async function Home() {

//   const user = await currentUser();

//   if (!user) {
//     return null
//   }

//   // const imageUrl = user.imageUrl; // Get the user's image URL
//   // console.log("User Image URL:", imageUrl);

//   let loggedInUser = await prisma.user.findUnique({
//     where: { clerkUserId: user.id }
//   });

//   const clerkImageUrl = user.imageUrl || "";

//   if (!loggedInUser) {
//     loggedInUser = await prisma.user.create({
//       data: {
//         name: user.username || "No name",
//         email: user.emailAddresses[0]?.emailAddress || "No email",
//         imageUrl: user.imageUrl || "",
//         clerkUserId: user.id,
//       }
//     });
//   } else if (loggedInUser.imageUrl !== clerkImageUrl) {
//     // Update user imageUrl if it changed in Clerk
//     loggedInUser = await prisma.user.update({
//       where: { clerkUserId: user.id },
//       data: { imageUrl: clerkImageUrl },
//     });
//   }


//   const shorts = await prisma.shorts.findMany({
//     where: { userId: loggedInUser?.id },
//     include: {
//       user: {
//         select: {
//           name: true,
//           email: true,
//           imageUrl: true
//         }
//       }
//     },
//     orderBy:{ 
//       createdAt: 'desc'
//      } // Order by creation date, newest first
//   });




//   return (
//     <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
//       {/* shorts Container  */}

//       <div className="flex flex-col items-center">
//         {
//           shorts.map((short) => (
//             <div key={short.id} className="snap-start flex justify-center items-center h-screen" >
//               <ShortCard short={short} />
//             </div>
//           ))
//         }
//       </div>


//     </div>
//   );
// }



import React from "react";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import BlurredContent from "@/components/BlurredContent";
import ShortCard from "@/components/shorts/short-card";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    // fetch shorts for blurred display
    const shorts = await prisma.shorts.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return <BlurredContent shorts={shorts} />;
  }

  // User is signed in: fetch or create user, update image if needed
  let loggedInUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  const clerkImageUrl = user.imageUrl || "";

  if (!loggedInUser) {
    loggedInUser = await prisma.user.create({
      data: {
        name: user.username || "No name",
        email: user.emailAddresses[0]?.emailAddress || "No email",
        imageUrl: clerkImageUrl,
        clerkUserId: user.id,
      },
    });
  } else if (loggedInUser.imageUrl !== clerkImageUrl) {
    loggedInUser = await prisma.user.update({
      where: { clerkUserId: user.id },
      data: { imageUrl: clerkImageUrl },
    });
  }

  const shorts = await prisma.shorts.findMany({
    where: { userId: loggedInUser.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
  <div className="h-screen overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
    <div className="flex flex-col items-center">
      {shorts.map((short) => (
        <div
          key={short.id}
          className="snap-start flex justify-center items-center h-screen"
        >
          <ShortCard short={short} />
        </div>
      ))}
    </div>
  </div>
);

}

