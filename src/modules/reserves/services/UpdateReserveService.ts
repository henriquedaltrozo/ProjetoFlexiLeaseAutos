import { Reserve } from '../models/Reserve';
import { User } from '../../users/models/User';
import { Car } from '../../cars/models/Car';
import mongoose from 'mongoose';
import { parse } from 'date-fns';

interface IUpdateReserveDTO {
  start_date?: string;
  end_date?: string;
  id_car?: string;
  id_user?: string;
}

class UpdateReserveService {
  public async execute(id: string, data: IUpdateReserveDTO): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const reserve = await Reserve.findById(id);
    if (!reserve) {
      throw new Error('Reserve not found');
    }

    const startDate = data.start_date
      ? parse(data.start_date, 'dd/MM/yyyy', new Date())
      : reserve.start_date;
    if (data.start_date && isNaN(startDate.getTime())) {
      throw new Error(
        'Start date must be a valid date in the format dd/MM/yyyy',
      );
    }

    const endDate = data.end_date
      ? parse(data.end_date, 'dd/MM/yyyy', new Date())
      : reserve.end_date;
    if (data.end_date && isNaN(endDate.getTime())) {
      throw new Error('End date must be a valid date in the format dd/MM/yyyy');
    }

    const id_car = data.id_car
      ? new mongoose.Types.ObjectId(data.id_car)
      : reserve.id_car;

    const id_user = data.id_user
      ? new mongoose.Types.ObjectId(data.id_user)
      : reserve.id_user;

    const user = await User.findById(id_user);
    if (!user || user.qualified !== 'sim') {
      throw new Error('User must be qualified to make a reservation');
    }

    const existingCarReserve = await Reserve.findOne({
      id_car: id_car,
      _id: { $ne: id },
      $or: [
        { start_date: { $lte: endDate, $gte: startDate } },
        { end_date: { $lte: endDate, $gte: startDate } },
      ],
    });
    if (existingCarReserve) {
      throw new Error('Car is already reserved for the selected dates');
    }

    const existingUserReserve = await Reserve.findOne({
      id_user: id_user,
      _id: { $ne: id },
      $or: [
        { start_date: { $lte: endDate, $gte: startDate } },
        { end_date: { $lte: endDate, $gte: startDate } },
      ],
    });
    if (existingUserReserve) {
      throw new Error('User already has a reservation for the selected dates');
    }

    const car = await Car.findById(id_car);
    if (!car) {
      throw new Error('Car not found');
    }

    const dayDifference = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    );
    const final_value = dayDifference * car.value_per_day;

    reserve.start_date = startDate;
    reserve.end_date = endDate;
    reserve.id_car = id_car;
    reserve.id_user = id_user;
    reserve.final_value = final_value;

    await reserve.save();

    const { final_value: _, ...updatedReserve } =
      reserve.toObject({ versionKey: false });

    return updatedReserve;
  }
}

export default UpdateReserveService;
