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

// 2. Session & Client Storage Engine (Tied strictly to website browser session)
const Storage = {
  // User Account (Session-Scoped & Cookie Synchronized)
  getUser() {
    try {
      // 1. First check server-rendered tag if present on the page
      const serverDataEl = document.getElementById('server-user-data');
      if (serverDataEl && serverDataEl.textContent.trim()) {
        const u = JSON.parse(serverDataEl.textContent);
        if (u && (u.id || u.name)) {
          sessionStorage.setItem('career_path_user', JSON.stringify(u));
          sessionStorage.setItem('career_path_session_active', '1');
          if (u.id) {
            document.cookie = `user_id=${u.id}; path=/; SameSite=Lax`;
          }
          return u;
        }
      }

      // 2. Check session storage
      const data = sessionStorage.getItem('career_path_user');
      if (data) {
        const u = JSON.parse(data);
        if (u && (u.id || u.name)) {
          if (u.id && !document.cookie.includes(`user_id=${u.id}`)) {
            document.cookie = `user_id=${u.id}; path=/; SameSite=Lax`;
          }
          return u;
        }
      }

      // 3. Check body data-user-name attribute
      const bodyName = document.body.getAttribute('data-user-name');
      if (bodyName && bodyName.trim() && bodyName.trim() !== "None") {
        const match = document.cookie.match(/(?:^|;\s*)user_id=(\d+)/);
        const u = { id: match ? parseInt(match[1]) : 1, name: bodyName.trim() };
        sessionStorage.setItem('career_path_user', JSON.stringify(u));
        sessionStorage.setItem('career_path_session_active', '1');
        return u;
      }

      // 4. Check active user_id cookie
      const match = document.cookie.match(/(?:^|;\s*)user_id=(\d+)/);
      if (match && match[1]) {
        const u = { id: parseInt(match[1]), name: (bodyName && bodyName !== "None") ? bodyName : "Professional" };
        sessionStorage.setItem('career_path_user', JSON.stringify(u));
        sessionStorage.setItem('career_path_session_active', '1');
        return u;
      }

      return null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      sessionStorage.setItem('career_path_session_active', '1');
      sessionStorage.setItem('career_path_user', JSON.stringify(user));
      if (user.id) {
        document.cookie = `user_id=${user.id}; path=/; SameSite=Lax`;
      }
      try { localStorage.removeItem('career_path_user'); } catch {}
      window.dispatchEvent(new CustomEvent('auth-change', { detail: user }));
    }
  },

  logout() {
    sessionStorage.removeItem('career_path_user');
    sessionStorage.removeItem('career_path_session_active');
    sessionStorage.removeItem('career_path_profile');
    sessionStorage.removeItem('career_path_recommendations');
    try {
      localStorage.removeItem('career_path_user');
      localStorage.removeItem('career_path_profile');
      localStorage.removeItem('career_path_recommendations');
    } catch {}
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.dispatchEvent(new CustomEvent('auth-change', { detail: null }));
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).finally(() => {
      window.location.href = '/login';
    });
  },

  // User Profile
  getProfile() {
    try {
      const data = sessionStorage.getItem('career_path_profile') || localStorage.getItem('career_path_profile');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveProfile(profile) {
    try {
      sessionStorage.setItem('career_path_profile', JSON.stringify(profile));
      localStorage.setItem('career_path_profile', JSON.stringify(profile));
      const user = this.getUser();
      if (user && user.id) {
        fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ userId: user.id, profile })
        }).catch(() => {});
      }
    } catch {}
  },

  // Career Recommendations
  getRecommendations() {
    try {
      const data = sessionStorage.getItem('career_path_recommendations') || localStorage.getItem('career_path_recommendations');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveRecommendations(recs) {
    try {
      sessionStorage.setItem('career_path_recommendations', JSON.stringify(recs));
      localStorage.setItem('career_path_recommendations', JSON.stringify(recs));
      const user = this.getUser();
      if (user && user.id) {
        fetch('/api/user/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ userId: user.id, recommendations: recs })
        }).catch(() => {});
      }
    } catch {}
  },

  // Saved Favorites
  getFavorites() {
    try {
      const data = sessionStorage.getItem('career_path_favorites') || localStorage.getItem('career_path_favorites');
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
    sessionStorage.setItem('career_path_favorites', JSON.stringify(list));
    localStorage.setItem('career_path_favorites', JSON.stringify(list));
    return list;
  },

  // Career Comparison List (Max 3)
  getComparisonList() {
    try {
      const data = sessionStorage.getItem('career_path_comparison') || localStorage.getItem('career_path_comparison');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addComparison(title) {
    let list = this.getComparisonList();
    if (list.includes(title)) {
      return { success: false, reason: "already_exists", list };
    }
    if (list.length >= 3) {
      return { success: false, reason: "limit_reached", list };
    }
    list.push(title);
    sessionStorage.setItem('career_path_comparison', JSON.stringify(list));
    localStorage.setItem('career_path_comparison', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('compare-change', { detail: list }));
    return { success: true, list };
  },

  removeComparison(title) {
    let list = this.getComparisonList();
    list = list.filter(t => t !== title);
    sessionStorage.setItem('career_path_comparison', JSON.stringify(list));
    localStorage.setItem('career_path_comparison', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('compare-change', { detail: list }));
    return list;
  },

  toggleComparison(title) {
    let list = this.getComparisonList();
    if (list.includes(title)) {
      list = list.filter(t => t !== title);
    } else {
      if (list.length >= 3) list.shift();
      list.push(title);
    }
    sessionStorage.setItem('career_path_comparison', JSON.stringify(list));
    localStorage.setItem('career_path_comparison', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('compare-change', { detail: list }));
    return list;
  },

  clearComparison() {
    sessionStorage.removeItem('career_path_comparison');
    localStorage.removeItem('career_path_comparison');
    window.dispatchEvent(new CustomEvent('compare-change', { detail: [] }));
  },

  // Milestone Step Progress
  getStepProgress(careerTitle) {
    try {
      const key = `career_path_progress_${careerTitle}`;
      const data = sessionStorage.getItem(key) || localStorage.getItem(key);
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
    sessionStorage.setItem(key, JSON.stringify(steps));
    localStorage.setItem(key, JSON.stringify(steps));

    const user = this.getUser();
    if (user && user.id) {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ userId: user.id, careerTitle, stepOrder })
      }).catch(() => {});
    }
    return steps;
  },

  getAllProgress() {
    const progressMap = {};
    const sources = [sessionStorage, localStorage];
    sources.forEach(storage => {
      try {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && key.startsWith('career_path_progress_')) {
            const title = key.replace('career_path_progress_', '');
            try {
              progressMap[title] = JSON.parse(storage.getItem(key) || '[]');
            } catch {}
          }
        }
      } catch {}
    });
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
        <a href="/profile" class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-primary-400 transition btn-3d">
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
        <a href="/login" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition btn-3d">
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

// 6. Seamless Navigation Check
function checkAuthState() {
  const path = window.location.pathname;
  const user = Storage.getUser();
  
  // If user is already authenticated and visits /login or /register, forward to dashboard
  if ((path === '/login' || path === '/register') && user && user.name) {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || '/dashboard';
    window.location.replace(redirectUrl);
    return;
  }
}

window.addEventListener('auth-change', syncNavbarAuth);
document.addEventListener('DOMContentLoaded', () => {
  checkAuthState();
  syncNavbarAuth();
  if (window.lucide) window.lucide.createIcons();
});
