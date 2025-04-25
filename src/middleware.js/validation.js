import { validationResult } from "express-validator";

export const errorResponse = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 422,
                success: false,
                message: "validate all fields",
                errors: errors.array({ onlyFirstError: true }),
            });
        } else {
            next();
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};