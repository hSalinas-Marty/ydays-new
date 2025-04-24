const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../database/articles.db');
const { timeAgo } = require('../utils/helpers');

// Afficher un article
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM articles WHERE id = ?', [req.params.id], (err, article) => {
        if (err || !article) {
            return res.status(404).send('Article non trouvé');
        }

        // Incrémenter le compteur de vues
        db.run('UPDATE articles SET views = views + 1 WHERE id = ?', [req.params.id]);

        // Lire le template d'article
        fs.readFile(path.join(__dirname, '../../templates/article.html'), 'utf8', (err, template) => {
            if (err) {
                return res.status(500).send('Erreur serveur');
            }

            // Remplir le template
            const html = template
                .replace('{{title}}', article.title)
                .replace('{{content}}', article.content)
                .replace('{{category}}', article.category)
                .replace('{{date}}', timeAgo(new Date(article.date)))
                .replace('{{image}}', article.image_path || '/images/default-article.jpg');

            res.send(html);
        });
    });
});

// Lister les articles par catégorie
router.get('/category/:slug', (req, res) => {
    db.get('SELECT name FROM categories WHERE slug = ?', [req.params.slug], (err, category) => {
        if (err || !category) {
            return res.status(404).send('Catégorie non trouvée');
        }

        db.all(`
            SELECT id, title, excerpt, date, image_path 
            FROM articles 
            WHERE category = ? 
            ORDER BY date DESC
        `, [category.name], (err, articles) => {
            if (err) {
                return res.status(500).send('Erreur serveur');
            }

            // Lire le template de catégorie
            fs.readFile(path.join(__dirname, '../../templates/category.html'), 'utf8', (err, template) => {
                if (err) {
                    return res.status(500).send('Erreur serveur');
                }

                // Générer la liste des articles
                let articlesList = '';
                articles.forEach(article => {
                    articlesList += `
                        <article class="category-article">
                            <img src="${article.image_path || '/images/default-article.jpg'}" alt="${article.title}">
                            <div class="article-info">
                                <h3><a href="/articles/${article.id}">${article.title}</a></h3>
                                <div class="meta">
                                    <span class="time-ago">${timeAgo(new Date(article.date))}</span>
                                </div>
                                <p>${article.excerpt}</p>
                            </div>
                        </article>
                    `;
                });

                // Remplir le template
                const html = template
                    .replace('{{category}}', category.name)
                    .replace('{{articles}}', articlesList);

                res.send(html);
            });
        });
    });
});

module.exports = router;