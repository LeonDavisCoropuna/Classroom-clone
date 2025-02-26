/*
  Warnings:

  - Added the required column `folder_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `folder_id` VARCHAR(191) NOT NULL;
