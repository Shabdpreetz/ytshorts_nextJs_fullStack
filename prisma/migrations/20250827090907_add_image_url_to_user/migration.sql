-- DropIndex
DROP INDEX "public"."Shorts_url_key";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "imageUrl" TEXT;
