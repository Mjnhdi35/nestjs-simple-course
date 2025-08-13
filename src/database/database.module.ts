import { Module, Global, Logger, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig } from '../config/db.config'
import { DatabaseConnectionManager } from './database-connection'

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig())],
  providers: [DatabaseConnectionManager],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
