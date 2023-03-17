/*
  Warnings:

  - Added the required column `user_id` to the `charge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "charge" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "charge" ADD CONSTRAINT "charge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
