-- Seed Data for Scam Fraud Detector

-- 1. Insert initial scans
INSERT INTO scans (id, message_body, channel, sender, score, verdict, confidence, nlp_score, url_score, sender_score)
VALUES 
    (gen_random_uuid(), 'URGENT: Your Maybank account has been temporarily suspended. Click http://mybnk-secure.xyz to verify.', 'sms', '+60123456789', 97, 'FRAUD', 99, 38, 30, 29),
    (gen_random_uuid(), 'Congratulations! You won RM 50,000 from Touch n Go. Claim now: bit.ly/tng-win', 'whatsapp', '+60187654321', 95, 'FRAUD', 98, 35, 30, 30),
    (gen_random_uuid(), 'Your delivery attempt was unsuccessful. Reschedule at http://poslaju-reschd.com', 'sms', '+60111234567', 74, 'SUSPICIOUS', 85, 12, 30, 32),
    (gen_random_uuid(), 'Hi, are you free for the team lunch this Friday? We are thinking Damansara Uptown.', 'text', 'Colleague', 3, 'SAFE', 99, 1, 0, 2),
    (gen_random_uuid(), 'Dear Taxpayer, LHDN has detected an irregularity. Pay RM 4,200 now: http://lhdn-gov.info', 'email', 'lhdn-notice@gov-my.info', 99, 'FRAUD', 99, 39, 30, 30);

-- 2. Insert corresponding reasons (using IDs from the scans table)
-- Note: In a real migration, you'd use variables, but for a SQL Editor seed, we can just use the last created IDs or just leave this for the user.
-- Here, I'll provide a way to insert reasons for the MOST RECENT scans.

INSERT INTO scan_reasons (scan_id, text, category, points)
SELECT id, 'Authority Impersonation (Maybank)', 'NLP · Intent', 20 FROM scans WHERE message_body LIKE '%Maybank%' LIMIT 1;

INSERT INTO scan_reasons (scan_id, text, category, points)
SELECT id, 'Artificial Scarcity (suspended)', 'NLP · Keywords', 15 FROM scans WHERE message_body LIKE '%suspended%' LIMIT 1;

INSERT INTO scan_reasons (scan_id, text, category, points)
SELECT id, 'Prize Lure (RM 50,000)', 'NLP · Intent', 25 FROM scans WHERE message_body LIKE '%Touch n Go%' LIMIT 1;

INSERT INTO scan_reasons (scan_id, text, category, points)
SELECT id, 'Suspicious URL Structure', 'URL · Domain', 20 FROM scans WHERE message_body LIKE '%bit.ly%' LIMIT 1;

INSERT INTO scan_reasons (scan_id, text, category, points)
SELECT id, 'Legal Threat (LHDN irregularity)', 'NLP · Intent', 30 FROM scans WHERE message_body LIKE '%LHDN%' LIMIT 1;
