const fs = require('fs');
const categories = {
  'Software & Development': ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Mobile App Developer', 'Game Developer', 'Software Engineer', 'DevOps Engineer', 'Embedded Systems Engineer', 'Blockchain Developer', 'AR/VR Developer'],
  'Artificial Intelligence & Data Science': ['AI Engineer', 'Machine Learning Engineer', 'Deep Learning Engineer', 'Data Scientist', 'Data Analyst', 'Business Intelligence Analyst', 'NLP Engineer', 'Computer Vision Engineer', 'Robotics Engineer', 'Prompt Engineer'],
  'Cybersecurity': ['Cybersecurity Analyst', 'Ethical Hacker', 'Penetration Tester', 'SOC Analyst', 'Security Engineer', 'Digital Forensics Expert', 'Cloud Security Engineer', 'Information Security Analyst'],
  'Cloud Computing': ['Cloud Engineer', 'Cloud Architect', 'AWS Engineer', 'Azure Engineer', 'Google Cloud Engineer', 'Site Reliability Engineer (SRE)'],
  'Networking': ['Network Engineer', 'Network Administrator', 'System Administrator', 'Telecom Engineer'],
  'UI/UX & Design': ['UI Designer', 'UX Designer', 'Product Designer', 'Graphic Designer', 'Motion Graphics Designer', 'Animator'],
  'Business & Management': ['Business Analyst', 'Product Manager', 'Project Manager', 'Operations Manager', 'HR Manager', 'Marketing Manager', 'Sales Manager'],
  'Finance & Accounting': ['Chartered Accountant', 'Financial Analyst', 'Investment Banker', 'Tax Consultant', 'Auditor', 'Risk Analyst'],
  'Healthcare': ['Doctor', 'Dentist', 'Pharmacist', 'Nurse', 'Physiotherapist', 'Medical Lab Technician', 'Nutritionist', 'Psychologist'],
  'Engineering': ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Electronics Engineer', 'Aerospace Engineer', 'Automobile Engineer', 'Chemical Engineer', 'Petroleum Engineer'],
  'Government Jobs': ['IAS', 'IPS', 'IFS', 'SSC Officer', 'Banking Officer', 'Railway Officer', 'Defence Officer', 'Police Officer', 'Postal Officer'],
  'Research & Education': ['Professor', 'Lecturer', 'Research Scientist', 'School Teacher', 'Educational Consultant'],
  'Law': ['Lawyer', 'Judge', 'Legal Advisor', 'Corporate Lawyer', 'Public Prosecutor'],
  'Digital Marketing': ['SEO Specialist', 'SEM Specialist', 'Social Media Manager', 'Content Strategist', 'Brand Manager', 'Email Marketing Specialist'],
  'Content & Media': ['Content Writer', 'Technical Writer', 'Copywriter', 'Journalist', 'News Anchor', 'Video Editor', 'Photographer', 'Cinematographer'],
  'Entrepreneurship': ['Startup Founder', 'Business Owner', 'Franchise Owner', 'E-commerce Seller'],
  'Creative Arts': ['Musician', 'Singer', 'Actor', 'Dancer', 'Fashion Designer', 'Interior Designer'],
  'Agriculture & Environment': ['Agricultural Scientist', 'Agronomist', 'Environmental Engineer', 'Forestry Officer', 'Wildlife Biologist'],
  'Hospitality & Tourism': ['Hotel Manager', 'Chef', 'Event Manager', 'Travel Consultant', 'Airline Cabin Crew'],
  'Sports & Fitness': ['Athlete', 'Fitness Trainer', 'Sports Coach', 'Sports Nutritionist', 'Sports Psychologist'],
  'Emerging Technologies': ['Quantum Computing Engineer', 'IoT Engineer', 'Edge Computing Engineer', 'Web3 Developer', 'AI Product Manager', 'AI Research Scientist']
};

let dbEntries = '';
let kwEntries = '';
let allRoles = [];

for (const [cat, roles] of Object.entries(categories)) {
  for (const role of roles) {
    if (role === 'Software Developer' || role === 'Data Analyst' || role === 'UX/UI Designer' || role === 'Digital Marketer' || role === 'Product Manager' || role === 'Content Writer / Creator' || role === 'Cybersecurity Analyst' || role === 'Healthcare / Allied Health' || role === 'Teacher / Educator' || role === 'Graphic Designer' || role === 'Financial Analyst' || role === 'Project Manager' || role === 'Human Resources Specialist') {
      continue;
    }
    allRoles.push(role);
    
    dbEntries += `
  "${role}": {
    description: "A rewarding career in ${cat} as a ${role}.",
    simpleSummary: "You will work as a ${role} in the ${cat} industry.",
    skills: ["${cat.replace(/&/g, 'and')} Fundamentals", "Problem Solving", "Communication"],
    learningPath: [
      { order: 1, title: "Learn fundamentals", description: "Understand the basics of ${role}.", procedure: ["Research ${role} fundamentals.", "Take introductory courses."], duration: "2-3 months", resources: ["Coursera", "YouTube"] },
      { order: 2, title: "Develop core skills", description: "Practice ${cat.replace(/&/g, 'and')} skills.", procedure: ["Work on small projects.", "Join communities."], duration: "3-4 months", resources: ["Online forums", "Workshops"] },
      { order: 3, title: "Build a portfolio", description: "Showcase your ${role} projects.", procedure: ["Create 2-3 detailed projects."], duration: "2 months", resources: ["GitHub/Behance/Portfolio site"] },
      { order: 4, title: "Apply for roles", description: "Start interviewing.", procedure: ["Update resume.", "Apply for junior/entry-level positions."], duration: "Ongoing", resources: ["LinkedIn", "Indeed"] }
    ],
    timeline: "6-12 months",
    salaryRange: "Entry: $40k-$70k | Mid: $70k-$120k"
  },`;
  
    const kwString = cat.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(' ').filter(x=>x.length>3).join('", "');
    kwEntries += `
  "${role}": ["${role.toLowerCase()}", "${kwString}"],`;
  }
}

let careerEngine = fs.readFileSync('src/lib/career-engine.ts', 'utf8');
careerEngine = careerEngine.replace(/};\n\nfunction normalize/, dbEntries + '\n};\n\nfunction normalize');
careerEngine = careerEngine.replace(/};\n\nfunction tokenize/, kwEntries + '\n};\n\nfunction tokenize');
fs.writeFileSync('src/lib/career-engine.ts', careerEngine);

let suggestions = fs.readFileSync('src/lib/suggestions.ts', 'utf8');
const searchStr = 'export const DREAM_ROLE_SUGGESTIONS = [';
const insertIdx = suggestions.indexOf(searchStr) + searchStr.length;
const newSuggestions = `\n  ${allRoles.map(r => '"' + r + '"').join(', ')},` + suggestions.slice(insertIdx);
suggestions = suggestions.slice(0, insertIdx) + newSuggestions;
fs.writeFileSync('src/lib/suggestions.ts', suggestions);

console.log('Added ' + allRoles.length + ' careers');
