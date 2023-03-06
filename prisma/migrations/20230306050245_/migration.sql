-- CreateEnum
CREATE TYPE "chargeStatus" AS ENUM ('ACTIVE', 'PAYED', 'EXPIRED');

-- CreateTable
CREATE TABLE "charge" (
    "id" TEXT NOT NULL,
    "status" "chargeStatus" NOT NULL,
    "emv" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "qr_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "charge_status_idx" ON "charge" USING HASH ("status");

-- CreateIndex
CREATE INDEX "charge_provider_idx" ON "charge" USING HASH ("provider");

-- CreateIndex
CREATE INDEX "charge_provider_id_idx" ON "charge" USING HASH ("provider_id");
