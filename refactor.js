const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

code = code.replace(
  /import \{ getStoredProfile, getStoredRecommendations, getStoredFavorites \} from "@\/lib\/storage";/,
  `import { getStoredProfile, getStoredRecommendations, getStoredFavorites } from "@/lib/storage";\nimport { getCategorizedCareers } from "@/lib/career-engine";`
);

code = code.replace(
  /const \[favorites, setFavorites\] = useState<string\[\]>\(\[\]\);/,
  `const [favorites, setFavorites] = useState<string[]>([]);\n  const [categories, setCategories] = useState<Record<string, {title: string, description: string}[]>>({});\n  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);`
);

code = code.replace(
  /setFavorites\(getStoredFavorites\(\)\);\n  \}, \[\]\);/,
  `setFavorites(getStoredFavorites());\n    setCategories(getCategorizedCareers());\n  }, []);`
);

const startMarker = '{!(recommendations && recommendations.length > 0) && (';
const endMarker = '<div className="mt-10 text-center">';
const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = `
        {/* Dashboard Overview Section */}
        <section className="mb-12 flex flex-col lg:flex-row gap-6">
          {/* Analytics Header */}
          <div className="flex-1 glass-panel rounded-3xl p-6 border border-white/60 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-600" />
              Profile Completeness
            </h2>
            <div className="flex flex-wrap justify-around gap-6">
              <CircularStat
                label="Academics"
                percent={(academicScore / academicMax) * 100}
                color="text-primary-500"
                icon={GraduationCap}
                detail={profile.academics.educationLevel || profile.academics.subjects[0] || "Not set"}
                onClick={() => setDetailPanel("academics")}
              />
              <CircularStat
                label="Interests"
                percent={interestScore}
                color="text-emerald-500"
                icon={Heart}
                detail={profile.interests.interests[0] || profile.interests.hobbies[0] || "Not set"}
                onClick={() => setDetailPanel("interests")}
              />
              <CircularStat
                label="Aspirations"
                percent={(aspirationScore / aspirationMax) || 0}
                color="text-amber-500"
                icon={Target}
                detail={profile.aspirations.dreamRoles[0] || "Not set"}
                onClick={() => setDetailPanel("aspirations")}
              />
            </div>
          </div>

          {/* Action / Suggestions Panel */}
          <div className="w-full lg:w-1/3 glass-panel rounded-3xl p-6 border border-white/60 shadow-lg flex flex-col justify-center text-center">
            <Sparkles className="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Career Engine
            </h2>
            <p className="text-sm text-slate-600 mb-5">
              {recommendations && recommendations.length > 0
                ? "Your profile has been analyzed. Update your profile to get new insights."
                : "Match your profile to career paths and receive a structured learning plan."}
            </p>
            <button
              type="button"
              onClick={generateRecommendations}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-60 transition shadow-md"
            >
              {loading ? (
                "Generating..."
              ) : recommendations?.length ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Recommendations
                </>
              ) : (
                "Generate Recommendations"
              )}
            </button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            Top Recommendations for You
          </h2>

          {recommendations && recommendations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, i) => (
                <Link
                  key={rec.careerTitle}
                  href={\`/career-path?title=\${encodeURIComponent(rec.careerTitle)}\`}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group block preserve-3d"
                >
                  <div
                    className="glass-panel bg-white/80 rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary-200"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition">
                        {rec.careerTitle}
                      </h3>
                      <span className="shrink-0 rounded-full bg-primary-100 text-primary-700 px-2 py-0.5 text-xs font-medium">
                        {rec.matchScore}%
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {rec.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium">
                      View learning path
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel bg-white/60 rounded-2xl p-10 text-center border border-slate-100 border-dashed shadow-sm">
              <p className="text-slate-500">
                {loading
                  ? "Generating recommendations..."
                  : "Generate recommendations above to view personalized career paths and learning plans."}
              </p>
            </div>
          )}
        </section>

        {favorites.length > 0 && (
          <section className="mb-16">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Saved Careers
            </h2>
            <div className="flex flex-wrap gap-2">
              {favorites.map((title) => (
                <Link
                  key={title}
                  href={\`/career-path?title=\${encodeURIComponent(title)}\`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 transition"
                >
                  {title}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            Browse Careers by Category
          </h2>
          <div className="space-y-4">
            {Object.entries(categories).map(([cat, careers]) => (
              <div key={cat} className="glass-panel bg-white/70 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
                >
                  <span className="font-semibold text-slate-800">{cat} ({careers.length})</span>
                  <ChevronRight className={\`w-5 h-5 text-slate-400 transition-transform duration-300 \${expandedCategory === cat ? "rotate-90" : ""}\`} />
                </button>
                
                {expandedCategory === cat && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100/50 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {careers.map(c => (
                      <Link 
                        key={c.title} 
                        href={\`/career-path?title=\${encodeURIComponent(c.title)}\`}
                        className="block p-3 rounded-xl border border-slate-100 bg-white hover:border-primary-200 hover:shadow-sm transition group"
                      >
                        <h4 className="font-medium text-slate-800 text-sm mb-1 group-hover:text-primary-700">{c.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

`;
  code = code.slice(0, startIndex) + newContent + code.slice(endIndex);
  fs.writeFileSync('src/app/dashboard/page.tsx', code);
  console.log('Successfully updated dashboard page');
} else {
  console.log('Failed to find markers');
}
