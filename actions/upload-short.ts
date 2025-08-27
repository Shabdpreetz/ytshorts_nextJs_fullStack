"use server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {z} from "zod"

const uploadShortSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(5),
    video:  z.string(),
})

type UploadShortState = {
    errors:{
        title?: string[],
        description?: string[],
        video?: string[],
        formError?: string[],
    }
}


 export const uploadShortsAction = async (prevState: UploadShortState,formData: FormData) : Promise<UploadShortState> => {
  
    console.log("title", formData.get("title"));
    console.log("description", formData.get("description"));
    
    console.log("video", formData.get("video"));
    
  
    const result = uploadShortSchema.safeParse({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        video: formData.get("video")as string,
    });

    if(!result.success){
        
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    // clerk authentication 

    const {userId} = await auth();
     console.log("user id -> ", userId);

    if(!userId){
        return{
            errors: {formError: ["You must be logged in to upload a short"]}
        }
    }

    console.log("working..")


    const user = await prisma.user.findUnique({
        where: {clerkUserId: userId}
        
    });
    

    try {
        if(!user?.id){
            return{
                errors: {formError: ["User not found"]}
            }
        }

        await prisma.shorts.create({
            data: {
                title: result.data.title,
                description: result.data.description,
                url: result.data.video,
                userId: user.id,
            }
        })

    } catch (error) {
        if(error instanceof Error){
            return {
                errors: {formError: [error.message]}
            }
        } else {
            return {
                errors: {formError: ["Some internal server error please try again"]}
            }
        }
    }

    revalidatePath('/');
    redirect('/');
}