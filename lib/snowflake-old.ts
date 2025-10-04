// Snowflake database client using REST API

interface SnowflakeConfig {
  account: string
  username: string
  password: string
  warehouse: string
  database: string
  schema: string
}

interface SnowflakeQueryResult {
  data: any[]
  rowCount: number
}

class SnowflakeClient {
  private config: SnowflakeConfig
  private token: string | null = null
  private tokenExpiry = 0

  constructor() {
    this.config = {
      account: process.env.SNOWFLAKE_ACCOUNT || "",
      username: process.env.SNOWFLAKE_USERNAME || "",
      password: process.env.SNOWFLAKE_PASSWORD || "",
      warehouse: process.env.SNOWFLAKE_WAREHOUSE || "",
      database: process.env.SNOWFLAKE_DATABASE || "",
      schema: process.env.SNOWFLAKE_SCHEMA || "PUBLIC",
    }
  }

  private async authenticate(): Promise<string> {
    // Check if we have a valid token
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token
    }

    const authUrl = `https://${this.config.account}.snowflakecomputing.com/session/v1/login-request`

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          ACCOUNT_NAME: this.config.account,
          LOGIN_NAME: this.config.username,
          PASSWORD: this.config.password,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Snowflake authentication failed: ${response.statusText}`)
    }

    const data = await response.json()
    this.token = data.data.token
    // Token expires in 4 hours, we'll refresh after 3.5 hours
    this.tokenExpiry = Date.now() + 3.5 * 60 * 60 * 1000

    return this.token!
  }

  async query<T = any>(sql: string, bindings?: any[]): Promise<SnowflakeQueryResult> {
    const token = await this.authenticate()

    const queryUrl = `https://${this.config.account}.snowflakecomputing.com/api/v2/statements`

    const response = await fetch(queryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        statement: sql,
        timeout: 60,
        database: this.config.database,
        schema: this.config.schema,
        warehouse: this.config.warehouse,
        bindings: bindings || [],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Snowflake query failed: ${error}`)
    }

    const result = await response.json()

    // Parse the result data
    const data = result.data || []

    return {
      data: data as T[],
      rowCount: result.rowCount || 0,
    }
  }

  async execute(sql: string, bindings?: any[]): Promise<void> {
    await this.query(sql, bindings)
  }
}

// Singleton instance
let snowflakeClient: SnowflakeClient | null = null

export function getSnowflakeClient(): SnowflakeClient {
  if (!snowflakeClient) {
    snowflakeClient = new SnowflakeClient()
  }
  return snowflakeClient
}

export type { SnowflakeQueryResult }
