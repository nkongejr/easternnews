const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

// @route POST /api/contact
const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const saved = await ContactMessage.create({ name, email, subject, message });

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Eastern Newspaper Website" <${process.env.SMTP_USER}>`,
      to: process.env.NEWSROOM_EMAIL,
      replyTo: email,
      subject: `[Website Contact] ${subject || 'New message'}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
  } catch (err) {
    console.warn('Email send failed (message still saved to DB):', err.message);
  }

  res.status(201).json({ message: 'Message sent successfully', id: saved._id });
});

// @route POST /api/contact/newsletter
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const exists = await NewsletterSubscriber.findOne({ email });
  if (exists) {
    return res.status(200).json({ message: 'You are already subscribed' });
  }
  await NewsletterSubscriber.create({ email });
  res.status(201).json({ message: 'Subscribed successfully' });
});

// @route GET /api/contact/messages (admin)
const getMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort('-createdAt');
  res.json(messages);
});

module.exports = { sendContactMessage, subscribeNewsletter, getMessages };