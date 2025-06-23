-- 神戸池澤クリニック シフト管理システム データベーススキーマ

-- スタッフマスタ
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('医師', '看護師', '医療事務', '放射線技師', '美容スタッフ')),
  employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('常勤', '非常勤')),
  qualifications TEXT[],
  weekly_working_hours INTEGER NOT NULL DEFAULT 40,
  desired_holidays_per_month INTEGER NOT NULL DEFAULT 8,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- シフトパターンマスタ
CREATE TABLE shift_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_minutes INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- シフトマスタ
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shift_pattern_id UUID REFERENCES shift_patterns(id),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_minutes INTEGER NOT NULL DEFAULT 60,
  status VARCHAR(20) NOT NULL CHECK (status IN ('確定', '仮', '申請中', 'キャンセル')),
  created_by UUID REFERENCES staff(id),
  approved_by UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(staff_id, date)
);

-- 希望休申請
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  priority VARCHAR(10) NOT NULL CHECK (priority IN ('必須', '希望')),
  reason TEXT,
  status VARCHAR(20) NOT NULL DEFAULT '申請中' CHECK (status IN ('申請中', '承認', '却下', '取消')),
  approved_by UUID REFERENCES staff(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(staff_id, date)
);

-- シフト交代申請
CREATE TABLE shift_swap_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES staff(id),
  target_staff_id UUID NOT NULL REFERENCES staff(id),
  requester_shift_id UUID NOT NULL REFERENCES shifts(id),
  target_shift_id UUID NOT NULL REFERENCES shifts(id),
  reason TEXT,
  status VARCHAR(20) NOT NULL DEFAULT '申請中' CHECK (status IN ('申請中', '承認待ち', '承認', '却下', '取消')),
  approved_by UUID REFERENCES staff(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 最低人員要件
CREATE TABLE minimum_staffing_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0:日曜, 6:土曜
  time_slot VARCHAR(20) NOT NULL, -- '午前', '午後', '全日'
  role VARCHAR(50) NOT NULL,
  minimum_count INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 特殊業務日設定（内視鏡検査日など）
CREATE TABLE special_duty_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  duty_type VARCHAR(100) NOT NULL, -- '内視鏡検査', '健康診断' など
  required_qualifications TEXT[],
  required_staff_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 通知履歴
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES staff(id),
  type VARCHAR(50) NOT NULL, -- 'シフト確定', '申請承認', '申請却下' など
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 操作ログ
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES staff(id),
  action VARCHAR(100) NOT NULL,
  target_table VARCHAR(50),
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_shifts_date ON shifts(date);
CREATE INDEX idx_shifts_staff_id ON shifts(staff_id);
CREATE INDEX idx_shifts_status ON shifts(status);
CREATE INDEX idx_leave_requests_date ON leave_requests(date);
CREATE INDEX idx_leave_requests_staff_id ON leave_requests(staff_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- 更新日時自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();