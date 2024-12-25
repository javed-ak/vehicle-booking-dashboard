import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { bookingRequestInput, updateBookingRequestInput } from '@javed-ak/booking-inputs'

export const bookingRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    }
}>();

bookingRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header('authorization') || '';
    const token = authHeader.split(" ")[1];

    try {
        const response = await verify(token, c.env.JWT_SECRET);
        if (response) {
            await next();
        } else {
            c.status(403)
            return c.json({
                error: "Unauthorized"
            })
        }
    } catch (e) {
        c.status(403);
        console.log('Authorization Error');
        return c.json({
            error: 'You are not login!'
        })
    }
})

bookingRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = bookingRequestInput.safeParse(body);

    // if(!success) {
    //     c.status(403);
    //     return c.json({
    //         error: 'Inputs are not correct!'
    //     })
    // }
    try {
        const request = await prisma.bookingRequest.create({
            data: {
                vehicle: body.vehicle,
                dateTime: body.dateTime,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                note: body.note
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