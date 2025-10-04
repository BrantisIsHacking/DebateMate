-- DebateMate.Tech Database Schema for Snowflake

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Debates table
CREATE TABLE IF NOT EXISTS debates (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  topic VARCHAR(500) NOT NULL,
  position VARCHAR(10) NOT NULL, -- 'for' or 'against'
  opponent_type VARCHAR(50) NOT NULL, -- 'politician', 'scientist', 'activist', etc.
  status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  turn_count INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  completed_at TIMESTAMP_NTZ,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Debate messages table (stores the conversation)
CREATE TABLE IF NOT EXISTS debate_messages (
  id VARCHAR(36) PRIMARY KEY,
  debate_id VARCHAR(36) NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  fallacies_detected TEXT, -- JSON string of detected fallacies
  timestamp TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (debate_id) REFERENCES debates(id)
);

-- Logical fallacies detected
CREATE TABLE IF NOT EXISTS logical_fallacies (
  id VARCHAR(36) PRIMARY KEY,
  debate_id VARCHAR(36) NOT NULL,
  message_id VARCHAR(36) NOT NULL,
  fallacy_type VARCHAR(100) NOT NULL, -- 'ad_hominem', 'straw_man', 'false_dichotomy', etc.
  description TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  detected_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (debate_id) REFERENCES debates(id),
  FOREIGN KEY (message_id) REFERENCES debate_messages(id)
);

-- User analytics and progress tracking
CREATE TABLE IF NOT EXISTS user_analytics (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  metric_name VARCHAR(100) NOT NULL, -- 'total_debates', 'fallacies_count', 'avg_argument_strength', etc.
  metric_value FLOAT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Argument quality scores
CREATE TABLE IF NOT EXISTS argument_scores (
  id VARCHAR(36) PRIMARY KEY,
  debate_id VARCHAR(36) NOT NULL,
  message_id VARCHAR(36) NOT NULL,
  clarity_score FLOAT, -- 0-100
  evidence_score FLOAT, -- 0-100
  logic_score FLOAT, -- 0-100
  persuasiveness_score FLOAT, -- 0-100
  overall_score FLOAT, -- 0-100
  feedback TEXT,
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (debate_id) REFERENCES debates(id),
  FOREIGN KEY (message_id) REFERENCES debate_messages(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_debates_user_id ON debates(user_id);
CREATE INDEX IF NOT EXISTS idx_debate_messages_debate_id ON debate_messages(debate_id);
CREATE INDEX IF NOT EXISTS idx_logical_fallacies_debate_id ON logical_fallacies(debate_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_argument_scores_debate_id ON argument_scores(debate_id);
