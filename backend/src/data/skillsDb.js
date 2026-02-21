const skillsDb = {
  programming: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby',
    'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'haskell', 'elixir',
    'dart', 'groovy', 'lua', 'fortran', 'cobol', 'assembly'
  ],
  frontend: [
    'react', 'react.js', 'reactjs', 'vue', 'vue.js', 'vuejs', 'angular', 'next.js', 'nextjs',
    'nuxt', 'svelte', 'html', 'html5', 'css', 'css3', 'scss', 'sass', 'less',
    'tailwind', 'tailwindcss', 'bootstrap', 'material-ui', 'mui', 'chakra ui',
    'webpack', 'vite', 'parcel', 'babel', 'redux', 'zustand', 'mobx', 'recoil',
    'graphql', 'apollo', 'framer motion', 'three.js', 'webgl', 'd3.js', 'chart.js'
  ],
  backend: [
    'node.js', 'nodejs', 'express', 'fastapi', 'django', 'flask', 'spring boot', 'spring',
    'rails', 'laravel', 'nestjs', 'koa', 'hapi', 'gin', 'echo', 'fiber',
    'rest api', 'restful', 'graphql', 'grpc', 'microservices', 'serverless',
    'websockets', 'socket.io', 'kafka', 'rabbitmq', 'redis', 'celery'
  ],
  databases: [
    'postgresql', 'postgres', 'mysql', 'mongodb', 'sqlite', 'oracle', 'sql server',
    'cassandra', 'dynamodb', 'firebase', 'supabase', 'redis', 'elasticsearch',
    'neo4j', 'couchdb', 'influxdb', 'cockroachdb', 'sql', 'nosql',
    'orm', 'sequelize', 'prisma', 'mongoose', 'hibernate', 'typeorm'
  ],
  cloud: [
    'aws', 'amazon web services', 'azure', 'google cloud', 'gcp', 'heroku', 'vercel',
    'netlify', 'digitalocean', 'cloudflare', 'linode', 'docker', 'kubernetes', 'k8s',
    'terraform', 'ansible', 'jenkins', 'gitlab ci', 'github actions', 'circleci',
    'prometheus', 'grafana', 'datadog', 'new relic', 's3', 'ec2', 'lambda', 'ecs', 'eks'
  ],
  ai_ml: [
    'machine learning', 'deep learning', 'neural networks', 'tensorflow', 'pytorch',
    'keras', 'scikit-learn', 'sklearn', 'pandas', 'numpy', 'opencv', 'nlp',
    'natural language processing', 'computer vision', 'reinforcement learning',
    'transformer', 'bert', 'gpt', 'llm', 'langchain', 'hugging face', 'mlops',
    'data science', 'data analysis', 'data visualization', 'tableau', 'power bi',
    'statistics', 'regression', 'classification', 'clustering', 'xgboost', 'random forest'
  ],
  mobile: [
    'react native', 'flutter', 'android', 'ios', 'swift', 'kotlin', 'objective-c',
    'expo', 'cordova', 'ionic', 'xamarin', 'unity', 'unreal engine', 'pwa'
  ],
  devops: [
    'git', 'github', 'gitlab', 'bitbucket', 'ci/cd', 'docker', 'kubernetes',
    'terraform', 'ansible', 'chef', 'puppet', 'nginx', 'apache', 'linux',
    'bash', 'shell scripting', 'devops', 'sre', 'monitoring', 'logging', 'agile', 'scrum'
  ],
  security: [
    'cybersecurity', 'penetration testing', 'ethical hacking', 'owasp', 'ssl', 'tls',
    'oauth', 'jwt', 'authentication', 'authorization', 'encryption', 'sso',
    'vulnerability assessment', 'soc', 'siem', 'nist', 'iso 27001'
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'project management', 'agile', 'scrum', 'kanban', 'time management',
    'presentation', 'collaboration', 'mentoring', 'analytical', 'adaptability',
    'attention to detail', 'creativity', 'innovation', 'negotiation', 'stakeholder management'
  ]
};

const allSkills = Object.values(skillsDb).flat();

const educationLevels = {
  'phd': 5, 'doctorate': 5, 'ph.d': 5,
  'masters': 4, 'master': 4, 'm.s': 4, 'm.sc': 4, 'mba': 4, 'me': 4, 'm.tech': 4,
  'bachelor': 3, 'b.s': 3, 'b.sc': 3, 'b.tech': 3, 'b.e': 3, 'be': 3, 'btech': 3, 'undergraduate': 3,
  'associate': 2, 'diploma': 2,
  'high school': 1, 'secondary': 1
};

const experienceDomains = {
  'software engineer': ['software', 'developer', 'engineer', 'programmer', 'coder'],
  'data scientist': ['data science', 'machine learning', 'ai', 'analytics', 'data analyst'],
  'devops engineer': ['devops', 'infrastructure', 'cloud', 'sre', 'platform'],
  'product manager': ['product', 'product management', 'pm', 'product owner'],
  'designer': ['ui', 'ux', 'design', 'figma', 'product design'],
  'manager': ['manager', 'lead', 'director', 'head', 'vp', 'chief', 'cto', 'ceo']
};

module.exports = { skillsDb, allSkills, educationLevels, experienceDomains };
