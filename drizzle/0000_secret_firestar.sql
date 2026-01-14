CREATE TYPE "public"."paymentMethod" AS ENUM('PIX', 'CREDIT_CARD');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PENDING', 'PAID', 'FAIL');--> statement-breakpoint
CREATE TABLE "tb_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"paymentMethod" "paymentMethod" DEFAULT 'PIX' NOT NULL,
	"status" "status" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
