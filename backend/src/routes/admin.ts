import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from "hono/jwt";
import { signUpInput, signinInput } from '@javed-ak/booking-inputs'

export const adminRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    }
}>();

adminRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = signUpInput.safeParse(body);

    if (!success) {
        return c.json({
            error: 'Inputs are not correct'
        })
    }
    try {
        const user = await prisma.admin.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password
            }
        })
        const token = await sign({ id: user.id }, c.env.JWT_SECRET)
        c.status(200)
        return c.text(
            'Bearer ' + token
        )
    } catch (e) {
        c.status(403)
        return c.json({
            msg: 'Error while Signing Up!'
        })
    }
})

adminRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);

    if (!success) {
        c.status(403);
        return c.json({
            error: 'Inputs are not correct'
        })
    }
    try {
        const user = await prisma.admin.findFirst({
            where: {
                email: body.email,
                password: body.password
            }
        })

        if (!user) {
            c.status(403)
            return c.json({
                error: 'Email or Password was wrong!'
            })
        }

        const token = await sign({ id: user.id }, c.env.JWT_SECRET)
        return c.text(
            'Bearer ' + token
        )
    } catch (e) {
        c.status(403)
        return c.json({
            msg: 'Error while Signing In!'
        })
    }
})

adminRouter.get('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const admins = await prisma.admin.findMany({
            select: {
                name: true,
                email: true
            }
        })
        c.status(200);
        return c.json(admins)
    } catch (e) {
        c.status(403)
        return c.json({
            msg: 'Error while Fetching Admins!'
        })
    }
})

adminRouter.post('/vehicle', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    console.log(body.name);

    try {
        const vehicle = await prisma.vehicle.create({
            data: {
                name: body.name,
            }
        })
        c.status(200);
        return c.json({
            msg: 'Vehicle Added Successfully!'
        })
    } catch (e) {
        c.status(403)
        return c.json({
            msg: 'Error while Adding Vehicle!'
        })
    }
})

adminRouter.get('/vehicle', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const vehicles = await prisma.vehicle.findMany({
            select: {
                name: true
            }
        })
        c.status(200);
        return c.json(vehicles)
    } catch (e) {
        c.status(403)
        return c.json({
            msg: 'Error while Fetching Vehicles!'
        })
    }
})