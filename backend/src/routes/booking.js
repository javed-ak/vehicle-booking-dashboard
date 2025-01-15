import { Router } from "express";
import { client } from "../db.js";
import { v4 as uuidv4 } from 'uuid';
import { bookingRequestInput } from '@javed-ak/booking-inputs';
import * as XLSX from "xlsx";

const timeSlots = [
    "12:00 am to 01:00 am",
    "01:00 am to 02:00 am",
    "02:00 am to 03:00 am",
    "03:00 am to 04:00 am",
    "04:00 am to 05:00 am",
    "05:00 am to 06:00 am",
    "06:00 am to 07:00 am",
    "07:00 am to 08:00 am",
    "08:00 am to 09:00 am",
    "09:00 am to 10:00 am",
    "10:00 am to 11:00 am",
    "11:00 am to 12:00 pm",
    "12:00 pm to 01:00 pm",
    "01:00 pm to 02:00 pm",
    "02:00 pm to 03:00 pm",
    "03:00 pm to 04:00 pm",
    "04:00 pm to 05:00 pm",
    "05:00 pm to 06:00 pm",
    "06:00 pm to 07:00 pm",
    "07:00 pm to 08:00 pm",
    "08:00 pm to 09:00 pm",
    "09:00 pm to 10:00 pm",
    "10:00 pm to 11:00 pm",
    "11:00 pm to 12:00 am",
]

const router = Router();

router.post('/', async (req, res) => {

    const body = req.body;
    const { success } = bookingRequestInput.safeParse(body);
    // console.log(body);

    if (!success) {
        res.status(403);
        return res.json({
            error: 'Inputs are not correct!'
        })
    }
    const id = uuidv4();
    try {
        const request = await client.query(
            'INSERT INTO "BookingRequest" (id, vehicle, "dateTime", "firstName", "lastName", email,phone,pickup,dropoff,note) VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9,$10) RETURNING *',
            [id, body.vehicle, body.dateTime, body.firstName, body.lastName, body.email, body.phone, body.pickup, body.dropoff, body.note]
        );

        const adminEmail = process.env.ADMIN_EMAIL;
        const userEmail = body.email;
        const sendgridApiKey = process.env.SENDGRID_API_KEY;

        const userEmailPayload = {
            personalizations: [
                {
                    to: [{ email: userEmail }],
                    subject: "Booking Request Received",
                },
            ],
            from: { email: "javedakhtary15@gmail.com" }, // Replace with your verified sender email
            content: [
                {
                    type: "text/html",
                    value: `
                        <p>Dear ${body.firstName}</p>
                        <p>Thank you for choosing Black Vans Transportation. We have successfully received your booking request, and our team is reviewing it.</p>
                        <p>Booking Details:</p>
                        <ul>
                            <li><strong>Name:</strong> ${body.firstName} ${body.lastName}</li>
                            <li><strong>Email:</strong> ${body.email}</li>
                            <li><strong>Phone Number:</strong> ${body.phone}</li>
                            <li><strong>Vehicle:</strong> ${body.vehicle}</li>
                            <li><strong>Pickup Location:</strong> ${body.pickup}</li>
                            <li><strong>Drop-off Location:</strong> ${body.dropoff}</li>
                            <li><strong>Date & Time:</strong> ${body.dateTime}</li>
                            <li><strong>Note:</strong> ${body.note}</li>
                        </ul>
                        <br>
                        <p>One of our executives will get in touch with you shortly to confirm your booking and walk you through rest of the process. Once booked, you will receive another confirmation email with all the necessary details.</p>
                        <p>If you have any questions or need to modify your booking, please don't hesitate to contact us at +1 657-389-3470 or sales@blackvans.com.</p>
                        <p>nThank you for choosing us for your journey!</p>
                        <br>
                        <p>Best regards,</p>
                        <p>Customer Care</p>
                        <p>Black Vans Transporation</p>
                        <p>+1 657-389-3470 | sales@blackvans.com</p>
                        <p>www.blackvans.com</p>`,
                },
            ],
        };

        const adminEmailPayload = {
            personalizations: [
                {
                    to: [{ email: adminEmail }],
                    subject: "New Booking Request Submitted",
                },
            ],
            from: { email: "javedakhtary15@gmail.com" }, // Replace with your verified sender email
            content: [
                {
                    type: "text/html",
                    value: `
                        <p>Dear Admin</p>
                        <p>A new booking request has been submitted through the website. Please review the details below:</p>
                        <br>
                        <p>Customer Information:</p>
                        <ul>
                            <li><strong>Name:</strong> ${body.firstName} ${body.lastName}</li>
                            <li><strong>Email:</strong> ${body.email}</li>
                            <li><strong>Phone Number:</strong> ${body.phone}</li>
                            <li><strong>Vehicle:</strong> ${body.vehicle}</li>
                            <li><strong>Pickup:</strong> ${body.pickup}</li>
                            <li><strong>Dropoff:</strong> ${body.dropoff}</li>
                            <li><strong>Date & Time:</strong> ${body.dateTime}</li>
                        </ul>
                        <p>To accept or reject the booking, log into the admin dashboard: [Admin Portal URL]</p>`,
                },
            ],
        };

        // Send emails using the SendGrid API
        const sendEmail = async (payload) => {
            const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sendgridApiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // console.error("Failed to send email:", await response.text());
            }
        };

        await Promise.all([
            sendEmail(userEmailPayload),
            sendEmail(adminEmailPayload),
        ]);

        return res.json({
            id: request.rows[0].id,
            message: "Booking request submitted and emails sent successfully.",
        });
    } catch (error) {
        console.log(error);

        res.status(400).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
});

