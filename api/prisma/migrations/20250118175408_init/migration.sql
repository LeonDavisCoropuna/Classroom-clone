-- CreateTable
CREATE TABLE `course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_name` VARCHAR(191) NOT NULL,
    `creator_name` VARCHAR(191) NOT NULL,
    `creator_email` VARCHAR(191) NOT NULL,
    `creator_photo` VARCHAR(191) NOT NULL,
    `code_class` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_course` INTEGER NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `course_users_id_course_id_user_key`(`id_course`, `id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announce` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creator_name` VARCHAR(191) NOT NULL,
    `creator_email` VARCHAR(191) NOT NULL,
    `creator_photo` VARCHAR(191) NOT NULL,
    `id_course` INTEGER NOT NULL,
    `text` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announce_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_announce` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `thumbnailLink` VARCHAR(191) NOT NULL,
    `id_file` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `announce_files` ADD CONSTRAINT `announce_files_id_announce_fkey` FOREIGN KEY (`id_announce`) REFERENCES `announce`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
