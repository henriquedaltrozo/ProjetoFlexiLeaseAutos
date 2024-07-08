import mongoose from 'mongoose';

const reserveSchema = new mongoose.Schema({
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  id_car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  final_value: { type: Number },
});

reserveSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Reserve = mongoose.model('Reserve', reserveSchema);
