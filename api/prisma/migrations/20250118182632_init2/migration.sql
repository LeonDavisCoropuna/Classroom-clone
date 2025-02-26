/*
  Warnings:

  - Added the required column `creator_id` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `creator_id` VARCHAR(191) NOT NULL;
