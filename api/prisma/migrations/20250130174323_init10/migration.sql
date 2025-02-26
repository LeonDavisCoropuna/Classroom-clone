/*
  Warnings:

  - Made the column `folder_id` on table `course` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `folder_id` to the `course_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` MODIFY `folder_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `course_users` ADD COLUMN `folder_id` VARCHAR(191) NOT NULL;
