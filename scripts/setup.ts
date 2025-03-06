import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const uploadDir = join(process.cwd(), 'public', 'uploads');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
  writeFileSync(join(uploadDir, '.gitkeep'), '');
  console.log('Created uploads directory');
} 