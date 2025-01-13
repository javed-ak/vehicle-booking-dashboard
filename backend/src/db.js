import pg from "pg"
import { configDotenv } from "dotenv";

configDotenv()
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function connect() {
    try {
        await client.connect(() => {
            console.log("Connected to the database");
        });
    } catch (error) {
        console.log("Error connecting to the database: ", error);
    }
}

export { client, connect }