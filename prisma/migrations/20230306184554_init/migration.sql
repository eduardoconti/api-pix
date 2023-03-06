-- CreateEnum
CREATE TYPE "chargeStatus" AS ENUM ('ACTIVE', 'PAYED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "webhookType" AS ENUM ('CHARGE_PAYED', 'CHARGE_REFUNDED');

-- CreateEnum
CREATE TYPE "outboxAggregateType" AS ENUM ('WEBHOOK', 'CHARGE');

-- CreateEnum
CREATE TYPE "provider" AS ENUM ('CELCOIN');

-- CreateTable
CREATE TABLE "charge" (
    "id" TEXT NOT NULL,
    "status" "chargeStatus" NOT NULL,
    "emv" TEXT NOT NULL,
    "provider" "provider" NOT NULL,
    "provider_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "qr_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook" (
    "id" TEXT NOT NULL,
    "type" "webhookType" NOT NULL,
    "provider" "provider" NOT NULL,
    "provider_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox" (
    "id" TEXT NOT NULL,
    "aggregate_id" TEXT NOT NULL,
    "aggregate_type" "outboxAggregateType" NOT NULL,
    "event_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "charge_status_idx" ON "charge" USING HASH ("status");

-- CreateIndex
CREATE INDEX "charge_provider_idx" ON "charge" USING HASH ("provider");

-- CreateIndex
CREATE INDEX "charge_provider_id_idx" ON "charge" USING HASH ("provider_id");

-- CreateIndex
CREATE INDEX "webhook_type_idx" ON "webhook" USING HASH ("type");

-- CreateIndex
CREATE INDEX "webhook_provider_idx" ON "webhook" USING HASH ("provider");

-- CreateIndex
CREATE INDEX "webhook_provider_id_idx" ON "webhook" USING HASH ("provider_id");

-- CreateIndex
CREATE INDEX "outbox_published_idx" ON "outbox" USING HASH ("published");
