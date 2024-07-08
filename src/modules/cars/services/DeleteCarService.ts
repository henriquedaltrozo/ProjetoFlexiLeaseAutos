import { Car } from '../models/Car';
import mongoose from 'mongoose';

class DeleteCarService {
  public async execute(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const car = await Car.findById(id);

    if (!car) {
      throw new Error('Car not found');
    }

    await car.deleteOne();
  }
}

export default DeleteCarService;
