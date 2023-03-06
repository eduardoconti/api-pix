-- CreateEnum
CREATE TYPE "webhookType" AS ENUM ('CHARGE_PAYED');

-- CreateTable
CREATE TABLE "webhook" (
    "id" TEXT NOT NULL,
    "type" "webhookType" NOT NULL,
    "provider" TEXT NOT NULL,
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
    "aggregate_type" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "webhook_type_idx" ON "webhook" USING HASH ("type");

-- CreateIndex
CREATE INDEX "webhook_provider_idx" ON "webhook" USING HASH ("provider");

-- CreateIndex
CREATE INDEX "webhook_provider_id_idx" ON "webhook" USING HASH ("provider_id");

-- CreateIndex
CREATE INDEX "outbox_published_idx" ON "outbox" USING HASH ("published");
