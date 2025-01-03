import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { bookingRequestInput, updateBookingRequestInput } from '@javed-ak/booking-inputs';
import * as XLSX from "xlsx";
import { parse, format } from 'date-fns';

// sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

export const bookingRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
        ADMIN_EMAIL: string
        SENDGRID_API_KEY: string
    }
}>();

bookingRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = bookingRequestInput.safeParse(body);
    const { dateTime } = body;
    const [date, slot] = dateTime.split(' - '); // Splitting date and slot
    const dateObject = new Date(date);
    dateObject.setHours(dateObject.getHours() + 5);       // Add 5 hours
    dateObject.setMinutes(dateObject.getMinutes() + 30);

    if (!success) {
        c.status(403);
        return c.json({
            error: 'Inputs are not correct!'
        })
    }
    try {
        await prisma.bookedSlot.create({
            data: {
                date: dateObject,  // Store the date as Date object
                slot: slot         // Store the time slot
            }
        });

        const request = await prisma.bookingRequest.create({
            data: {
                vehicle: body.vehicle,
                dateTime: body.dateTime,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                pickup: body.pickup,
                dropoff: body.dropoff,
                note: body.note
            }
        })



        const adminEmail = c.env.ADMIN_EMAIL;
        const userEmail = body.email;
        const sendgridApiKey = c.env.SENDGRID_API_KEY;

        // Prepare email content
        const userEmailPayload = {
            personalizations: [
                {
                    to: [{ email: userEmail }],
                    subject: "Booking Request Received",
                },
            ],
            from: { email: "noreply@yourdomain.com" }, // Replace with your verified sender email
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
        const sendEmail = async (payload: object) => {
            const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sendgridApiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error("Failed to send email:", await response.text());
            }
        };

        await Promise.all([
            sendEmail(userEmailPayload),
            sendEmail(adminEmailPayload),
        ]);

        return c.json({
            id: request.id,
            message: "Booking request submitted and emails sent successfully.",
        });

    } catch (e) {
        c.status(411);
        console.log(e);
        return c.json({
            error: 'Something went wrong!'
        })
    }
})

bookingRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = updateBookingRequestInput.safeParse(body);

    // if(!success) {
    //     c.status(403);
    //     return c.json({
    //         error : 'Inputs are not correct!'
    //     })
    // }
    try {
        const request = await prisma.bookingRequest.update({
            where: {
                id: body.id
            },
            data: {
                vehicle: body.vehicle,
                dateTime: body.dateTime,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                pickup: body.pickup,
                dropoff: body.dropoff,
                note: body.note,
                status: body.status
            }
        })
        return c.json({
            id: request.id
        })
    } catch (e) {
        c.status(411);
        return c.json({
            error: 'Something went wrong!'
        })
    }
})

bookingRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const bookings = await prisma.bookingRequest.findMany();
    return c.json({
        bookings
    })
})

bookingRouter.get('/report', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const bookings = await prisma.bookingRequest.findMany();

        // Format data for Excel
        const formattedData = bookings.map((booking) => ({
            ID: booking.id,
            Vehicle: booking.vehicle,
            Date_Time: booking.dateTime,
            First_Name: booking.firstName,
            Last_Name: booking.lastName,
            Email: booking.email,
            Phone: booking.phone,
            Pickup: booking.pickup,
            Dropoff: booking.dropoff,
            Note: booking.note,
            Status: booking.status,
        }));

        // Create a new workbook and add the data
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

        // Convert the workbook to a buffer
        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        return c.json({
            buffer
        })
        // Set the response headers for file download
        // c.res.headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        // c.res.headers.set("Content-Disposition", 'attachment; filename="Booking_Report.xlsx"');
        // c.res.body = buffer;
        // return c;
    } catch (error) {
        return c.json({ error: "Failed to generate report" });
    }
});

bookingRouter.get('/booked-dates', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const bookedDates = await prisma.bookedSlot.findMany({
            select: {
                date: true,
                slot: true
            },
            orderBy: {
                date: 'asc'
            }
        });
        const groupedByDate = bookedDates.reduce((acc, current) => {
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
        return c.json(groupedByDate);

    } catch (error) {
        console.error(error);
        c.status(500); // Internal server error
        return c.json({
            error: 'An error occurred while fetching the booked dates.'
        });
    }
});

bookingRouter.get('/booked-slots/:date', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const date = c.req.param('date') // Date passed as URL parameter (e.g., '2025-01-10')

    try {
        // Convert the date string to a Date object
        const dateObject = new Date(date);

        // @ts-ignore
        if (isNaN(dateObject)) {
            c.status(400);
            return c.json({
                error: 'Invalid date format.'
            });
        }

        // Fetch all booked slots for the given date
        const bookedSlots = await prisma.bookedSlot.findMany({
            where: {
                date: dateObject // Match by the parsed date
            },
            select: {
                slot: true  // Return only the slot for the given date
            },
            orderBy: {
                slot: 'asc'  // Order slots by ascending time
            }
        });

        if (bookedSlots.length === 0) {
            return c.json({
                message: 'No slots booked for this date.'
            });
        }

        return c.json(bookedSlots);

    } catch (error) {
        console.error(error);
        c.status(500); // Internal server error
        return c.json({
            error: 'An error occurred while fetching the booked slots for this date.'
        });
    } finally {
        await prisma.$disconnect();
    }
});

bookingRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param('id')

    try {
        const booking = await prisma.bookingRequest.findFirst({
            where: {
                id: id
            }
        })
        return c.json({
            booking
        })
    } catch (e) {
        c.status(411);
        return c.json({
            error: 'Error while fetching booking request'
        })
    }
})


