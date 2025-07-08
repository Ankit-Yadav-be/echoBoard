require('dotenv').config();
const cron = require('node-cron');
const Task = require('../models/Task');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminder = async () => {
  const now = new Date();

  const tasks = await Task.find({
    reminder: { $lte: now },
    notified: false, 
  }).populate('assignedTo', 'email name');

  for (const task of tasks) {
    if (task.assignedTo?.email) {
      const mailOptions = {
        from: `"ProjectZen" <${process.env.EMAIL_USER}>`,
        to: task.assignedTo.email,
        subject: `⏰ Reminder: ${task.title}`,
        html: `<p>Hi ${task.assignedTo.name},</p>
               <p>This is a reminder for your task: <strong>${task.title}</strong>.</p>
               <p>Deadline: ${task.deadline ? new Date(task.deadline).toLocaleString() : 'N/A'}</p>
               <p>– ProjectZen Team</p>`,
      };

      try {
        await transporter.sendMail(mailOptions);
        task.notified = true;               
        await task.save();                  
        console.log(` Reminder sent to ${task.assignedTo.email}`);
      } catch (err) {
        console.error(`Error sending to ${task.assignedTo.email}:`, err.message);
      }
    }
  }
};

cron.schedule('* * * * *', () => {
  console.log('⏰ Checking for reminders...');
  sendReminder();
});
