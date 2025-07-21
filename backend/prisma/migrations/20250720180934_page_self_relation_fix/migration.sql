/*
  Warnings:

  - You are about to drop the column `drawingData` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `pageNumber` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the `WhiteboardSession` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nextPageId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[prevPageId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "WhiteboardSession" DROP CONSTRAINT "WhiteboardSession_userId_fkey";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "drawingData",
DROP COLUMN "pageNumber",
ADD COLUMN     "content" JSONB NOT NULL,
ADD COLUMN     "nextPageId" TEXT,
ADD COLUMN     "prevPageId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "WhiteboardSession";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "name" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_roomId_key" ON "Session"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_nextPageId_key" ON "Page"("nextPageId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_prevPageId_key" ON "Page"("prevPageId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_nextPageId_fkey" FOREIGN KEY ("nextPageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
