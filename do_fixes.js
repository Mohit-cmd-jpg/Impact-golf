const fs = require('fs');
const path = require('path');

function updatePackageJson() {
  const file = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (data.dependencies) {
    if (data.dependencies.next) data.dependencies.next = "15.2.4";
    if (data.dependencies['lucide-react']) data.dependencies['lucide-react'] = "^0.475.0";
    if (data.dependencies['@supabase/auth-helpers-nextjs']) {
      delete data.dependencies['@supabase/auth-helpers-nextjs'];
      data.dependencies['@supabase/ssr'] = "^0.6.1";
    } else if (data.dependencies['@supabase/ssr'] === undefined) {
        data.dependencies['@supabase/ssr'] = "^0.6.1";
    }
  }
  
  if (!data.scripts) data.scripts = {};
  data.scripts.lint = "next lint";
  data.scripts.typecheck = "tsc --noEmit";
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function updateTailwind() {
  const twFile = path.join(process.cwd(), 'tailwind.config.ts');
  if (fs.existsSync(twFile)) fs.unlinkSync(twFile);
  
  const globalsCss = path.join(process.cwd(), 'app', 'globals.css');
  const cssContent = `@import "tailwindcss";

@theme {
  --color-bg-primary: #0e0e0e;
  --color-surface: #0e0e0e;
  --color-surface-container: #1a1a1a;
  --color-surface-container-low: #131313;
  --color-surface-container-high: #20201f;
  --color-surface-container-highest: #262626;
  --color-primary-container: #cafd00;
  --color-primary-fixed: #cafd00;
  --color-on-primary-fixed: #3a4a00;
  --color-primary: #f3ffca;
  --color-on-surface: #ffffff;
  --color-on-surface-variant: #adaaaa;
  --color-error: #ff7351;
  --color-outline-variant: #484847;

  --font-headline: var(--font-manrope), sans-serif;
  --font-body: var(--font-inter), sans-serif;

  --shadow-neon: 0 0 30px rgba(202, 253, 0, 0.3);
  --shadow-neon-lg: 0 0 60px rgba(202, 253, 0, 0.4);

  --animate-marquee: marquee 25s linear infinite;

  --background-image-impact-gradient: linear-gradient(45deg, #cafd00, #f3ffca);
}

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

@utility text-shadow-neon {
  text-shadow: 0 0 15px rgba(202, 253, 0, 0.8);
}

@utility glass-bg {
  backdrop-filter: blur(12px);
  background-color: rgba(14, 14, 14, 0.6);
}

@utility glass-panel {
  backdrop-filter: blur(48px);
  background-color: rgba(38, 38, 38, 0.6);
}
`;
  if (!fs.existsSync(path.dirname(globalsCss))) fs.mkdirSync(path.dirname(globalsCss), { recursive: true });
  fs.writeFileSync(globalsCss, cssContent);

  const postcssContent = `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};`;
  const postcssFile = path.join(process.cwd(), 'postcss.config.mjs');
  fs.writeFileSync(postcssFile, postcssContent);
}

function processFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processFiles(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Basic shadow replace (very naive)
      const shadowRegex = /shadow-\[([^\]]+)\]/g;
      content = content.replace(shadowRegex, (match, p1) => {
        if (p1.includes('_') && !p1.includes('url')) {
          changed = true;
          return `shadow-[${p1.replace(/_/g, ' ')}]`;
        }
        return match;
      });
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

function createEnv() {
  const content = `Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=
Resend
RESEND_API_KEY=
App
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_SECRET_KEY=`;
  fs.writeFileSync(path.join(process.cwd(), '.env.local.example'), content);
}

function createEslint() {
  const content = `import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;`;
  fs.writeFileSync(path.join(process.cwd(), 'eslint.config.mjs'), content);
}

function createCI() {
  const content = `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
    env:
      NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: \${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: \${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
      NEXT_PUBLIC_APP_URL: http://localhost:3000`;
  const dir = path.join(process.cwd(), '.github', 'workflows');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'ci.yml'), content);
}

function createAgents() {
  const content = `# Impact Golf — Agent Notes

This is a standard Next.js 15 App Router project with Tailwind v4, Supabase SSR, and Stripe.

- Run \`npm run dev\` to start locally
- Copy \`.env.local.example\` to \`.env.local\` and fill in your keys before running
- All custom Tailwind tokens are defined in \`app/globals.css\` using \`@theme\``;
  fs.writeFileSync(path.join(process.cwd(), 'AGENTS.md'), content);
}

try {
  updatePackageJson();
  updateTailwind();
  processFiles(path.join(process.cwd(), 'app'));
  createEnv();
  createEslint();
  createCI();
  createAgents();
  console.log("Done");
} catch(e) {
  console.error(e);
}
