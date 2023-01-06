-- CreateTable
CREATE TABLE `Codes` (
    `url` VARCHAR(191) NOT NULL,
    `editCode` VARCHAR(191) NULL,
    `isEncrypted` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(191) NULL,
    `salt` VARCHAR(191) NULL,
    `expired` DATETIME(3) NULL,

    PRIMARY KEY (`url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
