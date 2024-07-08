import mongoose from 'mongoose';

const accessorySchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
  },
  { _id: true },
);

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  color: { type: String, required: true },
  year: { type: String, required: true, min: 1950, max: 2023 },
  value_per_day: { type: Number, required: true },
  accessories: {
    type: [accessorySchema],
    required: true,
    validate: {
      validator: function (accessories: { description: string }[]) {
        return (
          accessories.length > 0 &&
          new Set(accessories.map(a => a.description)).size ===
            accessories.length
        );
      },
      message:
        'Accessories must be unique and there must be at least one accessory.',
    },
  },
  number_of_passengers: { type: Number, required: true },
});

carSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Car = mongoose.model('Car', carSchema);
