import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class DatabaseConnectionManager
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(DatabaseConnectionManager.name)
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null
  private reconnectAttempts = 0
  private reconnecting = false

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.connect()
    this.startHealthCheck()
  }

  async onModuleDestroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy()
      this.logger.log('🔌 Database connection closed')
    }
  }

  private async connect() {
    if (!this.dataSource.isInitialized) {
      try {
        await this.dataSource.initialize()
        const opts = this.dataSource.options as any
        this.logger.log(
          `✅ Connected to DB: ${opts.type ?? 'unknown'}://${opts.host ?? 'local'}/${opts.database ?? ''}`,
        )
        this.reconnectAttempts = 0
      } catch (err) {
        this.logger.error(
          `❌ Database connection failed: ${(err as Error).message}`,
        )
        await this.scheduleReconnect()
      }
    }
  }

  private startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.dataSource.query('SELECT 1')
      } catch (err) {
        this.logger.warn(`⚠️ Lost connection to DB: ${(err as Error).message}`)
        if (!this.reconnecting) {
          await this.scheduleReconnect()
        }
      }
    }, 10_000)
  }

  private async scheduleReconnect() {
    this.reconnecting = true
    this.reconnectAttempts++
    const delay = Math.min(30_000, this.reconnectAttempts * 5_000)
    this.logger.log(`🔄 Attempting reconnect in ${delay / 1000}s...`)
    setTimeout(async () => {
      this.reconnecting = false
      await this.connect()
    }, delay)
  }
}
