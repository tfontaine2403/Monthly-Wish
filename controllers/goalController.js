
const db = require('../config/database');

const goalController = {

  getUserGoals: (req, res) => {
    try {
      const userId = 'user_1'; 
      const goals = db.getGoalsByUser(userId);
      
      res.json({
        success: true,
        goals: goals
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des objectifs'
      });
    }
  },

 
  getGoal: (req, res) => {
    try {
      const { id } = req.params;
      const goal = db.getGoal(id);
      
      if (!goal) {
        return res.status(404).json({
          success: false,
          error: 'Objectif non trouvé'
        });
      }
      
      res.json({
        success: true,
        goal
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de l\'objectif'
      });
    }
  },


  createGoal: (req, res) => {
    try {
      const userId = 'user_1'; 
      const goalData = {
        userId,
        ...req.body
      };
      
      const newGoal = db.addGoal(goalData);
      
      res.status(201).json({
        success: true,
        goal: newGoal
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création de l\'objectif'
      });
    }
  },

  updateGoal: (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedGoal = db.updateGoal(id, updates);
      
      if (!updatedGoal) {
        return res.status(404).json({
          success: false,
          error: 'Objectif non trouvé'
        });
      }
      
      res.json({
        success: true,
        goal: updatedGoal
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour de l\'objectif'
      });
    }
  },


  logActivity: (req, res) => {
    try {
      const { goalId, value, notes } = req.body;
      const userId = 'user_1'; 
    
      const activity = db.logActivity(userId, goalId, value, notes);
      const goal = db.getGoal(goalId);
      
      res.json({
        success: true,
        activity,
        goal,
        message: 'Activité enregistrée avec succès!'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'enregistrement de l\'activité'
      });
    }
  },

  getMonthlyGoals: (req, res) => {
    try {
      const templates = db.getMonthlyTemplates();
      const userId = 'user_1';
      const userGoals = db.getGoalsByUser(userId);
      
      const monthlyGoals = templates.map(template => {
        const userGoal = userGoals.find(g => 
          g.monthlyGoal && g.monthlyGoal.month === template.month
        );
        
        return {
          ...template,
          status: userGoal ? userGoal.status : 'not_started',
          progress: userGoal ? userGoal.progress : 0,
          userGoalId: userGoal ? userGoal.id : null
        };
      });
      
      res.json({
        success: true,
        monthlyGoals
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des objectifs mensuels'
      });
    }
  },

  syncDevice: (req, res) => {
    try {
      const { device, steps } = req.body;
      const userId = 'user_1';
      
      const goals = db.getGoalsByUser(userId);
      const stepGoal = goals.find(g => g.title.includes('pas') || g.unit === 'pas');
      
      if (!stepGoal) {
        return res.status(404).json({
          success: false,
          error: 'Aucun objectif de pas trouvé'
        });
      }
      
      const increment = steps || Math.floor(Math.random() * 2000) + 1000;
      const updatedGoal = db.updateGoal(stepGoal.id, {
        currentValue: stepGoal.currentValue + increment
      });
      
      res.json({
        success: true,
        goal: updatedGoal,
        synced: true,
        increment,
        message: `Synchronisé avec ${device || 'votre montre'}! ${increment} pas ajoutés.`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la synchronisation'
      });
    }
  }
};

module.exports = goalController;