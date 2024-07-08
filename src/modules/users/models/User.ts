import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  birth: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cep: { type: String, required: true },
  qualified: { type: String, required: true },
  patio: { type: String, default: 'N/A' },
  complement: { type: String, default: 'N/A' },
  neighborhood: { type: String, default: 'N/A' },
  locality: { type: String, default: 'N/A' },
  uf: { type: String, default: 'N/A' },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8);
  next();
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
