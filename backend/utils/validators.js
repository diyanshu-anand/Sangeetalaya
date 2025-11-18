import validator from "validator";

export function validateSignupInput({ name, email, password }) {
    const errors = {};
    if (!name || name.trim().length < 2)
        errors.name = "Name is required (minimum 2 characters)";
    if (!email || !validator.isEmail(email))
        errors.email = "Valid email is required";
    if (!password || password.length < 6)
        errors.password = "Password must be at least 6 characters long";
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

export function validateLoginInput({ email, password }) {
    const errors = {};
    if (!email || !validator.isEmail(email))
        errors.email = "Valid email is required";
    if (!password || password.length === 0)
        errors.password = "Password is required";
    return { isValid: Object.keys(errors).length === 0, errors };
}
