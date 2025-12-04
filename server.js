const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const data = {
  user: {
    id: 'demo_user',
    fullName: 'Jean Dupont',
    email: 'demo@example.com',
    stats: {
      totalGoals: 3,
      completedGoals: 0,
      currentStreak: 12,
      friendsCount: 5
    }
  },
  goals: [
    {
      id: 'goal1',
      title: 'Rédiger un journal intime',
      progress: 65,
      description: 'Écrire chaque jour quelques lignes'
    },
    {
      id: 'goal2', 
      title: 'Faire 10 000 pas par jour',
      progress: 82,
      description: 'Atteindre un objectif de pas quotidien'
    }
  ]
};

app.use(express.static('public'));
app.use(express.json());

app.get('/api/user', (req, res) => {
  res.json({ success: true, user: data.user });
});

app.get('/api/goals', (req, res) => {
  res.json({ success: true, goals: data.goals });
});

app.put('/api/goals/:id', (req, res) => {
  const goalId = req.params.id;
  const newProgress = req.body.progress;
  
  const goal = data.goals.find(g => g.id === goalId);
  if (goal) {
    goal.progress = newProgress;
    res.json({ success: true, goal });
  } else {
    res.status(404).json({ success: false, error: 'Goal not found' });
  }
});

app.post('/api/sync', (req, res) => {
  const steps = Math.floor(Math.random() * 2000) + 1000;
  res.json({ 
    success: true, 
    message: `Synchronisé! ${steps} pas détectés`,
    steps: steps
  });
});


app.listen(PORT, () => {
  console.log(`Serveur démarré: http://localhost:${PORT}`);
  console.log(`Accède à l'appli dans ton navigateur!`);
});