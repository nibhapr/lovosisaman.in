import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  youtubeUrl: {
    type: String,
    trim: true,
    required: false
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, date: -1 });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog; 