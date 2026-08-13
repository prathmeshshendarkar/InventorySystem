import { Pool } from "pg";

export const communication_db = new Pool({
    connectionString: process.env.DATABASE_URL!
})