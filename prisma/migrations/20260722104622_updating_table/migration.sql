/*
  Warnings:

  - Added the required column `url` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Website_name_key";

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "url" TEXT NOT NULL;
