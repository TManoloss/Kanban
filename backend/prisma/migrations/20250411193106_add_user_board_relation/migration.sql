/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Board_userId_title_key";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "updatedAt",
ALTER COLUMN "order" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "updatedAt",
ALTER COLUMN "category" SET DEFAULT 'Geral';
