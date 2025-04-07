/*
  Warnings:

  - You are about to drop the column `content` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,title]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "content",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Board_userId_title_key" ON "Board"("userId", "title");
