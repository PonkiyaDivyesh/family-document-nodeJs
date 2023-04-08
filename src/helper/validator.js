const { check } = require('express-validator')

exports.signupValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('mobile_no', 'Mobile no minimum length 10 digit require').isLength({ min: 10 }),
    check('email', 'Please proper email id enter').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password minimum length 6 digit require').isLength({ min: 6 })
]

exports.loginValidation = [
    check('email', 'Please proper email id enter').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password minimum length 6 digit require').isLength({ min: 6 })
] 