router.put('/', async (req, res) => {
    const { id } = req.body;
    const body = req.body;

    const values = [
        body.vehicle ?? null,
        body.dateTime ?? null,
        body.firstName ?? null,
        body.lastName ?? null,
        body.email ?? null,
        body.phone ?? null,
        body.pickup ?? null,
        body.dropoff ?? null,
        body.prepTime ?? null,
        body.status ?? null,
        body.note ?? null,
        id
    ];
    try {
        const query = `
    UPDATE "BookingRequest"
    SET 
        vehicle = COALESCE($1, vehicle),
        "dateTime" = COALESCE($2, "dateTime"),
        "firstName" = COALESCE($3, "firstName"),
        "lastName" = COALESCE($4, "lastName"),
        email = COALESCE($5, email),
        phone = COALESCE($6, phone),
        pickup = COALESCE($7, pickup),
        dropoff = COALESCE($8, dropoff),
        "prepTime" = COALESCE($9, "prepTime"),
        status = COALESCE($10, status),
        note = COALESCE($11, note)
    WHERE id = $12
    RETURNING *;
`;

        const request = await client.query(query, values);
        const bookingid = request.rows[0].id;

        if (body.status === 'Accepted') {
            const dateTime = request.rows[0].dateTime;
            let [date, slot] = dateTime.split(' - ');
            // Splitting date and slot
            const dateObject = new Date(date);
            let start = 0;


            for (let i = 0; i < timeSlots.length; i++) {
                if (timeSlots[i].slice(0, 8) === slot.slice(0, 8)) {
                    start = i;
                    break;
                }
            }
            let end = 0;

            for (let i = 0; i < timeSlots.length; i++) {
                if (timeSlots[i].slice(12, 20) === slot.slice(12, 20)) {
                    end = i;
                    break;
                }
            }
            end += (request.rows[0].prepTime);
            dateObject.setHours(dateObject.getHours() + 5);
            dateObject.setMinutes(dateObject.getMinutes() + 30);

            for (let i = start; i <= end; i++) {
                const timeSlot = timeSlots[i];
                const bid = uuidv4();
                const val = [bid, bookingid, dateObject, timeSlot];
                const query = `
                INSERT INTO "booked_slots"
                VALUES ($1, $2, $3,$4)
                RETURNING *;
            `;
                await client.query(query, val);
            }

            const userEmail = request.rows[0].email;
            const sendgridApiKey = process.env.SENDGRID_API_KEY;

            const userEmailPayload = {
                personalizations: [
                    {
                        to: [{ email: userEmail }],
                        subject: "Booking Request Received",
                    },
                ],
                from: { email: "javedakhtary15@gmail.com" }, // Replace with your verified sender email
                content: [
                    {
                        type: "text/html",
                        value: `
                        <p>Dear ${request.rows[0].firstName}</p>
                        <p>Thank you for choosing Black Vans Transportation. Your booking has been accepted below are the booking details.</p>
                        <p>Booking Details:</p>
                        <ul>
                            <li><strong>Name:</strong> ${request.rows[0].firstName} ${request.rows[0].lastName}</li>
                            <li><strong>Email:</strong> ${request.rows[0].email}</li>
                            <li><strong>Phone Number:</strong> ${request.rows[0].phone}</li>
                            <li><strong>Vehicle:</strong> ${request.rows[0].vehicle}</li>
                            <li><strong>Pickup Location:</strong> ${request.rows[0].pickup}</li>
                            <li><strong>Drop-off Location:</strong> ${request.rows[0].dropoff}</li>
                            <li><strong>Date & Time:</strong> ${request.rows[0].dateTime}</li>
                            <li><strong>Note:</strong> ${request.rows[0].note}</li>
                        </ul>
                        <br>
                        <p>Best regards,</p>
                        <p>Customer Care</p>
                        <p>Black Vans Transporation</p>
                        <p>+1 657-389-3470 | sales@blackvans.com</p>
                        <p>www.blackvans.com</p>`,
                    },
                ],
            };

            const sendEmail = async (payload) => {
                const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${sendgridApiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    // console.error("Failed to send email:", await response.text());
                }
            };

            await Promise.all([
                sendEmail(userEmailPayload),
            ]);
        }

        if (body.status === "Rejected") {
            const query = `
            DELETE FROM "booked_slots"
            WHERE "bookingRequestId" = $1;
        `;
            await client.query(query, [bookingid]);


            const userEmail = request.rows[0].email;
            const sendgridApiKey = process.env.SENDGRID_API_KEY;

            const userEmailPayload = {
                personalizations: [
                    {
                        to: [{ email: userEmail }],
                        subject: "Booking Request Received",
                    },
                ],
                from: { email: "javedakhtary15@gmail.com" }, // Replace with your verified sender email
                content: [
                    {
                        type: "text/html",
                        value: `
                        <p>Dear ${request.rows[0].firstName}</p>
                        <p>Thank you for choosing Black Vans Transportation. We regret to inform you that your booking request on ${request.rows[0].dateTime} has been rejected at this time.
                        This could be due to a variety of reasons, such as availability or other requirements. We apologize for any inconvenience this may cause. If you need any further assistance or have any questions, please don't hesitate to reach out to our support team. We hope to serve you in the future. </p>
                        
                        <br>
                        <p>Best regards,</p>
                        <p>Customer Care</p>
                        <p>Black Vans Transporation</p>
                        <p>+1 657-389-3470 | sales@blackvans.com</p>
                        <p>www.blackvans.com</p>`,
                    },
                ],
            };

            const sendEmail = async (payload) => {
                const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${sendgridApiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    // console.error("Failed to send email:", await response.text());
                }
            };

            await Promise.all([
                sendEmail(userEmailPayload),
            ]);
        }

        if (request.rows[0].status === 'Accepted' && body.prepTime) {
            const query = `
            DELETE FROM "booked_slots"
            WHERE "bookingRequestId" = $1;
        `;
            await client.query(query, [bookingid]);
            const dateTime = request.rows[0].dateTime;
            let [date, slot] = dateTime.split(' - ');
            // Splitting date and slot
            const dateObject = new Date(date);
            let start = 0;

            for (let i = 0; i < timeSlots.length; i++) {
                if (timeSlots[i].slice(0, 8) === slot.slice(0, 8)) {
                    start = i;
                    break;
                }
            }
            let end = 0;

            for (let i = 0; i < timeSlots.length; i++) {
                if (timeSlots[i].slice(12, 20) === slot.slice(12, 20)) {
                    end = i;
                    break;
                }
            }
            end += request.rows[0].prepTime;
            dateObject.setHours(dateObject.getHours() + 5);
            dateObject.setMinutes(dateObject.getMinutes() + 30);

            for (let i = start; i <= end; i++) {
                const timeSlot = timeSlots[i];
                const bid = uuidv4();
                const val = [bid, bookingid, dateObject, timeSlot];
                const query = `
                INSERT INTO "booked_slots"
                VALUES ($1, $2, $3,$4)
                RETURNING *;
            `;
                await client.query(query, val);
            }
        }

        return res.json({
            id: bookingid
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
}
);

router.get('/bulk', async (req, res) => {
    try {
        const request = await client.query(
            'SELECT * FROM "BookingRequest" ORDER BY "createdAt" DESC;'
        );
        return res.json(request.rows);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
});

router.get('/booked-dates', async (req, res) => {
    try {
        const bookedDates = await client.query(
            'SELECT date,slot FROM "booked_slots" ORDER BY "date";'
        );

        const groupedByDate = bookedDates.rows.reduce((acc, current) => {
            const dateString = current.date.toISOString().split('T')[0]; // 
            // @ts-ignore
            if (!acc[dateString]) {
                // @ts-ignore
                acc[dateString] = [];
            }
            // @ts-ignore
            acc[dateString].push(current.slot); // Push the slot to the date group
            return acc;
        }, {});

        return res.json(groupedByDate);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
}
);

router.get('/report', async (req, res) => {
    try {
        const bookings = await client.query(
            'SELECT * FROM "BookingRequest" ORDER BY "createdAt" DESC;'
        );
        const formattedData = bookings.rows.map((booking) => ({
            ID: booking.id || '',
            Vehicle: booking.vehicle || '',
            Date_Time: booking.dateTime || '',
            First_Name: booking.firstName || '',
            Last_Name: booking.lastName || '',
            Email: booking.email || '',
            Phone: booking.phone || '',
            Pickup: booking.pickup || '',
            Dropoff: booking.dropoff || '',
            prepTime: booking.prepTime || '',
            Status: booking.status || '',
            Note: booking.note || '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.header('Content-Disposition', 'attachment; filename="Booking_Report.xlsx"');


        return res.send(buffer);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
}
);

router.get('/booked-slots/:date', async (req, res) => {
    const { date } = req.params;
    try {
        const dateObject = new Date(date);

        if (isNaN(dateObject)) {
            res.status(400);
            return res.json({
                error: 'Invalid date format.'
            });
        }

        const request = await client.query(
            'SELECT slot FROM "booked_slots" WHERE date = $1 ORDER BY slot;',
            [dateObject]
        );
        return res.json(request.rows);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
}
);

router.get('/requests', async (req, res) => {
    try {
        const request = await client.query(
            'SELECT * FROM "BookingRequest" WHERE status = \'Pending\';'
        );
        return res.json({
            requests: request.rowCount
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
}
);

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await client.query(
            'SELECT * FROM "BookingRequest" WHERE id = $1;',
            [id]
        );
        return res.json(request.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'An error occurred while processing your request. Please try again later.' });
    }
}
)
export default router;