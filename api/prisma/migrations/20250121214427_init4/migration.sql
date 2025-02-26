/*
  Warnings:

  - You are about to drop the column `creator_email` on the `announce` table. All the data in the column will be lost.
  - You are about to drop the column `creator_name` on the `announce` table. All the data in the column will be lost.
  - You are about to drop the column `creator_photo` on the `announce` table. All the data in the column will be lost.
  - You are about to alter the column `creator_id` on the `announce` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `creator_email` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `creator_name` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `creator_photo` on the `course` table. All the data in the column will be lost.
  - You are about to alter the column `creator_id` on the `course` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `user_email` on the `course_users` table. All the data in the column will be lost.
  - You are about to drop the column `user_photo` on the `course_users` table. All the data in the column will be lost.
  - You are about to alter the column `id_user` on the `course_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `announce` DROP COLUMN `creator_email`,
    DROP COLUMN `creator_name`,
    DROP COLUMN `creator_photo`,
    MODIFY `creator_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `course` DROP COLUMN `creator_email`,
    DROP COLUMN `creator_name`,
    DROP COLUMN `creator_photo`,
    MODIFY `creator_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `course_users` DROP COLUMN `user_email`,
    DROP COLUMN `user_photo`,
    MODIFY `id_user` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_users` ADD CONSTRAINT `course_users_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_users` ADD CONSTRAINT `course_users_id_course_fkey` FOREIGN KEY (`id_course`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `announce` ADD CONSTRAINT `announce_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `announce` ADD CONSTRAINT `announce_id_course_fkey` FOREIGN KEY (`id_course`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
