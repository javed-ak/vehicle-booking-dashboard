import express from "express"
import { configDotenv } from "dotenv"
import cors from "cors"
import adminRouter from "./routes/admin.js"
import bookingRouter from "./routes/booking.js"
import { connect } from "./db.js"

configDotenv();

const app = express()
app.use(express.json())
app.use(cors({ credentials: true, origin: true }))


app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/booking", bookingRouter);

await connect()

app.get("/", async (req, res) => {
});
app.listen(3000, '0.0.0.0', () => {
    console.log("Server is running on port 3000");
});