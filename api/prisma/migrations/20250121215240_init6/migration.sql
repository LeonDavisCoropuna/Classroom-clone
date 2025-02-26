/*
  Warnings:

  - A unique constraint covering the columns `[sub]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `family_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `given_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `family_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `given_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `sub` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_sub_key` ON `user`(`sub`);
