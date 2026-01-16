-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `isReconciled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `reconciledDate` DATETIME(3) NULL;
