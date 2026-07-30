-- CreateTable
CREATE TABLE `contact_us` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `address` TEXT NOT NULL,
    `remarks` TEXT NOT NULL,
    `agreeTerms` BOOLEAN NOT NULL DEFAULT false,
    `emailSent` BOOLEAN NOT NULL DEFAULT false,
    `emailSentAt` DATETIME(3) NULL,
    `emailStatus` VARCHAR(50) NULL,
    `emailError` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `contact_us_email_idx`(`email`),
    INDEX `contact_us_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
