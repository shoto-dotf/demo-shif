-- 神戸池澤クリニック シフト管理システム サンプルデータ

-- シフトパターンマスタデータ
INSERT INTO shift_patterns (name, start_time, end_time, break_minutes) VALUES
('早番', '08:30', '17:30', 60),
('遅番', '10:00', '19:00', 60),
('通常', '09:00', '18:00', 60),
('土曜午前', '09:00', '13:00', 0),
('土曜終日', '09:00', '17:00', 60);

-- スタッフマスタデータ
INSERT INTO staff (name, role, employment_type, qualifications, weekly_working_hours, desired_holidays_per_month, email, phone) VALUES
-- 医師
('池澤 太郎', '医師', '常勤', ARRAY['内視鏡専門医', '消化器病専門医'], 40, 8, 'ikezawa@clinic.jp', '078-123-0001'),
('山田 一郎', '医師', '常勤', ARRAY['内科認定医', '神経内科専門医'], 40, 8, 'yamada@clinic.jp', '078-123-0002'),
('佐藤 花子', '医師', '非常勤', ARRAY['美容皮膚科専門医'], 24, 12, 'sato@clinic.jp', '078-123-0003'),

-- 看護師
('鈴木 美咲', '看護師', '常勤', ARRAY['内視鏡技師', '看護師長'], 40, 8, 'suzuki@clinic.jp', '078-123-0004'),
('田中 優子', '看護師', '常勤', ARRAY['内視鏡技師'], 40, 8, 'tanaka@clinic.jp', '078-123-0005'),
('高橋 さくら', '看護師', '常勤', ARRAY['美容施術可能'], 40, 8, 'takahashi@clinic.jp', '078-123-0006'),
('伊藤 真理', '看護師', '非常勤', ARRAY[], 32, 10, 'ito@clinic.jp', '078-123-0007'),
('渡辺 あい', '看護師', '非常勤', ARRAY['美容施術可能'], 24, 12, 'watanabe@clinic.jp', '078-123-0008'),

-- 医療事務
('中村 恵美', '医療事務', '常勤', ARRAY['医療事務資格', 'レセプト管理'], 40, 8, 'nakamura@clinic.jp', '078-123-0009'),
('小林 由美', '医療事務', '常勤', ARRAY['医療事務資格'], 40, 8, 'kobayashi@clinic.jp', '078-123-0010'),
('加藤 理恵', '医療事務', '非常勤', ARRAY[], 24, 12, 'kato@clinic.jp', '078-123-0011'),

-- 放射線技師
('松本 健太', '放射線技師', '常勤', ARRAY['第一種放射線取扱主任者'], 40, 8, 'matsumoto@clinic.jp', '078-123-0012'),

-- 美容スタッフ
('吉田 みなみ', '美容スタッフ', '常勤', ARRAY['美容施術資格', 'エステティシャン'], 40, 8, 'yoshida@clinic.jp', '078-123-0013'),
('木村 ゆり', '美容スタッフ', '非常勤', ARRAY['美容施術資格'], 24, 12, 'kimura@clinic.jp', '078-123-0014');

-- 最低人員要件設定
INSERT INTO minimum_staffing_requirements (day_of_week, time_slot, role, minimum_count) VALUES
-- 平日（月〜金）
(1, '午前', '医師', 2),
(1, '午前', '看護師', 3),
(1, '午前', '医療事務', 2),
(1, '午後', '医師', 2),
(1, '午後', '看護師', 3),
(1, '午後', '医療事務', 2),
(2, '午前', '医師', 2),
(2, '午前', '看護師', 3),
(2, '午前', '医療事務', 2),
(2, '午後', '医師', 2),
(2, '午後', '看護師', 3),
(2, '午後', '医療事務', 2),
(3, '午前', '医師', 2),
(3, '午前', '看護師', 3),
(3, '午前', '医療事務', 2),
(3, '午後', '医師', 2),
(3, '午後', '看護師', 3),
(3, '午後', '医療事務', 2),
(4, '午前', '医師', 2),
(4, '午前', '看護師', 3),
(4, '午前', '医療事務', 2),
(4, '午後', '医師', 2),
(4, '午後', '看護師', 3),
(4, '午後', '医療事務', 2),
(5, '午前', '医師', 2),
(5, '午前', '看護師', 3),
(5, '午前', '医療事務', 2),
(5, '午後', '医師', 2),
(5, '午後', '看護師', 3),
(5, '午後', '医療事務', 2),
-- 土曜日
(6, '午前', '医師', 1),
(6, '午前', '看護師', 2),
(6, '午前', '医療事務', 1),
-- 放射線技師（平日のみ）
(1, '全日', '放射線技師', 1),
(2, '全日', '放射線技師', 1),
(3, '全日', '放射線技師', 1),
(4, '全日', '放射線技師', 1),
(5, '全日', '放射線技師', 1),
-- 美容スタッフ（美容外来がある日）
(2, '午後', '美容スタッフ', 1),
(4, '午後', '美容スタッフ', 1),
(6, '午前', '美容スタッフ', 1);

