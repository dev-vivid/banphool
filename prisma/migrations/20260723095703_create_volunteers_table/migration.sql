-- CreateTable
CREATE TABLE `volunteers` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `interest_area` VARCHAR(200) NOT NULL,
    `remarks` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `volunteers_email_key`(`email`),
    INDEX `volunteers_email_idx`(`email`),
    INDEX `volunteers_phone_number_idx`(`phone_number`),
    INDEX `volunteers_interest_area_idx`(`interest_area`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
