const fs = require('fs');
const path = require('path');

async function exportCareers() {
  const { CAREER_DATABASE } = await import('../src/lib/career-engine.ts');
  const careers = [];

  for (const [title, data] of Object.entries(CAREER_DATABASE)) {
    careers.push({
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      description: data.description,
      simpleSummary: data.simpleSummary || '',
      skills: data.skills || [],
      timeline: data.timeline || '',
      salaryRange: data.salaryRange || '',
      learningPath: data.learningPath || []
    });
  }

  const outDir = path.join(__dirname, '..', 'python-service', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'careers.json');
  fs.writeFileSync(outPath, JSON.stringify(careers, null, 2), 'utf8');
  console.log(`Successfully exported ${careers.length} careers to ${outPath}`);
}

exportCareers().catch(err => {
  console.error(err);
  process.exit(1);
});
