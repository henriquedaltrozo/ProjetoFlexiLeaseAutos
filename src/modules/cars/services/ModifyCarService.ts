import { Car } from '../models/Car';
import mongoose from 'mongoose';

interface IModifyCarServiceDTO {
  description: string;
}

class ModifyCarService {
  public async execute(
    carId: string,
    accessoryId: string,
    data: IModifyCarServiceDTO,
  ): Promise<any> {
    if (
      !mongoose.Types.ObjectId.isValid(carId) ||
      !mongoose.Types.ObjectId.isValid(accessoryId)
    ) {
      throw new Error('Invalid ID format');
    }

    const car = await Car.findById(carId);

    if (!car) {
      throw new Error('Car not found');
    }

    const accessory = car.accessories.id(accessoryId);

    if (!accessory) {
      throw new Error('Accessory not found');
    }

    if (!data.description) {
      throw new Error('Description is required');
    }

    const existingAccessory = car.accessories.find(
      acc => acc.description === data.description,
    );

    if (existingAccessory) {
      car.accessories.pull(existingAccessory._id);
    } else {
      accessory.description = data.description;
    }

    await car.save();
    return car;
  }
}

export default ModifyCarService;
