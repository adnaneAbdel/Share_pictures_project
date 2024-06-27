
const { check } = require('express-validator');

exports.validateRegister = [
  check('name').trim().not().isEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  check('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character')
];

exports.validateLogin = [
  check('email')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  check('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.validatePost = [
  check('title')
    .trim()
    .not().isEmpty().withMessage('Title is required')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
  check('description')
    .trim()
    .not().isEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long')
];

exports.validatePostLikes = [
  check('postId')
    .isMongoId().withMessage('Invalid post ID')
];
