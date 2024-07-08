import { Car } from '../models/Car';
import mongoose from 'mongoose';

interface IUpdateCarDTO {
  model?: string;
  color?: string;
  year?: number;
  value_per_day?: number;
  accessories?: { description: string }[];
  number_of_passengers?: number;
}

class UpdateCarService {
  public async execute(id: string, data: IUpdateCarDTO): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const car = await Car.findById(id);

    if (!car) {
      throw new Error('Car not found');
    }

    if (data.accessories && data.accessories.length === 0) {
      throw new Error('At least one accessory is required');
    }

    const updatedCar = await Car.findByIdAndUpdate(id, data, { new: true });
    return updatedCar;
  }
}

export default UpdateCarService;
