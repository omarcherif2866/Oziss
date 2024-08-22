import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

const validateContactData = [
    body('email').isEmail().withMessage('Adresse email invalide'),
    body('subject').notEmpty().withMessage('Le sujet est requis'),
    body('message').notEmpty().withMessage('Le message est requis')
];

const sendContactEmail = async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        if (!email || !subject || !message) {
            return res.status(400).json({ message: 'Email, subject, and message are required' });
        }

        // Configurer le transporteur SMTP pour OVH
        const transporter = nodemailer.createTransport({
            host: 'ssl0.ovh.net', // Serveur SMTP d'OVH
            port: 587, // Port SMTP d'OVH
            secure: false, // True pour le port 465, false pour les autres ports
            auth: {
                user: 'contact@ozisscorporation.com', // Remplacez par votre email OVH
                pass: 'O-Contact-C25', // Remplacez par le mot de passe de votre email OVH
            },
            tls: {
                // C'est une bonne pratique de définir le paramètre tls.rejectUnauthorized à false pour ignorer les erreurs de certificat SSL si elles existent.
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: email, // L'adresse email OVH que vous utilisez
            to: 'contact@ozisscorporation.com', // L'adresse où vous souhaitez recevoir les emails
            subject: subject,
            html: `
                <p>${message}</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            console.log('Email sent: ' + info.response);
            res.json({ message: 'Contact email sent successfully.' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending contact email' });
    }
};

export { sendContactEmail, validateContactData };
