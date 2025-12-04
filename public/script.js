
const API_BASE_URL = 'http://localhost:3000/api';
const DEMO_USER_ID = 'user_1';


let AppState = {
    user: null,
    goals: [],
    monthlyGoals: [],
    stats: null,
    badges: [],
    currentPage: 'dashboard'
};


const Utils = {

    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },


    formatNumber: (num) => {
        return new Intl.NumberFormat('fr-FR').format(num);
    },


    calculateRemainingDays: (endDate) => {
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    },

    generateId: () => {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};


const AlertManager = {
    container: null,

    init: () => {
        AlertManager.container = document.getElementById('alert-container');
        if (!AlertManager.container) {
            AlertManager.container = document.createElement('div');
            AlertManager.container.id = 'alert-container';
            document.body.appendChild(AlertManager.container);
        }
    },

    show: (message, type = 'info', duration = 5000) => {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        
        const icon = type === 'success' ? '✅' : 
                     type === 'error' ? '❌' : 
                     type === 'warning' ? '⚠️' : 'ℹ️';
        
        alert.innerHTML = `
            <span style="font-size: 1.2em;">${icon}</span>
            <span>${message}</span>
        `;

        AlertManager.container.appendChild(alert);

     
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => alert.remove(), 300);
        }, duration);
    },

    clear: () => {
        if (AlertManager.container) {
            AlertManager.container.innerHTML = '';
        }
    }
};


