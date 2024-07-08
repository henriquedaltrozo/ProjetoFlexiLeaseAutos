import { Car } from '../models/Car';
import mongoose from 'mongoose';

class ShowCarService {
  public async execute(id: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const car = await Car.findById(id);

    if (!car) {
      throw new Error('Car not found');
    }

    return car;
  }
}

export default ShowCarService;
