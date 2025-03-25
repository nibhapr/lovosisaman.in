import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: String
  }
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File; 