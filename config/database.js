
class InMemoryDB {
  constructor() {
    this.data = {
      users: {},
      goals: {},
      activities: {},
      monthlyTemplates: this.createMonthlyTemplates()
    };
    this.initializeDemoData();
  }

  createMonthlyTemplates() {
    return [
      { month: 1, name: 'Janvier', title: 'Rédiger un journal intime', 
        description: 'L\'écriture est l\'une des meilleures thérapies pour mettre de l\'ordre dans vos idées.',
        tips: 'Commencez par écrire 5 minutes chaque soir avant de dormir.' },
      { month: 2, name: 'Février', title: 'Redécorer la maison', 
        description: 'Faire de votre maison un espace agréable pour déconnecter du reste du monde.',
        tips: 'Commencez par une seule pièce. Ajoutez des plantes pour plus de vie.' },
      { month: 3, name: 'Mars', title: 'Prendre soin de soi', 
        description: 'Arrêter de fumer, faire plus d\'exercice, mieux manger, méditer...',
        tips: 'Fixez-vous un petit objectif réalisable chaque jour.' },
      { month: 4, name: 'Avril', title: 'Soyez gentil', 
        description: 'Des paroles aimables et pleines d\'espoir ; nous avons beaucoup en commun.',
        tips: 'Faites un compliment sincère à quelqu\'un chaque jour.' },
      { month: 5, name: 'Mai', title: 'Faites quelque chose de nouveau', 
        description: 'Marathon, cours de salsa, crochet, voyage en famille, cours d\'échecs...',
        tips: 'Choisissez quelque chose qui vous fait peur mais vous attire.' },
      { month: 6, name: 'Juin', title: 'Passez du temps avec les vôtres', 
        description: 'Se retrouver avec ceux qui nous aiment, week-end à la campagne, dîner en bord de mer...',
        tips: 'Planifiez une activité familiale par semaine.' },
      { month: 7, name: 'Juillet', title: 'Aller à un concert et danser', 
        description: 'Profiter des festivals d\'été, danser sous les étoiles en chantant les meilleurs tubes.',
        tips: 'Recherchez les festivals locaux et réservez à l\'avance.' },
      { month: 8, name: 'Août', title: 'Dormir une nuit sur la plage', 
        description: 'Contempler les étoiles et laisser les premiers rayons du soleil caresser votre visage.',
        tips: 'Vérifiez la météo et les autorisations nécessaires.' },
      { month: 9, name: 'Septembre', title: 'Découvrez le monde', 
        description: 'Sortir de votre zone de confort, explorer de nouveaux terrains, avoir l\'esprit plus ouvert.',
        tips: 'Commencez par explorer votre propre région.' },
      { month: 10, name: 'Octobre', title: 'Étudiez', 
        description: 'Recyclez-vous, acquérez de nouvelles connaissances, nourrissez votre curiosité.',
        tips: 'Utilisez les plateformes en ligne pour des cours gratuits.' },
      { month: 11, name: 'Novembre', title: 'Apprendre à jouer d\'un instrument', 
        description: 'Le ukulélé avec quelques semaines de pratique pour apprendre des chansons simples.',
        tips: 'Pratiquez 15 minutes par jour plutôt que 2 heures une fois par semaine.' },
      { month: 12, name: 'Décembre', title: 'Respirez consciencieusement', 
        description: '5 minutes de prise de conscience sur la façon dont vous respirez chaque jour.',
        tips: 'Utilisez une application de méditation pour vous guider.' }
    ];
  }

