/*
  Warnings:

  - You are about to drop the column `private` on the `comment` table. All the data in the column will be lost.
  - Added the required column `is_private` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` DROP COLUMN `private`,
    ADD COLUMN `id_recipient` INTEGER NULL,
    ADD COLUMN `is_private` BOOLEAN NOT NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_id_recipient_fkey` FOREIGN KEY (`id_recipient`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
