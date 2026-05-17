INSERT INTO User (id, email, name, password_hash, role, employee_code, department, created_at, updated_at)
VALUES ('manager-id', 'manager1@portal.com', 'Sarah Manager', '$2b$10$oQsWowd2O5eai5EZRbul4.Cbj1lkYQvGPkyaIFheR.nwYi.NIqW62', 'MANAGER', 'MGR001', 'Engineering', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO User (id, email, name, password_hash, role, manager_id, department, created_at, updated_at)
VALUES ('employee-id', 'employee1@portal.com', 'John Doe', '$2b$10$oQsWowd2O5eai5EZRbul4.Cbj1lkYQvGPkyaIFheR.nwYi.NIqW62', 'EMPLOYEE', 'manager-id', 'Engineering', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
