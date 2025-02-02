import { z } from "zod";
import validator from 'validator';


export const isValidIsraeliId = (id: string): boolean => {
    if (id.length > 9) return false;
    id = id.padStart(9, "0");
    return (
        id
            .split("")
            .map(Number)
            .reduce((sum, digit, i) => {
                const step = digit * ((i % 2) + 1);
                return sum + (step > 9 ? step - 9 : step);
            }, 0) % 10 === 0
    );
};


export const isValidEmail = (email: string): boolean => {
    return validator.isEmail(email);
};


export const detailsSchema = z.object({
    name: z.string().min(1, "שם מלא הוא שדה חובה."),
    address: z.string().optional(),
    id_number: z
        .string()
        .optional()
        .refine(
            (id) => id === "" || (id && isValidIsraeliId(id)),
            "תעודת זהות לא תקינה."
        ),
    email: z
        .string()
        .optional()
        .refine(
            (email) => email === "" || (email && isValidEmail(email)),
            "כתובת המייל לא תקינה."
        ),
});


