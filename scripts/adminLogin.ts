import mongoose from 'mongoose';
import readline from 'readline';
import Admin from '../src/app/models/Admin';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lovosis';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function createAdmin() {
  try {
    const username = await question('Enter new admin username: ');
    const password = await question('Enter new admin password: ');

    const admin = new Admin({ username, password });
    await admin.save();
    console.log('Admin created successfully!');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

async function loginAdmin() {
  try {
    const username = await question('Username: ');
    const password = await question('Password: ');

    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found');
      return false;
    }

    const isMatch = await admin.comparePassword(password);
    if (isMatch) {
      console.log('Login successful!');
      return true;
    } else {
      console.log('Invalid password');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

async function main() {
  await connectDB();

  while (true) {
    console.log('\n1. Create Admin\n2. Login\n3. Exit');
    const choice = await question('Select an option (1-3): ');

    switch (choice) {
      case '1':
        await createAdmin();
        break;
      case '2':
        await loginAdmin();
        break;
      case '3':
        rl.close();
        mongoose.connection.close();
        console.log('Goodbye!');
        process.exit(0);
      default:
        console.log('Invalid option');
    }
  }
}

main().catch(console.error); 