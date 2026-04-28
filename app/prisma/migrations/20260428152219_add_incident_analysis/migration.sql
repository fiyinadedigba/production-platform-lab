-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "analysis" TEXT,
ADD COLUMN     "analyzedAt" TIMESTAMP(3),
ADD COLUMN     "recommendation" TEXT;
