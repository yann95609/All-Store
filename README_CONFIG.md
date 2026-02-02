# 🛍️ AllStore - Guide de Configuration Améliorée

## ✨ Nouvelles Fonctionnalités Ajoutées

### 1. 📱 Validation Internationale des Téléphones
- ✅ Accepte maintenant **n'importe quel numéro de téléphone du monde**
- Format requis : `+[code pays][numéro]` (ex: +226XXXXXXXX, +33XXXXXXXXX, +1XXXXXXXXXX)
- Minimum : 6 chiffres
- Maximum : 15 chiffres
- Supporte tous les indicatifs internationaux

### 2. 🌐 Intégration Réseaux Sociaux (Google & Facebook)

#### Configuration Google OAuth

1. **Créer un projet Google Cloud:**
   - Allez sur https://console.cloud.google.com/
   - Créez un nouveau projet "AllStore"
   - Activez l'API "Google+ API"

2. **Configurer OAuth 2.0:**
   - Dans "Identifiants", créez des identifiants OAuth 2.0
   - Ajoutez les URI de redirection autorisées:
     - http://localhost/login.html (pour dev)
     - https://votredomaine.com/login.html (pour prod)

3. **Récupérer le Client ID:**
   - Copiez votre Client ID
   - Dans `auth.js`, ligne 88, remplacez:
   ```javascript
   const clientId = 'VOTRE_GOOGLE_CLIENT_ID_ICI';
   ```

4. **Activer l'intégration:**
   - Ligne 100, décommentez:
   ```javascript
   window.location.href = authUrl;
   ```
   - Commentez la section "simulation" (lignes 103-111)

#### Configuration Facebook OAuth

1. **Créer une application Facebook:**
   - Allez sur https://developers.facebook.com/
   - Créez une nouvelle application
   - Sélectionnez "Consommateur"
   - Ajoutez "Facebook Login"

2. **Configurer Facebook Login:**
   - Dans les paramètres de Facebook Login
   - Ajoutez les URI de redirection OAuth valides:
     - http://localhost/login.html
     - https://votredomaine.com/login.html

3. **Récupérer l'App ID:**
   - Dans Paramètres > Base
   - Copiez l'ID de l'application
   - Dans `auth.js`, ligne 115, remplacez:
   ```javascript
   const appId = 'VOTRE_FACEBOOK_APP_ID_ICI';
   ```

4. **Activer l'intégration:**
   - Ligne 125, décommentez:
   ```javascript
   window.location.href = authUrl;
   ```
   - Commentez la section "simulation" (lignes 128-136)

### 3. 💬 Bouton WhatsApp Flottant

#### Configuration du Numéro WhatsApp

1. **Dans index.html (ligne ~260):**
   ```html
   <a href="https://wa.me/VOTRENUMERO?text=Message" ...>
   ```
   
   Remplacez `VOTRENUMERO` par votre numéro au format international:
   - **Burkina Faso:** `22670123456`
   - **France:** `33612345678`
   - **USA:** `15551234567`
   - **Belgique:** `32470123456`
   - **etc.**

2. **Personnaliser le message initial:**
   ```html
   ?text=Bonjour%20AllStore,%20j'ai%20une%20question
   ```
   Les espaces doivent être remplacés par `%20`

3. **Ajouter sur d'autres pages:**
   Copiez le code du bouton WhatsApp (lignes ~258-273 de index.html) avant la balise `</body>` dans:
   - `cart.html`
   - `profile.html`
   - `product-details.html`
   - `login.html`

#### Personnalisation du Bouton

Dans `whatsapp-button.css`, vous pouvez modifier:

**Couleur:**
```css
background: #25D366; /* Vert WhatsApp officiel */
/* ou */
background: #128C7E; /* Vert plus foncé */
```

**Position:**
```css
bottom: 30px; /* Distance du bas */
right: 30px;  /* Distance de droite */
```

**Taille:**
```css
padding: 14px 20px; /* Taille du bouton */
font-size: 14px;    /* Taille du texte */
```

## 📁 Fichiers Modifiés

