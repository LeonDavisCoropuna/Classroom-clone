/*
  Warnings:

  - Added the required column `user_email` to the `course_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_photo` to the `course_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course_users` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `user_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_photo` VARCHAR(191) NOT NULL;
