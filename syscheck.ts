import { execSync } from 'child_process';

try {
  console.log('--- Search for page.tsx or package.json ---');
  try {
    console.log(execSync('find / -name "page.tsx" 2>/dev/null').toString());
  } catch (err) {}
  
  try {
    console.log('--- Search for package.json ---');
    console.log(execSync('find / -name "package.json" 2>/dev/null').toString());
  } catch (err) {}
} catch (error: any) {
  console.error('Error:', error);
}
