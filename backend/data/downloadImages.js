import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    filename: 'headphones.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    filename: 'smartwatch.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    filename: 'shirt.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    filename: 'shoes.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1570486916327-35f98c3e2988',
    filename: 'coffee-maker.jpg'
  }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const filepath = path.join(uploadsDir, filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
};

const downloadAllImages = async () => {
  try {
    for (const image of images) {
      await downloadImage(image.url, image.filename);
    }
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

downloadAllImages(); 