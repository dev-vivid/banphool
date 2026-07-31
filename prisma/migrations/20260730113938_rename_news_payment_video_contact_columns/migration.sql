-- Rename column on `news` to match updated schema (preserves existing rows)
ALTER TABLE `news` CHANGE COLUMN `first_name` `header` VARCHAR(255) NOT NULL;

-- Rename column on `videos` to match updated schema (preserves existing rows)
ALTER TABLE `videos` CHANGE COLUMN `title` `header` VARCHAR(255) NOT NULL;

-- Rename columns on `contact_us` to match updated schema (preserves existing rows)
ALTER TABLE `contact_us`
    CHANGE COLUMN `agreeTerms` `agree_terms` BOOLEAN NOT NULL DEFAULT false,
    CHANGE COLUMN `emailSent` `email_sent` BOOLEAN NOT NULL DEFAULT false,
    CHANGE COLUMN `emailSentAt` `email_sent_at` DATETIME(3) NULL,
    CHANGE COLUMN `emailStatus` `email_status` VARCHAR(50) NULL,
    CHANGE COLUMN `emailError` `email_error` TEXT NULL;

-- DropIndex (will be recreated below under new names after column rename)
DROP INDEX `payments_createdAt_idx` ON `payments`;
DROP INDEX `payments_gatewayOrderId_idx` ON `payments`;
DROP INDEX `payments_paymentMethod_idx` ON `payments`;
DROP INDEX `payments_paymentStatus_idx` ON `payments`;
DROP INDEX `payments_transactionNo_idx` ON `payments`;
DROP INDEX `payments_transactionNo_key` ON `payments`;

-- Rename columns on `payments` to match updated schema (preserves existing rows)
ALTER TABLE `payments`
    CHANGE COLUMN `transactionNo` `transaction_no` VARCHAR(191) NOT NULL,
    CHANGE COLUMN `donorName` `donor_name` VARCHAR(191) NOT NULL,
    CHANGE COLUMN `donorEmail` `donor_email` VARCHAR(191) NULL,
    CHANGE COLUMN `donorPhone` `donor_phone` VARCHAR(191) NULL,
    CHANGE COLUMN `paymentMethod` `payment_method` VARCHAR(191) NOT NULL,
    CHANGE COLUMN `paymentStatus` `payment_status` VARCHAR(191) NOT NULL,
    CHANGE COLUMN `gatewayOrderId` `gateway_order_id` VARCHAR(191) NULL,
    CHANGE COLUMN `gatewayPaymentId` `gateway_payment_id` VARCHAR(191) NULL,
    CHANGE COLUMN `gatewayResponse` `gateway_response` JSON NULL,
    CHANGE COLUMN `createdAt` `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CHANGE COLUMN `updatedAt` `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex (recreated under new names matching renamed columns)
CREATE UNIQUE INDEX `payments_transaction_no_key` ON `payments`(`transaction_no`);
CREATE INDEX `payments_transaction_no_idx` ON `payments`(`transaction_no`);
CREATE INDEX `payments_payment_status_idx` ON `payments`(`payment_status`);
CREATE INDEX `payments_payment_method_idx` ON `payments`(`payment_method`);
CREATE INDEX `payments_gateway_order_id_idx` ON `payments`(`gateway_order_id`);
CREATE INDEX `payments_created_at_idx` ON `payments`(`created_at`);
