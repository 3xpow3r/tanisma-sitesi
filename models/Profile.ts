import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  city: { type: String, required: true },
  bio: { type: String, required: true },
  whatsapp: { type: String, required: true },
  telegram: { type: String, required: true },
  photos: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);