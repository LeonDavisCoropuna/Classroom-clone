/*
  Warnings:

  - You are about to drop the column `theme_id` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `theme` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `task_theme_id_fkey`;

-- DropForeignKey
ALTER TABLE `theme` DROP FOREIGN KEY `theme_id_course_fkey`;

-- DropIndex
DROP INDEX `task_theme_id_fkey` ON `task`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `theme_id`,
    ADD COLUMN `topic_id` INTEGER NULL;

-- DropTable
DROP TABLE `theme`;

-- CreateTable
CREATE TABLE `topic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_course` INTEGER NOT NULL,
    `name` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `topic` ADD CONSTRAINT `topic_id_course_fkey` FOREIGN KEY (`id_course`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
