import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const templatePath = path.resolve(
    'src',
    'templates',
    'resetPassword.html'
);

let html = fs.readFileSync(templatePath, 'utf-8');

export const sendResetPasswordMail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    const resetLink = `${process.env.BACKEND_URL}/reset-password?token=${token}`;
    html = html.replace('{{resetLink}}', resetLink);

    await transporter.sendMail({
        from: `"studyFlow" <no-reply@studyflow.com>`,
        to: email,
        subject: 'Recuperação de senha - StudyFlow',
        html
    });
};