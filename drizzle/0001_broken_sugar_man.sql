CREATE TABLE "quotelearner_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"text" text NOT NULL,
	"theme" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quotelearner_quotes" ADD CONSTRAINT "quotelearner_quotes_userId_quotelearner_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."quotelearner_user"("id") ON DELETE no action ON UPDATE no action;