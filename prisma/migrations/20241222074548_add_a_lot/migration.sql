/*
  Warnings:

  - You are about to drop the column `sellerId` on the `order` table. All the data in the column will be lost.
  - Added the required column `sellerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `sellerId`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `sellerId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Product_name_idx` ON `Product`(`name`);
