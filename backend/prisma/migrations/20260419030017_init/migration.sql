/*
  Warnings:

  - Added the required column `country` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
