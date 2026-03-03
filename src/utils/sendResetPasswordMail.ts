import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const templatePath = path.resolve(
    'src',
    'templates',
    'resetPassword.html'
);

let templateHtml = fs.readFileSync(templatePath, 'utf-8');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

export const sendResetPasswordMail = async (email: string, token: string) => {


    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = templateHtml.replace('{{resetLink}}', resetLink);

    await transporter.sendMail({
        from: `"studyFlow" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperação de senha - StudyFlow',
        html
    });
};