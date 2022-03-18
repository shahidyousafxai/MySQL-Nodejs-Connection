/*
  Warnings:

  - Made the column `id` on table `test2` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `test2` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `test2` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `test2` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `name` VARCHAR(200) NOT NULL,
    MODIFY `city` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Test1` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