-- 2025年6月の特殊業務日設定
INSERT INTO special_duty_days (date, duty_type, required_qualifications, required_staff_count) VALUES
-- 内視鏡検査日（火曜・木曜）
('2025-06-03', '内視鏡検査', ARRAY['内視鏡専門医', '内視鏡技師'], 2),
('2025-06-05', '内視鏡検査', ARRAY['内視鏡専門医', '内視鏡技師'], 2),
('2025-06-10', '内視鏡検査', ARRAY['内視鏡専門医', '内視鏡技師'], 2),
('2025-06-12', '内視鏡検査', ARRAY['内視鏡専門医', '内視鏡技師'], 2),
('2025-06-17', '内視鏡検査', ARRAY['内視鏡専門医', '内視鏡技師'], 2),
('2025-06-19', '内視鏡検査', ARRAY['内視鏡専門医', '内視鏡技師'], 2),
('2025-06-24', '内視鏡検査', ARRAY['内視鏡専門医', '内視鏡技師'], 2),
('2025-06-26', '内視鏡検査', ARRAY['内視鏡専門医', '内視鏡技師'], 2),
-- 健康診断日（第1・第3土曜）
('2025-06-07', '健康診断', ARRAY['内科認定医'], 1),
('2025-06-21', '健康診断', ARRAY['内科認定医'], 1);

-- 2025年6月のサンプルシフトデータ（最初の1週間）
INSERT INTO shifts (staff_id, date, shift_pattern_id, start_time, end_time, break_minutes, status, created_by) VALUES
-- 6月2日（月）
((SELECT id FROM staff WHERE name = '池澤 太郎'), '2025-06-02', (SELECT id FROM shift_patterns WHERE name = '早番'), '08:30', '17:30', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '山田 一郎'), '2025-06-02', (SELECT id FROM shift_patterns WHERE name = '遅番'), '10:00', '19:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '鈴木 美咲'), '2025-06-02', (SELECT id FROM shift_patterns WHERE name = '早番'), '08:30', '17:30', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '田中 優子'), '2025-06-02', (SELECT id FROM shift_patterns WHERE name = '通常'), '09:00', '18:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '高橋 さくら'), '2025-06-02', (SELECT id FROM shift_patterns WHERE name = '遅番'), '10:00', '19:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '中村 恵美'), '2025-06-02', (SELECT id FROM shift_patterns WHERE name = '早番'), '08:30', '17:30', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '小林 由美'), '2025-06-02', (SELECT id FROM shift_patterns WHERE name = '遅番'), '10:00', '19:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '松本 健太'), '2025-06-02', (SELECT id FROM shift_patterns WHERE name = '通常'), '09:00', '18:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),

-- 6月3日（火）- 内視鏡検査日
((SELECT id FROM staff WHERE name = '池澤 太郎'), '2025-06-03', (SELECT id FROM shift_patterns WHERE name = '早番'), '08:30', '17:30', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '佐藤 花子'), '2025-06-03', (SELECT id FROM shift_patterns WHERE name = '通常'), '09:00', '18:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '鈴木 美咲'), '2025-06-03', (SELECT id FROM shift_patterns WHERE name = '早番'), '08:30', '17:30', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '田中 優子'), '2025-06-03', (SELECT id FROM shift_patterns WHERE name = '早番'), '08:30', '17:30', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '渡辺 あい'), '2025-06-03', (SELECT id FROM shift_patterns WHERE name = '遅番'), '10:00', '19:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '中村 恵美'), '2025-06-03', (SELECT id FROM shift_patterns WHERE name = '通常'), '09:00', '18:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '加藤 理恵'), '2025-06-03', (SELECT id FROM shift_patterns WHERE name = '通常'), '09:00', '18:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '松本 健太'), '2025-06-03', (SELECT id FROM shift_patterns WHERE name = '通常'), '09:00', '18:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎')),
((SELECT id FROM staff WHERE name = '吉田 みなみ'), '2025-06-03', (SELECT id FROM shift_patterns WHERE name = '遅番'), '10:00', '19:00', 60, '確定', (SELECT id FROM staff WHERE name = '池澤 太郎'));

-- 希望休申請サンプル
INSERT INTO leave_requests (staff_id, date, priority, reason, status) VALUES
((SELECT id FROM staff WHERE name = '田中 優子'), '2025-06-16', '必須', '子供の学校行事のため', '申請中'),
((SELECT id FROM staff WHERE name = '高橋 さくら'), '2025-06-20', '希望', '私用', '申請中'),
((SELECT id FROM staff WHERE name = '伊藤 真理'), '2025-06-25', '希望', '旅行', '申請中'),
((SELECT id FROM staff WHERE name = '中村 恵美'), '2025-06-13', '必須', '通院のため', '承認'),
((SELECT id FROM staff WHERE name = '小林 由美'), '2025-06-27', '希望', '', '申請中');

-- 通知サンプル
INSERT INTO notifications (recipient_id, type, title, message) VALUES
((SELECT id FROM staff WHERE name = '田中 優子'), 'シフト確定', '6月のシフトが確定しました', '6月のシフトが確定しました。マイページからご確認ください。'),
((SELECT id FROM staff WHERE name = '中村 恵美'), '申請承認', '希望休が承認されました', '6月13日の希望休申請が承認されました。'),
((SELECT id FROM staff WHERE name = '鈴木 美咲'), 'リマインダー', '明日は内視鏡検査日です', '明日6月3日は内視鏡検査日です。準備をお願いします。');