const ApiService = {

    request: async (endpoint, options = {}) => {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            AlertManager.show(`Erreur API: ${error.message}`, 'error');
            throw error;
        }
    },


    getUser: async () => {
        return await ApiService.request('/user');
    },

    updateUser: async (data) => {
        return await ApiService.request('/user', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    getGoals: async () => {
        return await ApiService.request('/goals');
    },

    getGoal: async (id) => {
        return await ApiService.request(`/goals/${id}`);
    },

    createGoal: async (data) => {
        return await ApiService.request('/goals', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateGoal: async (id, data) => {
        return await ApiService.request(`/goals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    logActivity: async (data) => {
        return await ApiService.request('/goals/activity', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    getMonthlyGoals: async () => {
        return await ApiService.request('/goals/monthly');
    },

    syncDevice: async (data) => {
        return await ApiService.request('/goals/sync', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    getStats: async () => {
        return await ApiService.request('/user/stats');
    },

    inviteFriend: async (email) => {
        return await ApiService.request('/user/invite', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    getBadges: async () => {
        return await ApiService.request('/user/badges');
    }
};


const PageManager = {
    pages: {},

    init: () => {

        PageManager.pages = {
            dashboard: document.getElementById('dashboard-page'),
            goals: document.getElementById('goals-page'),
            monthly: document.getElementById('monthly-page'),
            profile: document.getElementById('profile-page')
        };


        PageManager.initNavigation();
    },

    initNavigation: () => {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                PageManager.showPage(page);
            });
        });
    },

    showPage: (pageName) => {

        AppState.currentPage = pageName;


        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });


        Object.values(PageManager.pages).forEach(page => {
            page.classList.remove('active');
        });


        if (PageManager.pages[pageName]) {
            PageManager.pages[pageName].classList.add('active');
            
            PageManager.loadPageData(pageName);
        }
    },

    loadPageData: async (pageName) => {
        try {
            switch (pageName) {
                case 'dashboard':
                    await DashboardPage.load();
                    break;
                case 'goals':
                    await GoalsPage.load();
                    break;
                case 'monthly':
                    await MonthlyPage.load();
                    break;
                case 'profile':
                    await ProfilePage.load();
                    break;
            }
        } catch (error) {
            console.error(`Erreur lors du chargement de la page ${pageName}:`, error);
            AlertManager.show(`Impossible de charger la page: ${error.message}`, 'error');
        }
    }
};


const DashboardPage = {
    load: async () => {
        try {

            const [statsData, goalsData, monthlyData] = await Promise.all([
                ApiService.getStats(),
                ApiService.getGoals(),
                ApiService.getMonthlyGoals()
            ]);

            AppState.stats = statsData.stats;
            AppState.goals = goalsData.goals;
            AppState.monthlyGoals = monthlyData.monthlyGoals;

 
            DashboardPage.render();
        } catch (error) {
            throw error;
        }
    },

    render: () => {

        const today = new Date();
        const subtitle = document.getElementById('dashboard-subtitle');
        if (subtitle) {
            subtitle.textContent = `Aujourd'hui: ${today.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            })}`;
        }


        DashboardPage.renderStats();


        DashboardPage.renderActiveGoals();


        DashboardPage.renderUpcomingGoals();
    },

    renderStats: () => {
        const container = document.getElementById('stats-container');
        if (!container || !AppState.stats) return;

        const stats = AppState.stats;

        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon stat-1">
                    <i class="fas fa-bullseye"></i>
                </div>
                <div class="stat-info">
                    <h3>${stats.totalGoals}</h3>
                    <p>Objectifs en cours</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon stat-2">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="stat-info">
                    <h3>${stats.completedGoals}</h3>
                    <p>Objectifs atteints</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon stat-3">
                    <i class="fas fa-fire"></i>
                </div>
                <div class="stat-info">
                    <h3>${stats.currentStreak}</h3>
                    <p>Jours de suite</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon stat-4">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>${stats.friendsCount}</h3>
                    <p>Amis parrainés</p>
                </div>
            </div>
        `;
    },

    renderActiveGoals: () => {
        const container = document.getElementById('active-goals-container');
        if (!container || !AppState.goals) return;

        const activeGoals = AppState.goals.filter(goal => 
            goal.status === 'in_progress' || goal.progress > 0
        ).slice(0, 3); 

        if (activeGoals.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-body text-center">
                        <i class="fas fa-inbox" style="font-size: 3rem; color: var(--dark-gray); margin-bottom: 1rem;"></i>
                        <h3>Aucun objectif en cours</h3>
                        <p>Commencez par créer votre premier objectif !</p>
                        <button class="btn btn-accent" onclick="PageManager.showPage('goals')">
                            <i class="fas fa-plus"></i> Créer un objectif
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = activeGoals.map(goal => `
            <div class="card">
                <div class="card-header">
                    <h3>${goal.title}</h3>
                    <p>${goal.description || 'Pas de description'}</p>
                </div>
                <div class="card-body">
                    <div class="progress-container">
                        <div class="progress-label">
                            <span>Progression</span>
                            <span>${goal.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${goal.progress}%"></div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; margin-top: auto;">
                        ${goal.unit ? `
                        <button class="btn" onclick="addProgress('${goal.id}', ${goal.targetValue ? goal.targetValue * 0.1 : 10})">
                            <i class="fas fa-plus"></i> +10%
                        </button>
                        ` : ''}
                        
                        <button class="btn btn-outline" onclick="viewGoal('${goal.id}')">
                            <i class="fas fa-eye"></i> Voir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderUpcomingGoals: () => {
        const container = document.getElementById('upcoming-goals-container');
        if (!container || !AppState.monthlyGoals) return;

        const upcoming = AppState.monthlyGoals
            .filter(goal => goal.status === 'not_started')
            .slice(0, 4);

        container.innerHTML = upcoming.map(goal => `
            <div class="mini-card" onclick="startMonthlyGoal(${goal.month})">
                <h4>${goal.monthName}</h4>
                <p>${goal.title}</p>
                <span class="month-status status-not-started">À venir</span>
            </div>
        `).join('');
    }
};


const GoalsPage = {
    load: async () => {
        try {
            const goalsData = await ApiService.getGoals();
            AppState.goals = goalsData.goals;
            GoalsPage.render();
        } catch (error) {
            throw error;
        }
    },

    render: () => {
        const container = document.getElementById('personal-goals-container');
        if (!container || !AppState.goals) return;

        if (AppState.goals.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-body text-center">
                        <i class="fas fa-bullseye" style="font-size: 3rem; color: var(--dark-gray); margin-bottom: 1rem;"></i>
                        <h3>Vous n'avez pas encore d'objectifs</h3>
                        <p>Créez votre premier objectif pour commencer votre voyage !</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = AppState.goals.map(goal => `
            <div class="card">
                <div class="card-header">
                    <h3>
                        ${goal.title}
                        ${goal.status === 'completed' ? '<i class="fas fa-check-circle" style="color: var(--success);"></i>' : ''}
                    </h3>
                    <p>
                        ${goal.category === 'sante' ? '🏥 Santé' : 
                          goal.category === 'apprentissage' ? '📚 Apprentissage' :
                          goal.category === 'social' ? '👥 Social' :
                          goal.category === 'loisir' ? '🎨 Loisir' : '⭐ Personnel'}
                        ${goal.monthlyGoal ? ` • ${goal.monthlyGoal.monthName}` : ''}
                    </p>
                </div>
                <div class="card-body">
                    <p>${goal.description || 'Pas de description'}</p>
                    
                    ${goal.targetValue ? `
                    <div class="progress-container">
                        <div class="progress-label">
                            <span>${goal.currentValue} / ${goal.targetValue} ${goal.unit || ''}</span>
                            <span>${goal.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${goal.progress}%"></div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; margin-top: auto;">
                        <button class="btn" onclick="addProgress('${goal.id}', ${goal.targetValue ? Math.max(1, Math.floor(goal.targetValue * 0.05)) : 1})">
                            <i class="fas fa-plus"></i> Ajouter
                        </button>
                        <button class="btn btn-outline" onclick="editGoal('${goal.id}')">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                    </div>
                    ` : `
                    <div style="margin-top: auto;">
                        <span class="month-status ${goal.status === 'completed' ? 'status-completed' : 
                                                    goal.status === 'in_progress' ? 'status-in-progress' : 
                                                    'status-not-started'}">
                            ${goal.status === 'completed' ? 'Terminé' : 
                             goal.status === 'in_progress' ? 'En cours' : 'Non commencé'}
                        </span>
                    </div>
                    `}
                </div>
            </div>
        `).join('');
    }
};


const MonthlyPage = {
    load: async () => {
        try {
            const monthlyData = await ApiService.getMonthlyGoals();
            AppState.monthlyGoals = monthlyData.monthlyGoals;
            MonthlyPage.render();
        } catch (error) {
            throw error;
        }
    },

    render: () => {
        const container = document.getElementById('monthly-goals-container');
        if (!container || !AppState.monthlyGoals) return;

        container.innerHTML = AppState.monthlyGoals.map(goal => `
            <div class="month-card" onclick="viewMonthlyGoal(${goal.month})">
                <div class="month-header">
                    <h3>${goal.monthName}</h3>
                </div>
                <div class="month-body">
                    <h4>${goal.title}</h4>
                    <p>${goal.description}</p>
                    
                    ${goal.tips ? `
                    <div style="margin-top: 1rem; padding: 0.75rem; background: var(--light-gray); border-radius: var(--radius-sm);">
                        <small><strong>💡 Conseil:</strong> ${goal.tips}</small>
                    </div>
                    ` : ''}
                    
                    <span class="month-status ${goal.status === 'completed' ? 'status-completed' : 
                                                goal.status === 'in_progress' ? 'status-in-progress' : 
                                                'status-not-started'}">
                        ${goal.status === 'completed' ? 'Terminé' : 
                         goal.status === 'in_progress' ? 'En cours' : 'À venir'}
                        ${goal.progress > 0 ? ` (${goal.progress}%)` : ''}
                    </span>
                </div>
            </div>
        `).join('');
    }
};


const ProfilePage = {
    load: async () => {
        try {
            const [userData, statsData, badgesData] = await Promise.all([
                ApiService.getUser(),
                ApiService.getStats(),
                ApiService.getBadges()
            ]);

            AppState.user = userData.user;
            AppState.stats = statsData.stats;
            AppState.badges = badgesData.badges;

            ProfilePage.render();
        } catch (error) {
            throw error;
        }
    },

    render: () => {
        if (AppState.user) {
            const user = AppState.user;
            
            document.getElementById('profile-name').value = user.fullName || '';
            document.getElementById('profile-email').value = user.email || '';
            document.getElementById('profile-phone').value = user.phone || '';
            document.getElementById('profile-birthdate').value = user.birthdate || '';
            

            document.getElementById('pref-theme').value = user.theme || 'light';
            document.getElementById('pref-language').value = user.language || 'fr';
            document.getElementById('pref-notifications').value = user.notificationPref || 'weekly';
            document.getElementById('pref-device').value = user.connectedDevice || 'none';
            

            document.getElementById('user-name').textContent = user.fullName;
            document.getElementById('user-avatar').textContent = user.fullName?.charAt(0) || 'U';
            
            if (user.stats) {
                document.getElementById('user-streak').textContent = `🔥 Séries: ${user.stats.currentStreak} jours`;
            }
        }


        if (AppState.stats) {
            document.getElementById('stat-total').textContent = AppState.stats.totalGoals;
            document.getElementById('stat-completed').textContent = AppState.stats.completedGoals;
        }


        ProfilePage.renderBadges();
    },

    renderBadges: () => {
        const container = document.getElementById('badges-container');
        if (!container || !AppState.badges) return;

        if (AppState.badges.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; width: 100%; padding: 1rem;">
                    <i class="fas fa-award" style="font-size: 2rem; color: var(--dark-gray); margin-bottom: 0.5rem;"></i>
                    <p style="color: var(--dark-gray);">Aucun badge encore. Continuez vos objectifs !</p>
                </div>
            `;
            return;
        }

        container.innerHTML = AppState.badges.map(badge => `
            <div class="badge">
                <div class="badge-icon">
                    <i class="${badge.icon || 'fas fa-award'}"></i>
                </div>
                <span class="badge-name">${badge.name}</span>
                <small style="font-size: 0.7rem; color: var(--dark-gray);">
                    ${Utils.formatDate(badge.earnedAt)}
                </small>
            </div>
        `).join('');
    }
};


window.showNewGoalForm = () => {
    const form = document.getElementById('new-goal-form');
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
};

window.hideNewGoalForm = () => {
    document.getElementById('new-goal-form').style.display = 'none';
};

window.createGoal = async (event) => {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('goal-title').value,
        description: document.getElementById('goal-description').value,
        category: document.getElementById('goal-category').value,
        targetValue: document.getElementById('goal-target').value ? 
            parseInt(document.getElementById('goal-target').value) : undefined,
        unit: document.getElementById('goal-unit').value || undefined,
        dailyTarget: document.getElementById('goal-daily').value ? 
            parseInt(document.getElementById('goal-daily').value) : undefined
    };

    try {
        const result = await ApiService.createGoal(formData);
        
        AlertManager.show('Objectif créé avec succès!', 'success');
        hideNewGoalForm();
        document.getElementById('goal-form').reset();
        
        await GoalsPage.load();
        

        if (AppState.currentPage === 'dashboard') {
            await DashboardPage.load();
        }
    } catch (error) {
        AlertManager.show('Erreur lors de la création de l\'objectif', 'error');
    }
};

window.addProgress = async (goalId, increment) => {
    try {
        const result = await ApiService.logActivity({
            goalId,
            value: increment,
            notes: 'Progression manuelle'
        });

        AlertManager.show(`+${increment} ajoutés à l'objectif!`, 'success');
        
  
        await PageManager.loadPageData(AppState.currentPage);
    } catch (error) {
        AlertManager.show('Erreur lors de l\'ajout de progression', 'error');
    }
};

window.syncDevice = async () => {
    try {
        const result = await ApiService.syncDevice({
            device: 'apple-watch',
            steps: null 
        });

        AlertManager.show(result.message, 'success');
        
        
        await PageManager.loadPageData(AppState.currentPage);
    } catch (error) {
        AlertManager.show('Erreur lors de la synchronisation', 'error');
    }
};

window.inviteFriend = async () => {
    const email = document.getElementById('invite-email').value;
    
    if (!email || !email.includes('@')) {
        AlertManager.show('Veuillez entrer une adresse email valide', 'error');
        return;
    }

    try {
        const result = await ApiService.inviteFriend(email);
        
        AlertManager.show(result.message, 'success');
        document.getElementById('invite-email').value = '';
        

        if (AppState.currentPage === 'dashboard') {
            await DashboardPage.load();
        }
    } catch (error) {
        AlertManager.show('Erreur lors de l\'envoi de l\'invitation', 'error');
    }
};

window.savePreferences = async () => {
    const preferences = {
        theme: document.getElementById('pref-theme').value,
        language: document.getElementById('pref-language').value,
        notificationPref: document.getElementById('pref-notifications').value,
        connectedDevice: document.getElementById('pref-device').value
    };

    try {
        await ApiService.updateUser(preferences);
        AlertManager.show('Préférences enregistrées!', 'success');
    } catch (error) {
        AlertManager.show('Erreur lors de l\'enregistrement des préférences', 'error');
    }
};

window.viewGoal = (goalId) => {
    AlertManager.show('Fonctionnalité à venir: Vue détaillée de l\'objectif', 'info');
};

window.viewMonthlyGoal = (month) => {
    AlertManager.show(`Démarrage de l'objectif du mois ${month}`, 'info');
};

window.startMonthlyGoal = (month) => {
    AlertManager.show(`Vous avez commencé l'objectif du mois ${month}!`, 'success');
};


window.App = {
    init: async () => {
        try {

            AlertManager.init();
            PageManager.init();
            
 
            AlertManager.show('Chargement de l\'application...', 'info', 2000);
            

            const userData = await ApiService.getUser();
            AppState.user = userData.user;
            

            if (AppState.user) {
                document.getElementById('user-name').textContent = AppState.user.fullName;
                document.getElementById('user-avatar').textContent = AppState.user.fullName.charAt(0);
            }
            

            await PageManager.loadPageData('dashboard');
            

            setTimeout(() => AlertManager.clear(), 1000);
            
        } catch (error) {
            console.error('Erreur d\'initialisation:', error);
            AlertManager.show('Impossible de charger l\'application. Veuillez rafraîchir la page.', 'error');
        }
    }
};


document.addEventListener('DOMContentLoaded', () => {
 
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const profileData = {
                fullName: document.getElementById('profile-name').value,
                email: document.getElementById('profile-email').value,
                phone: document.getElementById('profile-phone').value,
                birthdate: document.getElementById('profile-birthdate').value
            };

            try {
                await ApiService.updateUser(profileData);
                AlertManager.show('Profil mis à jour avec succès!', 'success');
            } catch (error) {
                AlertManager.show('Erreur lors de la mise à jour du profil', 'error');
            }
        });
    }
});


window.utils = Utils;
window.api = ApiService;
window.alerts = AlertManager;
window.pages = PageManager;