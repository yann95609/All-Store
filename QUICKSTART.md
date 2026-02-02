# 🚀 Guide de Démarrage Rapide - AllStore

## ⚡ Installation en 5 Minutes

### 1. Télécharger les Fichiers ✅
Vous avez tous les fichiers nécessaires ! Le projet est prêt à l'emploi.

### 2. Ouvrir le Site 🌐
```bash
# Option A : Double-cliquez sur index.html
# Le site s'ouvrira dans votre navigateur

# Option B : Utilisez un serveur local
python -m http.server 8000
# Puis ouvrez : http://localhost:8000

# Option C : Utilisez VS Code Live Server
# Extension "Live Server" puis clic-droit > "Open with Live Server"
```

### 3. Configuration Minimale (5 min) ⚙️

#### A. Numéro WhatsApp (OBLIGATOIRE)
Dans **TOUS les fichiers HTML**, remplacez :
```html
wa.me/22670123456
```
Par votre numéro (sans +, sans espaces) :
- Burkina : `22670123456`
- France : `33612345678`
- USA : `15551234567`

**Fichiers à modifier :**
- [ ] index.html
- [ ] cart.html
- [ ] profile.html
- [ ] product-details.html

#### B. Email (OPTIONNEL pour commencer)
Le site fonctionne en mode SIMULATION par défaut.
Quand vous voulez de vrais emails :

1. Créez un compte sur [EmailJS.com](https://www.emailjs.com) (gratuit)
2. Dans `email-service.js`, remplacez lignes 9-12
3. Ajoutez avant `</body>` dans `login.html` :
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```

#### C. OAuth (OPTIONNEL pour commencer)
Google et Facebook fonctionnent en mode SIMULATION.
Voir README.md pour activer en production.

### 4. Test Rapide ✨
```
1. Ouvrez index.html
2. Cliquez sur "Compte" > "Créer un compte"
3. Inscrivez-vous :
   - Prénom : Test
   - Nom : User
   - Email : test@example.com
   - Téléphone : +226 70 12 34 56
   - Mot de passe : Test1234!
4. Cliquez F12 (console) pour voir l'email simulé
5. Explorez le site !
```

---

## 📁 Structure Simple

```
allstore/
├── 📄 HTML (5 fichiers)
│   ├── index.html          ← Page d'accueil (START HERE!)
│   ├── login.html          ← Inscription/Connexion
│   ├── cart.html           ← Panier
│   ├── profile.html        ← Mon compte
│   └── product-details.html
│
├── 🎨 CSS (6 fichiers)
│   ├── styles.css          ← Styles principaux
│   ├── auth.css
│   ├── cart.css
│   ├── profile.css
│   ├── product-details.css
│   └── whatsapp-button.css
│
├── ⚙️ JavaScript (8 fichiers)
│   ├── app.js              ← Logique principale
│   ├── auth.js             ← Authentification
│   ├── cart.js
│   ├── profile.js
│   ├── product-details.js
│   ├── db.js               ← Base de données (localStorage)
│   └── email-service.js    ← Service emails
│
└── 📖 Documentation
    ├── README.md           ← Documentation complète
    └── README_CONFIG.md    ← Guide de configuration
```

---

## 🎯 Checklist de Configuration

### Obligatoire (5 min)
- [ ] Ouvrir index.html dans un navigateur
- [ ] Remplacer le numéro WhatsApp
- [ ] Tester l'inscription
- [ ] Ajouter des produits au panier
- [ ] Tester la commande

### Recommandé (30 min)
- [ ] Personnaliser les couleurs (styles.css)
- [ ] Modifier les produits (db.js)
- [ ] Ajuster les codes promo (db.js)
- [ ] Personnaliser les textes
- [ ] Configurer EmailJS pour vrais emails

### Avancé (1-2h)
- [ ] Activer Google OAuth
- [ ] Activer Facebook OAuth
- [ ] Customiser le design
- [ ] Ajouter plus de produits
- [ ] Déployer en ligne

---

## 🔥 Fonctionnalités Déjà Actives

✅ Authentification complète (inscription/connexion)
✅ Validation internationale des téléphones
✅ Panier avec codes promo
✅ Profil utilisateur avec historique
✅ Recherche et filtres
✅ Ventes Flash avec countdown
✅ Bouton WhatsApp flottant
✅ Bouton Scroll-to-Top
✅ Design responsive (mobile/tablet/desktop)
✅ Animations fluides
✅ Emails simulés (console)
✅ localStorage (sauvegarde locale)

---

## 💡 Astuces Rapides

### Tester Sans Inscription
```javascript
// Ouvrez la console (F12)
// Collez ce code pour vous connecter automatiquement :
DB.register('Test', 'User', 'test@test.com', '+226701234', 'test123');
window.location.reload();
```

### Vider le Panier
```javascript
// Console (F12) :
localStorage.clear();
window.location.reload();
```

### Ajouter des Produits Rapidement
Modifiez `db.js`, ligne 21 et dupliquez les produits existants.

### Changer les Couleurs
`styles.css`, lignes 8-25 : changez les valeurs des variables CSS.

---

## 🐛 Problèmes Fréquents

**Les images ne s'affichent pas**
→ Vous êtes hors ligne. Les images viennent d'Unsplash (nécessite Internet)

**Le panier se vide au rafraîchissement**
→ C'est normal avec localStorage. En production, utilisez un vrai backend.

**Les emails ne s'envoient pas**
→ Mode simulation activé. Configurez EmailJS ou regardez la console (F12).

**OAuth ne fonctionne pas**
→ Mode simulation activé. Configurez Google/Facebook ou utilisez email/password.

---

## 📱 Test Responsive

```
Desktop  : Redimensionnez le navigateur > 1024px
Tablet   : 768px - 1024px
Mobile   : < 768px

Ou utilisez F12 > Mode responsive
```

---

## 🚀 Déploiement Rapide

### GitHub Pages (Gratuit, 5 min)
```bash
1. Créez un repo GitHub
2. Uploadez tous les fichiers
3. Settings > Pages > Activez
4. Votre site : https://username.github.io/allstore
```

### Netlify (Gratuit, 3 min)
```
1. Créez un compte sur netlify.com
2. Glissez-déposez votre dossier
3. Site en ligne instantanément !
```

---

## 📞 Besoin d'Aide ?

1. **Consultez README.md** - Documentation complète
2. **Regardez la console** (F12) - Messages d'erreur
3. **Testez en navigation privée** - Évite les caches
4. **Videz le cache** - Ctrl+Shift+Delete

---

## 🎉 Prochaines Étapes

1. ✅ Site fonctionnel ? **Bravo !**
2. 🎨 Personnalisez les couleurs
3. 📦 Ajoutez vos produits
4. 📧 Configurez les emails
5. 🌐 Déployez en ligne
6. 📈 Partagez avec le monde !

---

**Temps total de setup : 5-30 minutes** ⚡

**Difficulté : Débutant** 🟢

**Besoin de code : Minimal** 💻

---

Bon courage et amusez-vous ! 🚀

© 2026 AllStore - Made with ❤️ for Africa
