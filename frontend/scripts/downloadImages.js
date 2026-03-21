import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    url: 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg',
    filename: 'slide1.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/2590716/pexels-photo-2590716.jpeg',
    filename: 'slide2.jpg'
  },
  {
    url: 'https://images.pexels.com/photos/93398/pexels-photo-93398.jpeg',
    filename: 'slide3.jpg'
  }
];

const assetsDir = path.join(__dirname, '../src/assets/images');

async function downloadImages() {
  // Create assets directory if it doesn't exist
  await fs.mkdir(assetsDir, { recursive: true });

  // Download each image
  for (const { url, filename } of images) {
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      await fs.writeFile(path.join(assetsDir, filename), buffer);
      console.log(`Downloaded ${filename}`);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error.message);
    }
  }
}

downloadImages().catch(console.error); 