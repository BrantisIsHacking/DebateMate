// Database helper functions for common operations
import { getSnowflakeClient } from "./snowflake.js"
import { v4 as uuidv4 } from "uuid"
import { randomUUID } from "crypto"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  email: string
  name: string
  password_hash: string
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
export async function createUser(email: string, name: string, password: string): Promise<User> {
  const db = getSnowflakeClient()
  const id = uuidv4()
  
  // Hash the password before storing
  const saltRounds = 12
  const passwordHash = await bcrypt.hash(password, saltRounds)

  await db.execute(
    `INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)`, 
    [id, email, name, passwordHash]
  )

  const result = await db.query<User>(`SELECT * FROM users WHERE id = ?`, [id])

  return result.data[0]
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getSnowflakeClient()
  const result = await db.query<User>(`SELECT * FROM users WHERE email = ?`, [email])

  if (!result.data[0]) {
    return null
  }

  const rawUser = result.data[0]
  
  // Convert Snowflake uppercase column names to lowercase
  return {
    id: rawUser.ID || rawUser.id,
    email: rawUser.EMAIL || rawUser.email,
    name: rawUser.NAME || rawUser.name,
    password_hash: rawUser.PASSWORD_HASH || rawUser.password_hash,
    created_at: rawUser.CREATED_AT || rawUser.created_at,
    updated_at: rawUser.UPDATED_AT || rawUser.updated_at,
  }
}

// Password verification function
export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash)
}

// Debate operations
export async function createDebate(
  userId: string,
  topic: string,
  position: "for" | "against",
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
    position: position as "for" | "against",
    opponent_type: opponentType,
    status: "active" as const,
    turn_count: 0,
    created_at: new Date().toISOString(),
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

  // Convert Snowflake uppercase column names to lowercase
  return result.data.map((debate: any) => ({
    id: debate.ID || debate.id,
    user_id: debate.USER_ID || debate.user_id,
    topic: debate.TOPIC || debate.topic,
    position: (debate.POSITION || debate.position) as "for" | "against",
    opponent_type: debate.OPPONENT_TYPE || debate.opponent_type,
    status: (debate.STATUS || debate.status) as "active" | "completed" | "abandoned",
    turn_count: debate.TURN_COUNT || debate.turn_count || 0,
    created_at: debate.CREATED_AT || debate.created_at,
    completed_at: debate.COMPLETED_AT || debate.completed_at,
  }))
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
      dm.id,
      dm.role,
      dm.content,
      dm.fallacies_detected,
      dm.timestamp,
      asc.clarity_score,
      asc.evidence_score,
      asc.logic_score,
      asc.persuasiveness_score,
      asc.overall_score
    FROM debate_messages dm
    LEFT JOIN argument_scores asc ON dm.id = asc.message_id
    WHERE dm.debate_id = ? 
    ORDER BY dm.timestamp ASC`,
    [debateId],
  )

  return result.data.map((msg: any) => ({
    id: msg.ID || msg.id,
    debate_id: debateId,
    role: msg.ROLE || msg.role,
    content: msg.CONTENT || msg.content,
    timestamp: msg.TIMESTAMP || msg.timestamp,
    fallacies: (msg.FALLACIES_DETECTED || msg.fallacies_detected) ? 
      JSON.parse(msg.FALLACIES_DETECTED || msg.fallacies_detected) : undefined,
    scores:
      (msg.ROLE || msg.role) === "user"
        ? {
            clarity: msg.CLARITY_SCORE || msg.clarity_score || 0,
            evidence: msg.EVIDENCE_SCORE || msg.evidence_score || 0,
            logic: msg.LOGIC_SCORE || msg.logic_score || 0,
            persuasiveness: msg.PERSUASIVENESS_SCORE || msg.persuasiveness_score || 0,
            overall: msg.OVERALL_SCORE || msg.overall_score || 0,
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
     AND d.created_at >= DATEADD(day, -?, CURRENT_TIMESTAMP())`,
    [userId, days],
  )

  // Get average scores
  const scoresResult = await db.query(
    `SELECT 
      AVG(asc.clarity_score) as avg_clarity,
      AVG(asc.evidence_score) as avg_evidence,
      AVG(asc.logic_score) as avg_logic,
      AVG(asc.persuasiveness_score) as avg_persuasiveness,
      AVG(asc.overall_score) as avg_overall
     FROM argument_scores asc
     JOIN debate_messages dm ON asc.message_id = dm.id
     JOIN debates d ON dm.debate_id = d.id
     WHERE d.user_id = ? 
     AND dm.role = 'user'
     AND d.created_at >= DATEADD(day, -?, CURRENT_TIMESTAMP())`,
    [userId, days],
  )

  return {
    totalDebates: debatesResult.data[0]?.TOTAL || debatesResult.data[0]?.total || 0,
    totalFallacies: fallaciesResult.data[0]?.TOTAL || fallaciesResult.data[0]?.total || 0,
    averageScores: {
      avg_clarity: scoresResult.data[0]?.AVG_CLARITY || scoresResult.data[0]?.avg_clarity || 0,
      avg_evidence: scoresResult.data[0]?.AVG_EVIDENCE || scoresResult.data[0]?.avg_evidence || 0,
      avg_logic: scoresResult.data[0]?.AVG_LOGIC || scoresResult.data[0]?.avg_logic || 0,
      avg_persuasiveness: scoresResult.data[0]?.AVG_PERSUASIVENESS || scoresResult.data[0]?.avg_persuasiveness || 0,
      avg_overall: scoresResult.data[0]?.AVG_OVERALL || scoresResult.data[0]?.avg_overall || 0,
    },
  }
}
