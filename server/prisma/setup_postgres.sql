-- =============================================
-- Run this ONCE in Supabase SQL Editor
-- =============================================

-- Create Enums
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'MANAGER', 'ADMIN');
CREATE TYPE "GoalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'RETURNED', 'LOCKED');
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'SUBMITTED');
CREATE TYPE "UOMType" AS ENUM ('NUMBER', 'PERCENTAGE', 'CURRENCY');
CREATE TYPE "CycleType" AS ENUM ('ANNUAL', 'QUARTERLY');
CREATE TYPE "CheckInStatus" AS ENUM ('NOT_STARTED', 'ON_TRACK', 'COMPLETED');

-- Create Tables
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "employee_code" TEXT,
    "department" TEXT,
    "manager_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_employee_code_key" ON "User"("employee_code");

CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "RefreshToken_token_hash_key" ON "RefreshToken"("token_hash");

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "details" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GoalCycle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "cycle_type" "CycleType" NOT NULL DEFAULT 'QUARTERLY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GoalCycle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thrust_area" TEXT NOT NULL,
    "weightage" INTEGER NOT NULL,
    "uom_type" "UOMType" NOT NULL DEFAULT 'PERCENTAGE',
    "target_value" DOUBLE PRECISION NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'DRAFT',
    "submission_status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Goal_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Goal_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "GoalCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "SharedGoalLink" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SharedGoalLink_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SharedGoalLink_token_key" ON "SharedGoalLink"("token");

CREATE TABLE "GoalApproval" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "manager_id" TEXT NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "returned_at" TIMESTAMP(3),
    CONSTRAINT "GoalApproval_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GoalApproval_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GoalApproval_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "ApprovalComment" (
    "id" TEXT NOT NULL,
    "approval_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApprovalComment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ApprovalComment_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "GoalApproval"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "QuarterlyUpdate" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "planned_target" DOUBLE PRECISION NOT NULL,
    "actual_achievement" DOUBLE PRECISION NOT NULL,
    "progress_score" DOUBLE PRECISION NOT NULL,
    "status" "CheckInStatus" NOT NULL DEFAULT 'ON_TRACK',
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuarterlyUpdate_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "QuarterlyUpdate_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =============================================
-- Seed Data (default users, password = admin123)
-- =============================================
INSERT INTO "User" ("id","email","name","password_hash","role","employee_code","department","created_at","updated_at") VALUES
('admin-001','admin@portal.com','System Admin','$2b$10$oQsWowd2O5eai5EZRbul4.Cbj1lkYQvGPkyaIFheR.nwYi.NIqW62','ADMIN','ADM001','HR',NOW(),NOW()),
('mgr-001','manager1@portal.com','Sarah Manager','$2b$10$oQsWowd2O5eai5EZRbul4.Cbj1lkYQvGPkyaIFheR.nwYi.NIqW62','MANAGER','MGR001','Engineering',NOW(),NOW()),
('mgr-002','manager2@portal.com','David Manager','$2b$10$oQsWowd2O5eai5EZRbul4.Cbj1lkYQvGPkyaIFheR.nwYi.NIqW62','MANAGER','MGR002','Sales',NOW(),NOW()),
('emp-001','employee1@portal.com','John Doe','$2b$10$oQsWowd2O5eai5EZRbul4.Cbj1lkYQvGPkyaIFheR.nwYi.NIqW62','EMPLOYEE',NULL,'Engineering',NOW(),NOW()),
('emp-002','employee2@portal.com','Alice Smith','$2b$10$oQsWowd2O5eai5EZRbul4.Cbj1lkYQvGPkyaIFheR.nwYi.NIqW62','EMPLOYEE',NULL,'Engineering',NOW(),NOW()),
('emp-003','employee3@portal.com','Bob Wilson','$2b$10$oQsWowd2O5eai5EZRbul4.Cbj1lkYQvGPkyaIFheR.nwYi.NIqW62','EMPLOYEE',NULL,'Sales',NOW(),NOW());

UPDATE "User" SET "manager_id" = 'mgr-001' WHERE "id" IN ('emp-001','emp-002');
UPDATE "User" SET "manager_id" = 'mgr-002' WHERE "id" = 'emp-003';

INSERT INTO "GoalCycle" ("id","name","quarter","start_date","end_date","is_active","cycle_type","created_at") VALUES
('current-cycle','FY 2026 Q1',1,'2026-05-01','2026-07-31',true,'QUARTERLY',NOW());
