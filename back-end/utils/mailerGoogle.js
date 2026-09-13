const nodemailer = require('nodemailer');
const Logger = require('./logger');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER, // smtp.gmail.com
    port: process.env.MAIL_PORT, // 465
    secure: true, 
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendPasswordResetEmail = async (userEmail, resetCode) => {
    const mailOptions = {
        from: `"Support LogiChain" <${process.env.MAIL_FROM}>`,
        to: userEmail,
        subject: 'Votre code de réinitialisation de mot de passe',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Réinitialisation de mot de passe</h2>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de validation à 6 chiffres :</p>
                <div style="background-color: #f8f9fa; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #007bff; border-radius: 5px; margin: 20px 0;">
                    ${resetCode}
                </div>
                <p>Ce code expirera dans <strong>15 minutes</strong>.</p>
                <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
    Logger.info(`Code de réinitialisation e-mail envoyé à : ${userEmail}`);
};

const sendVerificationEmail = async (userEmail, verificationToken) => {
    const verificationUrl = `${process.env.MAIL_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: `"Support LogiChain" <${process.env.MAIL_FROM}>`,
        to: userEmail,
        subject: 'Validez votre adresse e-mail',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Bienvenue sur LogiChain !</h2>
                <p>Merci de vous être inscrit. Veuillez cliquer sur le bouton ci-dessous pour valider votre e-mail et activer votre compte :</p>
                <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Valider mon compte</a>
                <p>Ce lien expirera dans 24 heures.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
    Logger.info(`E-mail de validation envoyé à : ${userEmail}`);
};

module.exports = { 
    sendPasswordResetEmail, 
    sendVerificationEmail 
};