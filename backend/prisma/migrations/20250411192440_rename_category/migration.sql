/*
  Warnings:

  - You are about to drop the column `caregory` on the `Task` table. All the data in the column will be lost.
  - Added the required column `category` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "caregory",
ADD COLUMN     "category" TEXT NOT NULL;
