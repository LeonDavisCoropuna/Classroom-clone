/*
  Warnings:

  - You are about to drop the column `id_task_submission` on the `task_files` table. All the data in the column will be lost.
  - Added the required column `id_task` to the `task_files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `task_files` DROP FOREIGN KEY `task_files_id_task_submission_fkey`;

-- DropIndex
DROP INDEX `task_files_id_task_submission_fkey` ON `task_files`;

-- AlterTable
ALTER TABLE `task_files` DROP COLUMN `id_task_submission`,
    ADD COLUMN `id_task` INTEGER NOT NULL,
    ADD COLUMN `task_submissionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `task_submission_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_task_submission` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `thumbnailLink` VARCHAR(191) NOT NULL,
    `id_file` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `task_files` ADD CONSTRAINT `task_files_id_task_fkey` FOREIGN KEY (`id_task`) REFERENCES `task`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_submission_files` ADD CONSTRAINT `task_submission_files_id_task_submission_fkey` FOREIGN KEY (`id_task_submission`) REFERENCES `task_submission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
