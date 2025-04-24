require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./database/db'); // Importez depuis le fichier dédié
const fileWatcher = require('./utils/fileWatcher');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Limite de taux pour l'API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api', require('./routes/api'));
app.use('/articles', require('./routes/articles'));

// Initialisation de la base de données
function initializeDB() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS articles (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT,
            keywords TEXT,
            excerpt TEXT,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            image_path TEXT,
            views INTEGER DEFAULT 0
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            slug TEXT UNIQUE NOT NULL
        )`, () => {
            // Vérifier et insérer les catégories par défaut
            db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
                if (!err && row.count === 0) {
                    const defaultCategories = [
                        { name: 'Politique', slug: 'politique' },
                        { name: 'Sport', slug: 'sport' },
                        { name: 'Technologie', slug: 'technologie' },
                        { name: 'Économie', slug: 'economie' },
                        { name: 'Culture', slug: 'culture' }
                    ];
                    
                    const stmt = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
                    defaultCategories.forEach(cat => stmt.run(cat.name, cat.slug));
                    stmt.finalize();
                }
            });
        });
    });
}

// Démarrer l'application
initializeDB();
fileWatcher.watchArticlesFolder();

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    db.close();
    process.exit();
});