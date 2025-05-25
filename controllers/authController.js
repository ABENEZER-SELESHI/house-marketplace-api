//controllers/authController.js
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const Token = require('../models/Token.js');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail.js');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {

        const allowedRoles = ['buyer', 'seller'];
        const validatedRole = allowedRoles.includes(role) ? role : 'buyer';

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, role: validatedRole });

        const token = new Token({
            userId: newUser._id,
            token: crypto.randomBytes(16).toString('hex'),
        });
        await token.save();
        console.log("Verification token created:", token.token);

        await sendEmail({
            from: 'abenezerseleshi11@gmail.com',
            to: newUser.email,
            subject: 'Email Verification',
            text: `Please verify your account by clicking the link: http://${req.headers.host}/api/auth/verify/${token.token}`,
            html: `<p>Please verify your account by clicking the link: <a href="http://${req.headers.host}/api/auth/verify/${token.token}">Verify</a></p>`
        });


        res.status(201).json({ message: 'User registered. Please verify your email.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
 
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ 
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const tokenDoc = await Token.findOne({ token: req.params.token });
        if (!tokenDoc) return res.status(400).send("Invalid or expired token");

        const user = await User.findById(tokenDoc.userId);
        if (!user) return res.status(400).send("User not found");

        if (user.isVerified) return res.status(400).send("User already verified");

        user.isVerified = true;
        await user.save();
        await tokenDoc.deleteOne();

        return res.redirect('http://localhost:3000/login');
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};


const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.isVerified) return res.status(400).json({ message: 'Invalid request' });

    const token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex'),
    });
    await token.save();

    await sendEmail({
        from: 'abenezerseleshi11@gmail.com',
        to: user.email,
        subject: 'Resend Email Verification',
        text: `Please verify your account by clicking the link: http://${req.headers.host}/api/auth/verify/${token.token}`,
        html: `<p>Please verify your account by clicking the link: <a href="http://${req.headers.host}/api/auth/verify/${token.token}">Verify</a></p>`
    });

    res.status(200).json({ message: 'Verification email resent.' });
};

module.exports = {
    register,
    login,
    verifyEmail,
    resendVerificationEmail
};