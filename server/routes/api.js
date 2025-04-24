const express = require('express');
const router = express.Router();
const db = require('../database/articles.db');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Recherche d'articles
router.get('/search', (req, res) => {
    const query = req.query.q;
    if (!query || query.length < 2) {
        return res.json([]);
    }

    db.all(`
        SELECT id, title, excerpt, category, date 
        FROM articles 
        WHERE title LIKE ? OR content LIKE ? OR keywords LIKE ?
        ORDER BY date DESC
        LIMIT 10
    `, [`%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Récupérer les catégories
router.get('/categories', (req, res) => {
    db.all('SELECT name, slug FROM categories', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Soumission du formulaire de contact
router.post('/contact', [
    body('name').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('message').notEmpty().trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            message: 'Validation error', 
            errors: errors.array() 
        });
    }

    // Configurer le transporteur email (à adapter avec vos infos SMTP)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `"FlashNews Contact" <${process.env.CONTACT_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: 'Nouveau message de contact',
        text: `Nom: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur d\'envoi d\'email:', error);
            return res.json({ 
                success: false, 
                message: 'Erreur lors de l\'envoi du message' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Votre message a été envoyé avec succès' 
        });
    });
});

module.exports = router;