-- CreateTable
CREATE TABLE `beneficiary_applications` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `full_address` TEXT NOT NULL,
    `email_address` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `aadhar_number` VARCHAR(191) NOT NULL,
    `aadhar_image_upload` VARCHAR(191) NOT NULL,
    `type_of_assistance` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `support_document` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `beneficiary_applications_email_address_key`(`email_address`),
    UNIQUE INDEX `beneficiary_applications_aadhar_number_key`(`aadhar_number`),
    INDEX `beneficiary_applications_email_address_idx`(`email_address`),
    INDEX `beneficiary_applications_phone_number_idx`(`phone_number`),
    INDEX `beneficiary_applications_aadhar_number_idx`(`aadhar_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
