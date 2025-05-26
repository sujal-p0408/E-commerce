import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import categories from './categories.js';
import products from './products.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();

    // Import categories
    const createdCategories = await Category.insertMany(categories);
    
    // Map category names to their IDs
    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    // Add category IDs to products
    const productsWithCategories = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    // Import products
    await Product.insertMany(productsWithCategories);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importData(); 