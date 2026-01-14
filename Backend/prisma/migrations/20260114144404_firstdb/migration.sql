/*
  Warnings:

  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ALTER COLUMN "username" SET DATA TYPE VARCHAR(30);

-- CreateTable
CREATE TABLE "Spice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(200),
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Spice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpiceCategory" (
    "id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "SpiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "Location" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpiceType" (
    "id" TEXT NOT NULL,
    "type_name" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "imageurl" TEXT NOT NULL,

    CONSTRAINT "SpiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SpiceToSpiceCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SpiceToSpiceCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SpiceToSpiceCategory_B_index" ON "_SpiceToSpiceCategory"("B");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpiceType" ADD CONSTRAINT "SpiceType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Spice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpiceToSpiceCategory" ADD CONSTRAINT "_SpiceToSpiceCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Spice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpiceToSpiceCategory" ADD CONSTRAINT "_SpiceToSpiceCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "SpiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
