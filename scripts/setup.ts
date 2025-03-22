import { mkdir } from 'fs/promises';
import { join } from 'path';

const createUploadDirs = async () => {
  const dirs = ['images', 'pdfs', 'excel'];
  const baseDir = join(process.cwd(), 'public', 'uploads');
  
  for (const dir of dirs) {
    const fullPath = join(baseDir, dir);
    await mkdir(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
};

createUploadDirs().catch(console.error); 