-- AlterTable
ALTER TABLE `task` ADD COLUMN `theme_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `theme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_course` INTEGER NOT NULL,
    `name` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `theme` ADD CONSTRAINT `theme_id_course_fkey` FOREIGN KEY (`id_course`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_theme_id_fkey` FOREIGN KEY (`theme_id`) REFERENCES `theme`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
