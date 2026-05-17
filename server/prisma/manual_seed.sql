INSERT INTO User (id, email, name, password_hash, role, employee_code, department, created_at, updated_at)
VALUES ('admin-id', 'admin@portal.com', 'System Admin', '$2b$10$oQsWowd2O5eai5EZRbul4.Cbj1lkYQvGPkyaIFheR.nwYi.NIqW62', 'ADMIN', 'ADM001', 'HR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO GoalCycle (id, name, quarter, start_date, end_date, is_active, cycle_type, created_at)
VALUES ('current-cycle', 'FY 2026 Q1', 1, 1746057600000, 1753920000000, 1, 'QUARTERLY', CURRENT_TIMESTAMP);
