import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  content2: {
    type: String,
    required: false,
  },
  content3: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  image2: {
    type: String,
    required: false,
  },
  image3: {
    type: String,
    required: false,
  },
  registrationLink: {
    type: String,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Innovation', 'Education', 'Manufacturing', 'Digital Services']
  }
}, {
  timestamps: true
});

// Add pre-save middleware to generate slug
eventSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event; 