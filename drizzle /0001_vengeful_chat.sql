CREATE TABLE `chat_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`company` varchar(255),
	`objective` text,
	`questions` text,
	`status` enum('initiated','in_progress','completed') NOT NULL DEFAULT 'initiated',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_leads_id` PRIMARY KEY(`id`)
);
