-- AlterEnum
ALTER TYPE "outboxAggregateType" ADD VALUE 'USER_WEBHOOK_NOTIFICATION';

-- CreateTable
CREATE TABLE "user_webhook_notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "webhookType" NOT NULL,
    "charge_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "attempts" INTEGER NOT NULL,
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_webhook_notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_webhook_notification" ADD CONSTRAINT "user_webhook_notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_webhook_notification" ADD CONSTRAINT "user_webhook_notification_charge_id_fkey" FOREIGN KEY ("charge_id") REFERENCES "charge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
