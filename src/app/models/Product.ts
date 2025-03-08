import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  categoryId: { type: String, required: true },
  subcategoryId: { type: String, required: true },
  images: [String],
  features: [String],
  specifications: { type: Map, of: String },
  catalogPdf: String,
  catalogExcel: String
}, { timestamps: true });

// Add indexes for better query performance
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ categoryId: 1, subcategoryId: 1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product; 