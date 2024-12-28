import z from 'zod';

export const signUpInput = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)

})

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const bookingRequestInput = z.object({
    vehicle: z.string(),
    dateTime: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    pickup: z.string(),
    dropoff: z.string(),
    note: z.string().optional()
})

export const updateBookingRequestInput = z.object({
    vehicle: z.string(),
    dateTime: z.string().datetime(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    pickup: z.string(),
    dropoff: z.string(),
    note: z.string().optional()
})

export type SignUpInput = z.infer<typeof signUpInput>
export type SigninInput = z.infer<typeof signinInput>
export type BookingRequestInput = z.infer<typeof bookingRequestInput>
export type UpdateBookingRequestInput = z.infer<typeof updateBookingRequestInput>