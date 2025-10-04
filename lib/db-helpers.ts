// Database helper functions for common operations
import { getSnowflakeClient } from "./snowflake"
import { v4 as uuidv4 } from "uuid"
import { randomUUID } from "crypto"

export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface Debate {
  id: string
  user_id: string
  topic: string
  position: "for" | "against"
  opponent_type: string
  status: "active" | "completed" | "abandoned"
  turn_count: number
  created_at: string
  completed_at?: string
}

export interface DebateMessage {
  id: string
  debate_id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  fallacies?: any
  scores?: {
    clarity: number
    evidence: number
    logic: number
    persuasiveness: number
    overall: number
  }
}

export interface LogicalFallacy {
  id: string
  debate_id: string
  message_id: string
  fallacy_type: string
  description: string
  severity: "low" | "medium" | "high"
  detected_at: string
}

export interface ArgumentScore {
  id: string
  debate_id: string
  message_id: string
  clarity_score: number
  evidence_score: number
  logic_score: number
  persuasiveness_score: number
  overall_score: number
  feedback: string
  created_at: string
}

// User operations
export async function createUser(email: string, name: string): Promise<User> {
  const db = getSnowflakeClient()
  const id = uuidv4()

  await db.execute(`INSERT INTO users (id, email, name) VALUES (?, ?, ?)`, [id, email, name])

  const result = await db.query<User>(`SELECT * FROM users WHERE id = ?`, [id])

  return result.data[0]
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getSnowflakeClient()
  const result = await db.query<User>(`SELECT * FROM users WHERE email = ?`, [email])

  return result.data[0] || null
}

// Debate operations
export async function createDebate(
  userId: string,
  topic: string,
  position: string,
  opponentType: string,
): Promise<Debate> {
  const db = getSnowflakeClient()
  const debateId = randomUUID()

  await db.execute(
    `INSERT INTO debates (id, user_id, topic, position, opponent_type, status, turn_count, created_at)
     VALUES (?, ?, ?, ?, ?, 'active', 0, CURRENT_TIMESTAMP())`,
    [debateId, userId, topic, position, opponentType],
  )

  return {
    id: debateId,
    user_id: userId,
    topic,
    position,
    opponent_type: opponentType,
    status: "active",
    turn_count: 0,
  }
}

export async function getUserDebates(userId: string): Promise<Debate[]> {
  const db = getSnowflakeClient()
  const result = await db.query(
    `SELECT id, topic, position, opponent_type, status, turn_count, created_at, completed_at
     FROM debates 
     WHERE user_id = ? 
     ORDER BY created_at DESC`,
    [userId],
  )

  return result.data
}

// Message operations
export async function addDebateMessage(
  debateId: string,
  role: "user" | "assistant",
  content: string,
): Promise<DebateMessage> {
  const db = getSnowflakeClient()
  const id = uuidv4()

  await db.execute(`INSERT INTO debate_messages (id, debate_id, role, content) VALUES (?, ?, ?, ?)`, [
    id,
    debateId,
    role,
    content,
  ])

  const result = await db.query<DebateMessage>(`SELECT * FROM debate_messages WHERE id = ?`, [id])

  return result.data[0]
}

export async function getDebateMessages(debateId: string): Promise<DebateMessage[]> {
  const db = getSnowflakeClient()
  const result = await db.query(
    `SELECT 
      id,
      role,
      content,
      fallacies_detected,
      clarity_score,
      evidence_score,
      logic_score,
      persuasiveness_score,
      overall_score,
      created_at
    FROM debate_messages 
    WHERE debate_id = ? 
    ORDER BY created_at ASC`,
    [debateId],
  )

  return result.data.map((msg: any) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.created_at,
    fallacies: msg.fallacies_detected ? JSON.parse(msg.fallacies_detected) : undefined,
    scores:
      msg.role === "user"
        ? {
            clarity: msg.clarity_score,
            evidence: msg.evidence_score,
            logic: msg.logic_score,
            persuasiveness: msg.persuasiveness_score,
            overall: msg.overall_score,
          }
        : undefined,
  }))
}

// Fallacy operations
export async function recordLogicalFallacy(
  debateId: string,
  messageId: string,
  fallacyType: string,
  description: string,
  severity: "low" | "medium" | "high",
): Promise<LogicalFallacy> {
  const db = getSnowflakeClient()
  const id = uuidv4()

  await db.execute(
    `INSERT INTO logical_fallacies (id, debate_id, message_id, fallacy_type, description, severity) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, debateId, messageId, fallacyType, description, severity],
  )

  const result = await db.query<LogicalFallacy>(`SELECT * FROM logical_fallacies WHERE id = ?`, [id])

  return result.data[0]
}

export async function getDebateFallacies(debateId: string): Promise<LogicalFallacy[]> {
  const db = getSnowflakeClient()
  const result = await db.query<LogicalFallacy>(
    `SELECT * FROM logical_fallacies WHERE debate_id = ? ORDER BY detected_at DESC`,
    [debateId],
  )

  return result.data
}

// Analytics operations
export async function getUserAnalytics(userId: string, days = 30) {
  const db = getSnowflakeClient()

  // Get total debates
  const debatesResult = await db.query(
    `SELECT COUNT(*) as total FROM debates WHERE user_id = ? AND created_at >= DATEADD(day, -?, CURRENT_TIMESTAMP())`,
    [userId, days],
  )

  // Get total fallacies detected
  const fallaciesResult = await db.query(
    `SELECT COUNT(*) as total 
     FROM debate_messages dm
     JOIN debates d ON dm.debate_id = d.id
     WHERE d.user_id = ? 
     AND dm.role = 'user'
     AND dm.fallacies_detected IS NOT NULL
     AND dm.fallacies_detected != '[]'
     AND dm.created_at >= DATEADD(day, -?, CURRENT_TIMESTAMP())`,
    [userId, days],
  )

  // Get average scores
  const scoresResult = await db.query(
    `SELECT 
      AVG(clarity_score) as avg_clarity,
      AVG(evidence_score) as avg_evidence,
      AVG(logic_score) as avg_logic,
      AVG(persuasiveness_score) as avg_persuasiveness,
      AVG(overall_score) as avg_overall
     FROM debate_messages dm
     JOIN debates d ON dm.debate_id = d.id
     WHERE d.user_id = ? 
     AND dm.role = 'user'
     AND dm.created_at >= DATEADD(day, -?, CURRENT_TIMESTAMP())`,
    [userId, days],
  )

  return {
    totalDebates: debatesResult.data[0]?.total || 0,
    totalFallacies: fallaciesResult.data[0]?.total || 0,
    averageScores: {
      avg_clarity: scoresResult.data[0]?.avg_clarity || 0,
      avg_evidence: scoresResult.data[0]?.avg_evidence || 0,
      avg_logic: scoresResult.data[0]?.avg_logic || 0,
      avg_persuasiveness: scoresResult.data[0]?.avg_persuasiveness || 0,
      avg_overall: scoresResult.data[0]?.avg_overall || 0,
    },
  }
}