  initializeDemoData() {
    const demoUser = {
      id: 'user_1',
      email: 'demo@example.com',
      fullName: 'Jean Dupont',
      phone: '+33 6 12 34 56 78',
      theme: 'light',
      language: 'fr',
      connectedDevice: 'apple-watch',
      notificationPref: 'weekly',
      createdAt: new Date().toISOString(),
      stats: {
        totalGoals: 3,
        completedGoals: 0,
        currentStreak: 12,
        longestStreak: 42,
        friendsCount: 5,
        totalPoints: 1250
      },
      badges: [
        { id: 'badge_1', name: 'Débutant motivé', icon: 'fas fa-seedling', earnedAt: '2025-01-01' },
        { id: 'badge_2', name: 'Série de 7 jours', icon: 'fas fa-fire', earnedAt: '2025-01-07' }
      ]
    };

    this.data.users[demoUser.id] = demoUser;


    const demoGoals = [
      {
        id: 'goal_1',
        userId: demoUser.id,
        title: 'Rédiger un journal intime',
        description: 'Écrire chaque jour quelques lignes pour mettre de l\'ordre dans vos idées.',
        category: 'personnel',
        targetValue: 31,
        currentValue: 20,
        unit: 'jours',
        progress: 65,
        status: 'in_progress',
        monthlyGoal: { month: 1, monthName: 'Janvier' },
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        dailyTarget: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        streak: 5,
        points: 65
      },
      {
        id: 'goal_2',
        userId: demoUser.id,
        title: 'Faire 10 000 pas par jour',
        description: 'Atteindre un objectif de pas quotidien pour améliorer votre santé.',
        category: 'sante',
        targetValue: 280000,
        currentValue: 229600,
        unit: 'pas',
        progress: 82,
        status: 'in_progress',
        startDate: '2025-01-01',
        endDate: '2025-01-28',
        dailyTarget: 10000,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        streak: 12,
        points: 82
      },
      {
        id: 'goal_3',
        userId: demoUser.id,
        title: 'Apprendre à jouer du ukulélé',
        description: 'Apprendre 4 accords de base pour jouer des chansons simples.',
        category: 'loisir',
        targetValue: 30,
        currentValue: 14,
        unit: 'jours',
        progress: 47,
        status: 'in_progress',
        monthlyGoal: { month: 11, monthName: 'Novembre' },
        startDate: '2025-01-15',
        endDate: '2025-02-15',
        dailyTarget: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        streak: 3,
        points: 47
      }
    ];

    demoGoals.forEach(goal => {
      this.data.goals[goal.id] = goal;
    });
  }


  getUser(userId) {
    return this.data.users[userId] || null;
  }

  getGoalsByUser(userId) {
    return Object.values(this.data.goals).filter(goal => goal.userId === userId);
  }

  getGoal(goalId) {
    return this.data.goals[goalId] || null;
  }

  addGoal(goal) {
    const id = `goal_${Date.now()}`;
    const newGoal = {
      ...goal,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      status: 'not_started',
      currentValue: 0,
      streak: 0
    };
    
    this.data.goals[id] = newGoal;
    
    if (this.data.users[goal.userId]) {
      this.data.users[goal.userId].stats.totalGoals += 1;
    }
    
    return newGoal;
  }

  updateGoal(goalId, updates) {
    const goal = this.data.goals[goalId];
    if (!goal) return null;

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'userId') {
        goal[key] = updates[key];
      }
    });


    if (updates.currentValue !== undefined || updates.targetValue !== undefined) {
      if (goal.targetValue > 0) {
        goal.progress = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
        if (goal.progress >= 100) {
          goal.status = 'completed';
        } else if (goal.progress > 0 && goal.status === 'not_started') {
          goal.status = 'in_progress';
        }
      }
    }

    goal.updatedAt = new Date().toISOString();
    return goal;
  }

  logActivity(userId, goalId, value, notes = '') {
    const activityId = `activity_${Date.now()}`;
    const activity = {
      id: activityId,
      userId,
      goalId,
      date: new Date().toISOString().split('T')[0],
      value,
      notes,
      createdAt: new Date().toISOString()
    };

    const goal = this.data.goals[goalId];
    if (goal) {
      goal.currentValue += value;
      
      if (goal.targetValue > 0) {
        goal.progress = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
        if (goal.progress >= 100) {
          goal.status = 'completed';
        } else if (goal.progress > 0 && goal.status === 'not_started') {
          goal.status = 'in_progress';
        }
      }
      
      goal.updatedAt = new Date().toISOString();
      
      const today = new Date().toISOString().split('T')[0];
      if (!goal.lastActivityDate || goal.lastActivityDate !== today) {
        goal.streak += 1;
        goal.lastActivityDate = today;
      }
    }

    return activity;
  }

  updateUser(userId, updates) {
    const user = this.data.users[userId];
    if (!user) return null;

    Object.keys(updates).forEach(key => {
      if (key !== 'id') {
        user[key] = updates[key];
      }
    });

    return user;
  }

  getMonthlyTemplates() {
    return this.data.monthlyTemplates;
  }

  getStats(userId) {
    const user = this.getUser(userId);
    if (!user) return null;

    const goals = this.getGoalsByUser(userId);
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const inProgressGoals = goals.filter(g => g.status === 'in_progress').length;
    const averageProgress = goals.length > 0 
      ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
      : 0;

    return {
      totalGoals: goals.length,
      completedGoals,
      inProgressGoals,
      averageProgress,
      currentStreak: user.stats.currentStreak,
      longestStreak: user.stats.longestStreak,
      friendsCount: user.stats.friendsCount,
      totalPoints: user.stats.totalPoints
    };
  }
}


const db = new InMemoryDB();

module.exports = db;