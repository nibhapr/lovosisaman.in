import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  categoryId: { type: String, required: true },
}, { timestamps: true });

// Add index for better query performance
subcategorySchema.index({ slug: 1 }, { unique: true });
subcategorySchema.index({ categoryId: 1 }); // Add index for foreign key lookups

const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', subcategorySchema);

export default Subcategory; 