import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { bookingRequestInput, updateBookingRequestInput } from '@javed-ak/booking-inputs';
import sgMail from "@sendgrid/mail";

// sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

export const bookingRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
        ADMIN_EMAIL: string
    }
}>();

bookingRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = bookingRequestInput.safeParse(body);

    if(!success) {
        c.status(403);
        return c.json({
            error: 'Inputs are not correct!'
        })
    }
    try {
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
        // Prepare email content
        const userEmail = {
            to: body.email, // Customer email
            from: "noreply@yourdomain.com", // Your email address (verified in SendGrid)
            subject: "Booking Request Received – Thank You!",
            text: `Dear ${body.firstName},
            \n\nThank you for choosing Black Vans Transportation. We have successfully received your booking request, and our team is reviewing it.
            \n\nBooking Details: 
            \n\n• Name: ${body.firstName} ${body.lastName}
            \n• Email: ${body.email}
            \n•	Phone Number: ${body.phone}
            \n• Vehicle: ${body.vehicle}
            \n• Date & Time: ${body.dateTime}
            \n• Pickup Location: ${body.pickup}
            \n• Drop-off Location: ${body.dropoff}
            \n\nOne of our executives will get in touch with you shortly to confirm your booking and walk you through rest of the process. Once booked, you will receive another confirmation email with all the necessary details.
            \nIf you have any questions or need to modify your booking, please don't hesitate to contact us at +1 657-389-3470 or sales@blackvans.com.
            \nThank you for choosing us for your journey!
            \n\nBest regards,
            \nCustomer Care
            \nBlack Vans Transporation
            \n+1 657-389-3470 | sales@blackvans.com
            \nwww.blackvans.com`
        };

        const adminEmail = {
            to: c.env.ADMIN_EMAIL, // Admin email from environment variables
            from: "noreply@yourdomain.com", // Your email address (verified in SendGrid)
            subject: "New Booking Request Submitted",
            text: `Dear Admin,
            \n\nA new booking request has been submitted through the website. Please review the details below:
            \n\nCustomer Information:
            \n•	Name: ${body.firstName} ${body.lastName}
            \n•	Email: ${body.email}
            \n•	Phone Number: ${body.phone}
            \n\nBooking Details:
            \n•	Vehicle Requested: ${body.vehicle}
            \n• Pickup Location: ${body.pickup}
            \n• Drop-off Location: ${body.dropoff}
            \n• Date & Time: ${body.dateTime}
            \n\nTo accept or reject the booking, log into the admin dashboard: [Admin Portal URL]`
        };

        // Send emails
        await sgMail.send(userEmail);
        await sgMail.send(adminEmail);

        return c.json({
            id: request.id
        })
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