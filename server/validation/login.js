const Validator = require("validator");
const { Record } = require("immutable");

const ErrorRecord = Record({
    name: null,
    password: null
});

module.exports = data => {
    const errors = new ErrorRecord({
        name: !Validator.isLength(String(data.name), { min: 2, max: 20 })
            ? "Name must be between 2 and 20 characters"
            : null,
        password: !Validator.isLength(String(data.password), {
            min: 2,
            max: 20
        })
            ? "Password must be between 2 and 20 characters"
            : null
    });

    return {
        errors: errors.toJS(),
        isValid: errors.equals(new ErrorRecord())
    };
};
