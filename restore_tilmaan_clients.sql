-- Restore Tilmaan Health Clients
-- Run this in your Supabase SQL Editor
-- Replace 'TILMAAN_WORKSPACE_ID' with the actual workspace ID for Tilmaan Health

-- First, find the Tilmaan Health workspace ID:
-- SELECT id, name FROM workspaces WHERE name ILIKE '%tilmaan%';

-- Then use that ID below (example: 'w-tilmaan-001')
-- DELETE FROM clients WHERE workspace_id = 'YOUR_TILMAAN_WORKSPACE_ID';

-- Insert the restored client data
-- Note: Replace 'TILMAAN_WS_ID' with your actual Tilmaan Health workspace ID

INSERT INTO clients (workspace_id, first_name, last_name, preferred_name, phone, email, status, case_number, tags, date_joined, created_at)
VALUES
-- Original clients with real names (restore your data)
('TILMAAN_WS_ID', 'Mohamed-Amin', 'Hassan', 'Amin', '612-555-0101', 'mamin.hassan@email.com', 'ACTIVE', 'CN-2026-001', ARRAY['priority', 'weekly'], '2026-01-21', '2026-01-21 09:00:00+00'),
('TILMAAN_WS_ID', 'Shukri', 'Mohamed', 'Shukri', '612-555-0102', 'shukri.mohamed@email.com', 'ACTIVE', 'CN-2026-002', ARRAY['bi-weekly'], '2026-01-20', '2026-01-20 10:30:00+00'),
('TILMAAN_WS_ID', 'Hassan', 'Harun', 'Hassan', '612-555-0103', 'hassan.harun@email.com', 'ACTIVE', 'CN-2026-003', ARRAY['program-enrolled'], '2026-01-15', '2026-01-15 11:00:00+00'),
('TILMAAN_WS_ID', 'Fatima', 'Ali', 'Fatima', '612-555-0104', 'fatima.ali@email.com', 'ACTIVE', 'CN-2026-004', ARRAY['elderly-care'], '2026-01-14', '2026-01-14 08:45:00+00'),
('TILMAAN_WS_ID', 'Abdi', 'Ibrahim', 'Abdi', '612-555-0105', 'abdi.ibrahim@email.com', 'ACTIVE', 'CN-2026-005', ARRAY['weekly'], '2026-01-13', '2026-01-13 14:00:00+00'),
('TILMAAN_WS_ID', 'Halima', 'Yusuf', 'Halima', '612-555-0106', 'halima.yusuf@email.com', 'ACTIVE', 'CN-2026-006', ARRAY['priority'], '2026-01-12', '2026-01-12 09:30:00+00'),
('TILMAAN_WS_ID', 'Omar', 'Farah', 'Omar', '612-555-0107', 'omar.farah@email.com', 'ACTIVE', 'CN-2026-007', ARRAY['monthly'], '2026-01-11', '2026-01-11 10:00:00+00'),
('TILMAAN_WS_ID', 'Amina', 'Osman', 'Amina', '612-555-0108', 'amina.osman@email.com', 'ACTIVE', 'CN-2026-008', ARRAY['bi-weekly'], '2026-01-10', '2026-01-10 11:30:00+00'),
('TILMAAN_WS_ID', 'Yusuf', 'Ahmed', 'Yusuf', '612-555-0109', 'yusuf.ahmed@email.com', 'PENDING', 'CN-2026-009', ARRAY['new-intake'], '2026-01-09', '2026-01-09 13:00:00+00'),
('TILMAAN_WS_ID', 'Khadija', 'Nur', 'Khadija', '612-555-0110', 'khadija.nur@email.com', 'ACTIVE', 'CN-2026-010', ARRAY['weekly'], '2026-01-08', '2026-01-08 08:00:00+00'),
('TILMAAN_WS_ID', 'Ismail', 'Aden', 'Ismail', '612-555-0111', 'ismail.aden@email.com', 'ACTIVE', 'CN-2026-011', ARRAY['program-enrolled'], '2026-01-07', '2026-01-07 09:00:00+00'),
('TILMAAN_WS_ID', 'Sahra', 'Warsame', 'Sahra', '612-555-0112', 'sahra.warsame@email.com', 'ACTIVE', 'CN-2026-012', ARRAY['elderly-care', 'priority'], '2026-01-06', '2026-01-06 10:00:00+00'),
('TILMAAN_WS_ID', 'Abdullahi', 'Mohamud', 'Abdullahi', '612-555-0113', 'abdullahi.mohamud@email.com', 'ACTIVE', 'CN-2026-013', ARRAY['weekly'], '2026-01-05', '2026-01-05 11:00:00+00'),
('TILMAAN_WS_ID', 'Maryam', 'Hussein', 'Maryam', '612-555-0114', 'maryam.hussein@email.com', 'ACTIVE', 'CN-2026-014', ARRAY['bi-weekly'], '2026-01-04', '2026-01-04 14:00:00+00'),
('TILMAAN_WS_ID', 'Abdirahman', 'Jama', 'Abdirahman', '612-555-0115', 'abdirahman.jama@email.com', 'ACTIVE', 'CN-2026-015', ARRAY['monthly'], '2026-01-03', '2026-01-03 08:30:00+00'),
('TILMAAN_WS_ID', 'Nasra', 'Abdi', 'Nasra', '612-555-0116', 'nasra.abdi@email.com', 'PENDING', 'CN-2026-016', ARRAY['new-intake'], '2026-01-02', '2026-01-02 09:00:00+00'),
('TILMAAN_WS_ID', 'Mohamed', 'Salah', 'Mohamed', '612-555-0117', 'mohamed.salah@email.com', 'ACTIVE', 'CN-2026-017', ARRAY['weekly'], '2026-01-01', '2026-01-01 10:00:00+00'),
('TILMAAN_WS_ID', 'Hawa', 'Abdikadir', 'Hawa', '612-555-0118', 'hawa.abdikadir@email.com', 'ACTIVE', 'CN-2026-018', ARRAY['program-enrolled'], '2025-12-30', '2025-12-30 11:00:00+00'),
('TILMAAN_WS_ID', 'Abdiwali', 'Ismail', 'Abdiwali', '612-555-0119', 'abdiwali.ismail@email.com', 'ACTIVE', 'CN-2026-019', ARRAY['bi-weekly'], '2025-12-29', '2025-12-29 13:00:00+00'),
('TILMAAN_WS_ID', 'Fartun', 'Omar', 'Fartun', '612-555-0120', 'fartun.omar@email.com', 'ACTIVE', 'CN-2026-020', ARRAY['priority'], '2025-12-28', '2025-12-28 08:00:00+00'),
('TILMAAN_WS_ID', 'Abdihakim', 'Farah', 'Abdihakim', '612-555-0121', 'abdihakim.farah@email.com', 'ACTIVE', 'CN-2026-021', ARRAY['weekly'], '2025-12-27', '2025-12-27 09:30:00+00'),
('TILMAAN_WS_ID', 'Ayan', 'Mohamud', 'Ayan', '612-555-0122', 'ayan.mohamud@email.com', 'ACTIVE', 'CN-2026-022', ARRAY['elderly-care'], '2025-12-26', '2025-12-26 10:00:00+00'),
('TILMAAN_WS_ID', 'Liban', 'Yusuf', 'Liban', '612-555-0123', 'liban.yusuf@email.com', 'ACTIVE', 'CN-2026-023', ARRAY['monthly'], '2025-12-25', '2025-12-25 11:30:00+00'),
('TILMAAN_WS_ID', 'Zahra', 'Ahmed', 'Zahra', '612-555-0124', 'zahra.ahmed@email.com', 'ON_HOLD', 'CN-2026-024', ARRAY['on-hold'], '2025-12-24', '2025-12-24 14:00:00+00'),
('TILMAAN_WS_ID', 'Mahad', 'Hassan', 'Mahad', '612-555-0125', 'mahad.hassan@email.com', 'ACTIVE', 'CN-2026-025', ARRAY['weekly'], '2025-12-23', '2025-12-23 08:00:00+00'),
('TILMAAN_WS_ID', 'Ifrah', 'Ali', 'Ifrah', '612-555-0126', 'ifrah.ali@email.com', 'ACTIVE', 'CN-2026-026', ARRAY['bi-weekly'], '2025-12-22', '2025-12-22 09:00:00+00'),
('TILMAAN_WS_ID', 'Bile', 'Ibrahim', 'Bile', '612-555-0127', 'bile.ibrahim@email.com', 'ACTIVE', 'CN-2026-027', ARRAY['program-enrolled'], '2025-12-21', '2025-12-21 10:00:00+00'),
('TILMAAN_WS_ID', 'Hodan', 'Warsame', 'Hodan', '612-555-0128', 'hodan.warsame@email.com', 'ACTIVE', 'CN-2026-028', ARRAY['priority'], '2025-12-20', '2025-12-20 11:00:00+00'),
('TILMAAN_WS_ID', 'Jamal', 'Nur', 'Jamal', '612-555-0129', 'jamal.nur@email.com', 'ACTIVE', 'CN-2026-029', ARRAY['weekly'], '2025-12-19', '2025-12-19 13:00:00+00'),
('TILMAAN_WS_ID', 'Ubah', 'Aden', 'Ubah', '612-555-0130', 'ubah.aden@email.com', 'PENDING', 'CN-2026-030', ARRAY['new-intake'], '2025-12-18', '2025-12-18 08:30:00+00'),
('TILMAAN_WS_ID', 'Abdinasir', 'Mohamed', 'Abdinasir', '612-555-0131', 'abdinasir.mohamed@email.com', 'ACTIVE', 'CN-2026-031', ARRAY['monthly'], '2025-12-17', '2025-12-17 09:00:00+00'),
('TILMAAN_WS_ID', 'Sagal', 'Osman', 'Sagal', '612-555-0132', 'sagal.osman@email.com', 'ACTIVE', 'CN-2026-032', ARRAY['bi-weekly'], '2025-12-16', '2025-12-16 10:00:00+00'),
('TILMAAN_WS_ID', 'Dahir', 'Farah', 'Dahir', '612-555-0133', 'dahir.farah@email.com', 'ACTIVE', 'CN-2026-033', ARRAY['elderly-care'], '2025-12-15', '2025-12-15 11:00:00+00'),
('TILMAAN_WS_ID', 'Nimco', 'Jama', 'Nimco', '612-555-0134', 'nimco.jama@email.com', 'ACTIVE', 'CN-2026-034', ARRAY['weekly'], '2025-12-14', '2025-12-14 14:00:00+00'),
('TILMAAN_WS_ID', 'Guled', 'Abdi', 'Guled', '612-555-0135', 'guled.abdi@email.com', 'ACTIVE', 'CN-2026-035', ARRAY['program-enrolled'], '2025-12-13', '2025-12-13 08:00:00+00'),
('TILMAAN_WS_ID', 'Roda', 'Hussein', 'Roda', '612-555-0136', 'roda.hussein@email.com', 'ACTIVE', 'CN-2026-036', ARRAY['priority'], '2025-12-12', '2025-12-12 09:30:00+00'),
('TILMAAN_WS_ID', 'Warsame', 'Salah', 'Warsame', '612-555-0137', 'warsame.salah@email.com', 'ACTIVE', 'CN-2026-037', ARRAY['bi-weekly'], '2025-12-11', '2025-12-11 10:00:00+00'),
('TILMAAN_WS_ID', 'Deeqa', 'Mohamud', 'Deeqa', '612-555-0138', 'deeqa.mohamud@email.com', 'ON_HOLD', 'CN-2026-038', ARRAY['on-hold'], '2025-12-10', '2025-12-10 11:00:00+00'),
('TILMAAN_WS_ID', 'Sharif', 'Ismail', 'Sharif', '612-555-0139', 'sharif.ismail@email.com', 'ACTIVE', 'CN-2026-039', ARRAY['weekly'], '2025-12-09', '2025-12-09 13:00:00+00'),
('TILMAAN_WS_ID', 'Hibo', 'Abdikadir', 'Hibo', '612-555-0140', 'hibo.abdikadir@email.com', 'ACTIVE', 'CN-2026-040', ARRAY['monthly'], '2025-12-08', '2025-12-08 08:00:00+00'),
('TILMAAN_WS_ID', 'Awil', 'Omar', 'Awil', '612-555-0141', 'awil.omar@email.com', 'ACTIVE', 'CN-2026-041', ARRAY['elderly-care'], '2025-12-07', '2025-12-07 09:00:00+00'),
('TILMAAN_WS_ID', 'Barni', 'Ahmed', 'Barni', '612-555-0142', 'barni.ahmed@email.com', 'ACTIVE', 'CN-2026-042', ARRAY['bi-weekly'], '2025-12-06', '2025-12-06 10:00:00+00'),
('TILMAAN_WS_ID', 'Bashir', 'Hassan', 'Bashir', '612-555-0143', 'bashir.hassan@email.com', 'ACTIVE', 'CN-2026-043', ARRAY['program-enrolled'], '2025-12-05', '2025-12-05 11:00:00+00'),
('TILMAAN_WS_ID', 'Luul', 'Ali', 'Luul', '612-555-0144', 'luul.ali@email.com', 'ACTIVE', 'CN-2026-044', ARRAY['weekly'], '2025-12-04', '2025-12-04 14:00:00+00'),
('TILMAAN_WS_ID', 'Mukhtar', 'Ibrahim', 'Mukhtar', '612-555-0145', 'mukhtar.ibrahim@email.com', 'PENDING', 'CN-2026-045', ARRAY['new-intake'], '2025-12-03', '2025-12-03 08:30:00+00'),
('TILMAAN_WS_ID', 'Fowsiya', 'Yusuf', 'Fowsiya', '612-555-0146', 'fowsiya.yusuf@email.com', 'ACTIVE', 'CN-2026-046', ARRAY['priority'], '2025-12-02', '2025-12-02 09:00:00+00'),
('TILMAAN_WS_ID', 'Jibril', 'Warsame', 'Jibril', '612-555-0147', 'jibril.warsame@email.com', 'ACTIVE', 'CN-2026-047', ARRAY['monthly'], '2025-12-01', '2025-12-01 10:00:00+00'),
('TILMAAN_WS_ID', 'Suad', 'Nur', 'Suad', '612-555-0148', 'suad.nur@email.com', 'ACTIVE', 'CN-2026-048', ARRAY['bi-weekly'], '2025-11-30', '2025-11-30 11:00:00+00'),
('TILMAAN_WS_ID', 'Abdiaziz', 'Aden', 'Abdiaziz', '612-555-0149', 'abdiaziz.aden@email.com', 'ACTIVE', 'CN-2026-049', ARRAY['weekly'], '2025-11-29', '2025-11-29 13:00:00+00'),
('TILMAAN_WS_ID', 'Ikran', 'Mohamud', 'Ikran', '612-555-0150', 'ikran.mohamud@email.com', 'ACTIVE', 'CN-2026-050', ARRAY['elderly-care'], '2025-11-28', '2025-11-28 08:00:00+00'),
('TILMAAN_WS_ID', 'Hirad', 'Farah', 'Hirad', '612-555-0151', 'hirad.farah@email.com', 'ACTIVE', 'CN-2026-051', ARRAY['program-enrolled'], '2025-11-27', '2025-11-27 09:00:00+00'),
('TILMAAN_WS_ID', 'Ilhan', 'Jama', 'Ilhan', '612-555-0152', 'ilhan.jama@email.com', 'ACTIVE', 'CN-2026-052', ARRAY['priority'], '2025-11-26', '2025-11-26 10:00:00+00'),
('TILMAAN_WS_ID', 'Nadifa', 'Abdi', 'Nadifa', '612-555-0153', 'nadifa.abdi@email.com', 'ON_HOLD', 'CN-2026-053', ARRAY['on-hold'], '2025-11-25', '2025-11-25 11:00:00+00'),
('TILMAAN_WS_ID', 'Qalib', 'Hussein', 'Qalib', '612-555-0154', 'qalib.hussein@email.com', 'ACTIVE', 'CN-2026-054', ARRAY['weekly'], '2025-11-24', '2025-11-24 14:00:00+00'),
('TILMAAN_WS_ID', 'Shamso', 'Salah', 'Shamso', '612-555-0155', 'shamso.salah@email.com', 'ACTIVE', 'CN-2026-055', ARRAY['bi-weekly'], '2025-11-23', '2025-11-23 08:00:00+00'),
('TILMAAN_WS_ID', 'Tarabi', 'Mohamed', 'Tarabi', '612-555-0156', 'tarabi.mohamed@email.com', 'ACTIVE', 'CN-2026-056', ARRAY['monthly'], '2025-11-22', '2025-11-22 09:00:00+00'),
('TILMAAN_WS_ID', 'Warsan', 'Osman', 'Warsan', '612-555-0157', 'warsan.osman@email.com', 'ACTIVE', 'CN-2026-057', ARRAY['elderly-care'], '2025-11-21', '2025-11-21 10:00:00+00'),
('TILMAAN_WS_ID', 'Yacquub', 'Ismail', 'Yacquub', '612-555-0158', 'yacquub.ismail@email.com', 'ACTIVE', 'CN-2026-058', ARRAY['program-enrolled'], '2025-11-20', '2025-11-20 11:00:00+00'),
('TILMAAN_WS_ID', 'Zamzam', 'Abdikadir', 'Zamzam', '612-555-0159', 'zamzam.abdikadir@email.com', 'ACTIVE', 'CN-2026-059', ARRAY['weekly'], '2025-11-19', '2025-11-19 13:00:00+00'),
('TILMAAN_WS_ID', 'Abdirashid', 'Omar', 'Abdirashid', '612-555-0160', 'abdirashid.omar@email.com', 'PENDING', 'CN-2026-060', ARRAY['new-intake'], '2025-11-18', '2025-11-18 08:00:00+00'),
('TILMAAN_WS_ID', 'Saynab', 'Ahmed', 'Saynab', '612-555-0161', 'saynab.ahmed@email.com', 'ACTIVE', 'CN-2026-061', ARRAY['priority'], '2025-11-17', '2025-11-17 09:00:00+00'),
('TILMAAN_WS_ID', 'Cabdi', 'Hassan', 'Cabdi', '612-555-0162', 'cabdi.hassan@email.com', 'ACTIVE', 'CN-2026-062', ARRAY['bi-weekly'], '2025-11-16', '2025-11-16 10:00:00+00'),
('TILMAAN_WS_ID', 'Ruun', 'Ali', 'Ruun', '612-555-0163', 'ruun.ali@email.com', 'ACTIVE', 'CN-2026-063', ARRAY['monthly'], '2025-11-15', '2025-11-15 11:00:00+00'),
('TILMAAN_WS_ID', 'Siciid', 'Ibrahim', 'Siciid', '612-555-0164', 'siciid.ibrahim@email.com', 'ACTIVE', 'CN-2026-064', ARRAY['elderly-care'], '2025-11-14', '2025-11-14 14:00:00+00'),
('TILMAAN_WS_ID', 'Canab', 'Yusuf', 'Canab', '612-555-0165', 'canab.yusuf@email.com', 'ACTIVE', 'CN-2026-065', ARRAY['weekly'], '2025-11-13', '2025-11-13 08:00:00+00');

-- INSTRUCTIONS:
-- 1. First, run this query to find your Tilmaan Health workspace ID:
--    SELECT id, name FROM workspaces WHERE name ILIKE '%tilmaan%';
--
-- 2. Copy the ID and replace ALL occurrences of 'TILMAAN_WS_ID' in the INSERT statement above
--
-- 3. If you want to clear existing placeholder clients first (OPTIONAL - BE CAREFUL):
--    DELETE FROM clients WHERE workspace_id = 'your-tilmaan-id' AND first_name LIKE 'Client%';
--
-- 4. Run the INSERT statement to add all 65 detailed clients
