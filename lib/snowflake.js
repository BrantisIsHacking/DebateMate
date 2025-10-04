// Snowflake database client using official SDK (CommonJS)
const snowflake = require('snowflake-sdk')

class SnowflakeClient {
  constructor() {
    this.config = {
      account: process.env.SNOWFLAKE_ACCOUNT || "",
      username: process.env.SNOWFLAKE_USERNAME || "",
      password: process.env.SNOWFLAKE_PASSWORD || "",
      warehouse: process.env.SNOWFLAKE_WAREHOUSE || "",
      database: process.env.SNOWFLAKE_DATABASE || "",
      schema: process.env.SNOWFLAKE_SCHEMA || "PUBLIC",
    }
    this.connection = null
  }

  async getConnection() {
    if (this.connection) {
      return this.connection
    }

    return new Promise((resolve, reject) => {
      this.connection = snowflake.createConnection({
        account: this.config.account,
        username: this.config.username,
        password: this.config.password,
        warehouse: this.config.warehouse,
        database: this.config.database,
        schema: this.config.schema,
      })

      this.connection.connect((err, conn) => {
        if (err) {
          console.error('Unable to connect to Snowflake:', err.message)
          reject(err)
        } else {
          console.log('Successfully connected to Snowflake')
          resolve(conn)
        }
      })
    })
  }

  async query(sql, bindings = []) {
    const connection = await this.getConnection()

    return new Promise((resolve, reject) => {
      connection.execute({
        sqlText: sql,
        binds: bindings,
        complete: (err, stmt, rows) => {
          if (err) {
            reject(new Error(`Snowflake query failed: ${err.message}`))
          } else {
            resolve({
              data: rows || [],
              rowCount: rows ? rows.length : 0,
            })
          }
        }
      })
    })
  }

  async execute(sql, bindings = []) {
    await this.query(sql, bindings)
  }

  async close() {
    if (this.connection) {
      return new Promise((resolve) => {
        this.connection.destroy((err) => {
          if (err) {
            console.error('Error closing connection:', err.message)
          }
          this.connection = null
          resolve()
        })
      })
    }
  }
}

// Singleton instance
let snowflakeClient = null

function getSnowflakeClient() {
  if (!snowflakeClient) {
    snowflakeClient = new SnowflakeClient()
  }
  return snowflakeClient
}

module.exports = { getSnowflakeClient }