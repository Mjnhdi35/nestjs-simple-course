import { DataSource } from 'typeorm'
import { databaseConfig } from './db.config'

const dataSource = new DataSource(databaseConfig())

dataSource
  .initialize()
  .then(() => {
    console.log('[TypeORM CLI] ✅ Database connection established')
  })
  .catch((err) => {
    console.error('[TypeORM CLI] ❌ Database connection failed:', err)
  })

export default dataSource
