ALTER TABLE `appointments` MODIFY COLUMN `type` varchar(255);--> statement-breakpoint
ALTER TABLE `appointments` ADD `appointmentTime` varchar(10) NOT NULL;