### Fichiers Principaux:
1. **auth.js** - Logique d'authentification améliorée
2. **db.js** - Base de données avec support social login
3. **index.html** - Page d'accueil avec bouton WhatsApp
4. **whatsapp-button.css** - Styles du bouton WhatsApp

### Installation:

```bash
# 1. Remplacez les anciens fichiers par les nouveaux
cp auth.js /votre/projet/
cp db.js /votre/projet/
cp index.html /votre/projet/

# 2. Ajoutez les styles WhatsApp à votre styles.css
cat whatsapp-button.css >> styles.css
```

## 🧪 Tests

### Test de Validation Téléphone:
- ✅ `+22670123456` (Burkina Faso)
- ✅ `+33612345678` (France)
- ✅ `+15551234567` (USA)
- ✅ `+8613812345678` (Chine)
- ❌ `12345` (trop court)
- ❌ `abcd1234567` (contient des lettres)

### Test OAuth:
En mode simulation (par défaut):
1. Cliquez sur "Continuer avec Google" ou "Continuer avec Facebook"
2. Un message d'avertissement apparaît
3. Après 1 seconde, connexion automatique avec un compte test

En mode production (après configuration):
1. Redirection vers Google/Facebook
2. Authentification
3. Retour sur votre site avec les données utilisateur

### Test WhatsApp:
1. Cliquez sur le bouton flottant vert
2. WhatsApp s'ouvre (web ou app)
3. Message pré-rempli visible
4. Le numéro du propriétaire est déjà sélectionné

## 🔒 Sécurité

### Points Importants:

1. **Ne jamais exposer les secrets:**
   - Les Client Secret et App Secret doivent rester côté serveur
   - Seuls les Client ID et App ID sont publics

2. **HTTPS Obligatoire:**
   - En production, utilisez HTTPS pour OAuth
   - Les cookies de session doivent être sécurisés

3. **Validation Backend:**
   - Validez toujours les données côté serveur
   - localStorage est temporaire et peut être modifié

## 📱 Responsive

Le bouton WhatsApp s'adapte automatiquement:
- **Desktop:** Texte + icône
- **Mobile (<600px):** Icône uniquement (bouton rond)

## 🎨 Personnalisation

### Changer les Couleurs du Site:

Dans `styles.css`, modifiez les variables CSS:
```css
:root {
  --c-gold: #d4a853;      /* Couleur principale */
  --c-accent: #e94848;    /* Couleur d'accent */
  --c-green: #3ecf8e;     /* Vert (succès) */
  --c-red: #e04848;       /* Rouge (erreur) */
}
```

### Modifier les Messages:

Dans `auth.js`, personnalisez les messages toast:
```javascript
this.toast('Votre message personnalisé', 'success');
// Types: 'success', 'error', 'warn', 'info'
```

## 🐛 Débogage

### Problèmes Courants:

**OAuth ne fonctionne pas:**
- Vérifiez que les URI de redirection sont exacts
- Vérifiez que les API sont activées dans les consoles
- Consultez la console JavaScript du navigateur

**Numéro WhatsApp ne fonctionne pas:**
- Vérifiez le format international (sans +, sans espaces)
- Testez le lien directement dans le navigateur
- Assurez-vous que WhatsApp est installé/accessible

**Validation téléphone rejette un numéro valide:**
- Vérifiez qu'il contient 6-15 chiffres
- Vérifiez qu'il commence par + (optionnel)
- Vérifiez qu'il ne contient que des chiffres après le +

## 📞 Support

Pour toute question:
- 📧 Email: support@allstore.com
- 💬 WhatsApp: +226XXXXXXXX (à configurer)
- 🌐 Site: https://allstore.com

## 🚀 Prochaines Étapes

1. Configurer Google et Facebook OAuth
2. Personnaliser le numéro WhatsApp
3. Tester sur différents appareils
4. Déployer en production avec HTTPS
5. Monitorer les connexions sociales

---

**Version:** 2.0 Enhanced
**Dernière mise à jour:** 2026-02-02
**Auteur:** AllStore Team
