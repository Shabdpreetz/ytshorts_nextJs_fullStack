'use client'
import { Prisma } from '@prisma/client'
import React from 'react'
import { Card, CardFooter } from '../ui/card'
import { Video } from '@imagekit/next'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'


const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string;

type ShortCardProps = {
    short: Prisma.ShortsGetPayload<{
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true
                }
            }
        }
    }>
}

const ShortCard: React.FC<ShortCardProps> = ({ short }) => {
    console.log(`short is -> ${urlEndpoint}/YtShorts/${short.url}`);
    return (
        <Card className='p-0 w-[360px] h-[640px] flex flex-col item-center justify-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative'>
            <Video
                urlEndpoint={urlEndpoint}
                src={short.url}
                controls
                width={360}
                height={640}
                autoPlay={true}
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* channel informantion card footer */}
            <CardFooter className='absolute bottom-20 -left-2 text-white '>
                <div>
                    <div className='flex item-center space-x-2' >
                        <Avatar>
                            <AvatarImage src={short.user.imageUrl  ?? undefined} alt="channel Owner image" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <h3 className='font-semibold'>{short.title}</h3>
                            <span className='text-sm'>{short.user.name}</span>
                        </div>
                    </div>

                    <div className='text-sm mt-2 '>
                        <p>{short.description}</p>
                    </div>
                </div>

            </CardFooter>
        </Card>
    )
}

export default ShortCard