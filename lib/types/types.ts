// types.ts
import { Prisma } from "@prisma/client";

export type ShortWithUser = Prisma.ShortsGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
        imageUrl: true;
      };
    };
  };
}>;
