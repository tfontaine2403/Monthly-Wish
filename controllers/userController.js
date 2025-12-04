
const db = require('../config/database');

const userController = {

  getProfile: (req, res) => {
    try {
      const userId = 'user_1'; 
      const user = db.getUser(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        success: true,
        user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du profil'
      });
    }
  },

  
  updateProfile: (req, res) => {
    try {
      const userId = 'user_1';
      const updates = req.body;
      
      const updatedUser = db.updateUser(userId, updates);
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        success: true,
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour du profil'
      });

  },


  getStats: (req, res) => {
    try {
      const userId = 'user_1';
      const stats = db.getStats(userId);
      
      if (!stats) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des statistiques'
      });
    }
  },


  inviteFriend: (req, res) => {
    try {
      const { email } = req.body;
      const userId = 'user_1';
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({
          success: false,
          error: 'Email invalide'
        });
      }
      

      console.log(`📧 Invitation envoyée à: ${email}`);
      

      const user = db.getUser(userId);
      if (user) {
        user.stats.friendsCount += 1;
      }
      
      res.json({
        success: true,
        message: `Invitation envoyée à ${email}!`,
        friendsCount: user.stats.friendsCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'envoi de l\'invitation'
      });
    }
  },


  getBadges: (req, res) => {
    try {
      const userId = 'user_1';
      const user = db.getUser(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        success: true,
        badges: user.badges || []
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des badges'
      });
    }
  }
};

module.exports = userController;