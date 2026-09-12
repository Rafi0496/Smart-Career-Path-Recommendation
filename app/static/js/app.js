// Smart Career Path - Global Client Utilities & State Management

// 1. Theme Management
(function initTheme() {
  const storedTheme = localStorage.getItem('career_path_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('career_path_theme', isDark ? 'dark' : 'light');
  if (window.lucide) window.lucide.createIcons();
}

// 2. Global Click Ripple Animator
(function initClickAnimator() {
  window.addEventListener('mousedown', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'global-click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, true);
})();

// 3. LocalStorage Engine
const Storage = {
  // User Account
  getUser() {
    try {
      const data = localStorage.getItem('career_path_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser(user) {
    localStorage.setItem('career_path_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth-change', { detail: user }));
  },
  logout() {
    localStorage.removeItem('career_path_user');
    window.dispatchEvent(new CustomEvent('auth-change', { detail: null }));
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      window.location.href = '/';
    });
  },

  // Candidate Profile
  getProfile() {
    try {
      const data = localStorage.getItem('career_path_profile');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveProfile(profile) {
    localStorage.setItem('career_path_profile', JSON.stringify(profile));
  },

  // Career Recommendations
  getRecommendations() {
    try {
      const data = localStorage.getItem('career_path_recommendations');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveRecommendations(recs) {
    localStorage.setItem('career_path_recommendations', JSON.stringify(recs));
  },

  // Saved Favorites
  getFavorites() {
    try {
      const data = localStorage.getItem('career_path_favorites');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  toggleFavorite(title) {
    const list = this.getFavorites();
    const idx = list.indexOf(title);
    if (idx > -1) list.splice(idx, 1);
    else list.push(title);
    localStorage.setItem('career_path_favorites', JSON.stringify(list));
    return list;
  },

  // Career Comparison List (Max 3)
  getComparisonList() {
    try {
      const data = localStorage.getItem('career_path_comparison');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  toggleComparison(title) {
    let list = this.getComparisonList();
    if (list.includes(title)) {
      list = list.filter(t => t !== title);
    } else {
      if (list.length >= 3) list.shift();
      list.push(title);
    }
    localStorage.setItem('career_path_comparison', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('compare-change', { detail: list }));
    return list;
  },
  clearComparison() {
    localStorage.removeItem('career_path_comparison');
    window.dispatchEvent(new CustomEvent('compare-change', { detail: [] }));
  },

  // Milestone Step Progress
  getStepProgress(careerTitle) {
    try {
      const key = `career_path_progress_${careerTitle}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  toggleStepProgress(careerTitle, stepOrder) {
    const key = `career_path_progress_${careerTitle}`;
    let steps = this.getStepProgress(careerTitle);
    if (steps.includes(stepOrder)) {
      steps = steps.filter(s => s !== stepOrder);
    } else {
      steps.push(stepOrder);
    }
    localStorage.setItem(key, JSON.stringify(steps));
    return steps;
  },
  getAllProgress() {
    const progressMap = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('career_path_progress_')) {
        const title = key.replace('career_path_progress_', '');
        try {
          progressMap[title] = JSON.parse(localStorage.getItem(key) || '[]');
        } catch {}
      }
    }
    return progressMap;
  }
};

// 4. Toast Notification
function showToast(message, type = 'info') {
  const existing = document.getElementById('global-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'global-toast';
  toast.className = `fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-300 fade-in-up ${
    type === 'success'
      ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
      : type === 'error'
      ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20'
      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700 dark:border-slate-300 shadow-black/20'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 5. Dynamic Navbar Auth Sync
function syncNavbarAuth() {
  const user = Storage.getUser();
  const authContainer = document.getElementById('navbar-auth-container');
  if (!authContainer) return;

  if (user && user.name) {
    const initial = user.name.trim().charAt(0).toUpperCase();
    authContainer.innerHTML = `
      <div class="flex items-center gap-2">
        <a href="/dashboard" class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-primary-400 transition btn-3d">
          <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
            ${initial}
          </div>
          <span class="hidden sm:inline font-semibold">${user.name}</span>
          <span class="hidden lg:inline text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-950 px-1.5 py-0.5 rounded-md">
            Profile
          </span>
        </a>
        <button type="button" onclick="Storage.logout()" class="p-2 rounded-xl border border-rose-200/80 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs sm:text-sm font-medium transition btn-3d" title="Log out">
          <i data-lucide="log-out" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <div class="flex items-center gap-2">
        <a href="/login" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition btn-3d">
          <i data-lucide="log-in" class="w-4 h-4"></i>
          <span>Login</span>
        </a>
        <a href="/register" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/25 transition btn-3d">
          <i data-lucide="user-plus" class="w-4 h-4"></i>
          <span>Register</span>
        </a>
      </div>
    `;
  }
  if (window.lucide) window.lucide.createIcons();
}

window.addEventListener('auth-change', syncNavbarAuth);
document.addEventListener('DOMContentLoaded', () => {
  syncNavbarAuth();
  if (window.lucide) window.lucide.createIcons();
});
