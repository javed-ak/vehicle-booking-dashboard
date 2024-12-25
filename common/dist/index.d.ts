import z from 'zod';
export declare const signUpInput: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const signinInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const bookingRequestInput: z.ZodObject<{
    vehicle: z.ZodString;
    dateTime: z.ZodString;
    firstName: z.ZodString;
    LastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    vehicle: string;
    dateTime: string;
    firstName: string;
    LastName: string;
    phone: string;
    note: string;
}, {
    email: string;
    vehicle: string;
    dateTime: string;
    firstName: string;
    LastName: string;
    phone: string;
    note: string;
}>;
export declare const updateBookingRequestInput: z.ZodObject<{
    vehicle: z.ZodString;
    dateTime: z.ZodString;
    firstName: z.ZodString;
    LastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    vehicle: string;
    dateTime: string;
    firstName: string;
    LastName: string;
    phone: string;
    note: string;
}, {
    email: string;
    vehicle: string;
    dateTime: string;
    firstName: string;
    LastName: string;
    phone: string;
    note: string;
}>;
export type SignUpInput = z.infer<typeof signUpInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type BookingRequestInput = z.infer<typeof bookingRequestInput>;
export type UpdateBookingRequestInput = z.infer<typeof updateBookingRequestInput>;
