// ============================================
// EMAIL SERVICE - EmailJS Integration
// Service d'envoi d'emails après inscription
// ============================================

const EmailService = {
  // Configuration EmailJS (à remplacer par vos vraies clés)
  config: {
    serviceID: 'service_allstore', // Votre Service ID EmailJS
    templateID: 'template_welcome', // Votre Template ID EmailJS
    publicKey: 'YOUR_PUBLIC_KEY'    // Votre Public Key EmailJS
  },

  // Initialiser EmailJS
  init() {
    // Charger le SDK EmailJS si disponible
    if (typeof emailjs !== 'undefined') {
      emailjs.init(this.config.publicKey);
    }
  },

  // Envoyer l'email de bienvenue
  async sendWelcomeEmail(userData) {
    const emailData = {
      to_name: userData.firstname,
      to_email: userData.email,
      user_firstname: userData.firstname,
      user_lastname: userData.lastname,
      user_phone: userData.phone,
      registration_date: new Date().toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      company_name: 'AllStore',
      company_email: 'support@allstore.com',
      company_phone: '+226 70 12 34 56',
      website_url: window.location.origin,
      promo_code: 'BIENVENUE10'
    };

    try {
      // Vérifier si EmailJS est chargé
      if (typeof emailjs !== 'undefined') {
        // Envoi réel via EmailJS
        const response = await emailjs.send(
          this.config.serviceID,
          this.config.templateID,
          emailData
        );
        
        console.log('✅ Email envoyé avec succès:', response.status);
        return { success: true, message: 'Email envoyé' };
      } else {
        // Mode simulation - log dans la console
        console.log('📧 EMAIL SIMULÉ (configurez EmailJS pour l\'envoi réel)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.simulateEmail(emailData);
        return { success: true, message: 'Email simulé (voir console)' };
      }
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return { success: false, message: 'Erreur envoi email' };
    }
  },

  // Simuler l'envoi d'email (pour développement)
  simulateEmail(data) {
    const emailTemplate = `
╔════════════════════════════════════════════════════════════╗
║                    📧 EMAIL DE BIENVENUE                    ║
╠════════════════════════════════════════════════════════════╣
║ De: AllStore <noreply@allstore.com>                       ║
║ À: ${data.to_name} <${data.to_email}>                     ║
║ Sujet: Bienvenue sur AllStore ! 🎉                         ║
╚════════════════════════════════════════════════════════════╝

Bonjour ${data.user_firstname} ${data.user_lastname},

🎊 Bienvenue dans la famille AllStore !

Nous sommes ravis de vous compter parmi nos membres. Votre compte 
a été créé avec succès le ${data.registration_date}.

🎁 CADEAU DE BIENVENUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Profitez de -10% sur votre première commande avec le code :

    💎 ${data.promo_code} 💎

Valable pendant 30 jours sur tous nos produits.

📦 VOS AVANTAGES MEMBRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Livraison gratuite dès 50 000 FCFA
✓ Paiement 100% sécurisé
✓ Service client 24/7
✓ Garantie satisfait ou remboursé
✓ Retours gratuits sous 30 jours
✓ Offres exclusives membres

🛍️ COMMENCER À ACHETER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Découvrez nos meilleures ventes :
→ ${data.website_url}

📱 BESOIN D'AIDE ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Notre équipe est là pour vous aider :
• Email: ${data.company_email}
• WhatsApp: ${data.company_phone}
• FAQ: ${data.website_url}/faq

Informations de votre compte :
• Nom: ${data.user_firstname} ${data.user_lastname}
• Email: ${data.to_email}
• Téléphone: ${data.user_phone}

Merci de votre confiance et à très bientôt sur AllStore !

L'équipe AllStore
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

© 2026 AllStore - Tous droits réservés
Se désabonner | Confidentialité | Conditions d'utilisation
    `;

    console.log(emailTemplate);
  },

  // Envoyer un email de confirmation de commande
  async sendOrderConfirmation(orderData) {
    const emailData = {
      to_name: orderData.customerName,
      to_email: orderData.customerEmail,
      order_id: orderData.orderId,
      order_date: orderData.date,
      order_total: orderData.total,
      order_items: orderData.items,
      tracking_url: `${window.location.origin}/profile.html`
    };

    console.log('📦 Email de confirmation de commande:', emailData);
    return { success: true, message: 'Confirmation envoyée' };
  }
};

// Auto-initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => EmailService.init());
} else {
  EmailService.init();
}
