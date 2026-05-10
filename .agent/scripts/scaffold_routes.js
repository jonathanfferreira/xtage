const fs = require('fs');
const path = require('path');

const routes = [
  // Auth
  'src/app/(auth)/login/page.tsx',
  'src/app/(auth)/register/page.tsx',
  'src/app/(auth)/layout.tsx',
  // Public
  'src/app/(public)/festival/[id]/page.tsx',
  'src/app/(public)/layout.tsx',
  // Organizer
  'src/app/(dashboard-organizador)/organizer/layout.tsx',
  'src/app/(dashboard-organizador)/organizer/page.tsx',
  'src/app/(dashboard-organizador)/organizer/festivals/page.tsx',
  'src/app/(dashboard-organizador)/organizer/financial/page.tsx',
  // School
  'src/app/(dashboard-escola)/school/layout.tsx',
  'src/app/(dashboard-escola)/school/page.tsx',
  'src/app/(dashboard-escola)/school/dancers/page.tsx',
  'src/app/(dashboard-escola)/school/invoices/page.tsx',
  // Dancer
  'src/app/(dashboard-bailarino)/dancer/layout.tsx',
  'src/app/(dashboard-bailarino)/dancer/page.tsx',
  'src/app/(dashboard-bailarino)/dancer/enroll/page.tsx',
  'src/app/(dashboard-bailarino)/dancer/invoices/page.tsx'
];

routes.forEach(route => {
  const fullPath = path.join(__dirname, '..', '..', route);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(fullPath)) {
    let content = '';
    const name = path.basename(dir);
    if (fullPath.endsWith('page.tsx')) {
      content = `export default function ${name.replace(/[^a-zA-Z]/g, '')}Page() {\n  return <div>Página ${name}</div>;\n}\n`;
    } else {
      content = `export default function ${name.replace(/[^a-zA-Z]/g, '')}Layout({ children }: { children: React.ReactNode }) {\n  return <div>{children}</div>;\n}\n`;
    }
    fs.writeFileSync(fullPath, content);
  }
});

console.log('Estrutura criada com sucesso!');
