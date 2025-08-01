/*
  Warnings:

  - You are about to drop the column `exceprt` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `exceprt`,
    ADD COLUMN `excerpt` TEXT NULL;
