import { Hono } from "hono";
import { bookingRouter } from "./routes/booking";
import { adminRouter } from "./routes/admin";
import { cors } from "hono/cors";

const app = new Hono();

app.use('/*',cors())
app.route('/api/v1/admin', adminRouter);
app.route('/api/v1/booking', bookingRouter);

export default app