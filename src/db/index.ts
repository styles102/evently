import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://evently:evently@localhost:5432/evently'

export const db = drizzle(connectionString, { schema })
