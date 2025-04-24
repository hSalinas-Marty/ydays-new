const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar'); // Importez depuis le fichier dédié

// Initialiser la connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, '../database/articles.db'));

// Vérifier et créer le dossier des articles si nécessaire
const ARTICLES_DIR = path.join(__dirname, '../../public/articles');
if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}

function processArticleFile(filePath) {
    const fileId = path.basename(filePath, '.html');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extraire les métadonnées
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const categoryMatch = content.match(/data-category="([^"]+)"/i);
    const excerptMatch = content.match(/<p[^>]*>([^<]+)<\/p>/i);
    const keywordsMatch = content.match(/data-keywords="([^"]+)"/i);
    
    const articleData = {
        id: fileId,
        title: titleMatch ? titleMatch[1] : fileId,
        content: content,
        category: categoryMatch ? categoryMatch[1] : 'Général',
        excerpt: excerptMatch ? excerptMatch[1].substring(0, 200) : '',
        keywords: keywordsMatch ? keywordsMatch[1] : '',
        date: new Date().toISOString()
    };
    
    // Insérer ou mettre à jour dans la base de données
    db.serialize(() => {
        db.run(`
            INSERT OR REPLACE INTO articles (id, title, content, category, keywords, excerpt, date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            articleData.id,
            articleData.title,
            articleData.content,
            articleData.category,
            articleData.keywords,
            articleData.excerpt,
            articleData.date
        ], (err) => {
            if (err) {
                console.error('Erreur lors de l\'enregistrement de l\'article:', err);
            } else {
                console.log(`Article "${articleData.title}" synchronisé`);
            }
        });
    });
}

function watchArticlesFolder() {
    const watcher = chokidar.watch(ARTICLES_DIR, {
        ignored: /(^|[\/\\])\../, // ignorer les fichiers cachés
        persistent: true,
        ignoreInitial: false
    });
    
    watcher
        .on('add', filePath => {
            if (path.extname(filePath) === '.html') {
                processArticleFile(filePath);
            }
        })
        .on('change', filePath => {
            if (path.extname(filePath) === '.html') {
                processArticleFile(filePath);
            }
        })
        .on('unlink', filePath => {
            const fileId = path.basename(filePath, '.html');
            db.run('DELETE FROM articles WHERE id = ?', [fileId], (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression de l\'article:', err);
                } else {
                    console.log(`Article ${fileId} supprimé`);
                }
            });
        });
    
    console.log(`Surveillance du dossier des articles: ${ARTICLES_DIR}`);
}

module.exports = {
    watchArticlesFolder
};