// Theme management
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

// Storage Helpers
const Storage = {
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
    if (list.includes(title)) list = list.filter(t => t !== title);
    else if (list.length < 3) list.push(title);
    localStorage.setItem('career_path_comparison', JSON.stringify(list));
    return list;
  },
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
    if (steps.includes(stepOrder)) steps = steps.filter(s => s !== stepOrder);
    else steps.push(stepOrder);
    localStorage.setItem(key, JSON.stringify(steps));
    return steps;
  }
};

// Toast notification helper
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2 transition-all duration-300 fade-in-up ${
    type === 'success'
      ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
      : type === 'error'
      ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20'
      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700 shadow-black/20'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
});
