import { Reserve } from '../models/Reserve';
import { User } from '../../users/models/User';
import { Car } from '../../cars/models/Car';
import { parse } from 'date-fns';

interface ICreateReserveDTO {
  start_date: string;
  end_date: string;
  id_car: string;
  id_user: string;
  final_value: string;
}

class CreateReserveService {
  public async execute(data: ICreateReserveDTO): Promise<any> {
    const startDate = parse(data.start_date, 'dd/MM/yyyy', new Date());
    if (isNaN(startDate.getTime())) {
      throw new Error(
        'Birth date must be a valid date in the format dd/MM/yyyy',
      );
    }

    const endDate = parse(data.end_date, 'dd/MM/yyyy', new Date());
    if (isNaN(endDate.getTime())) {
      throw new Error(
        'Birth date must be a valid date in the format dd/MM/yyyy',
      );
    }

    const user = await User.findById(data.id_user);
    if (!user || !user.qualified) {
      throw new Error('User must be qualified to make a reservation');
    }

    const existingCarReserve = await Reserve.findOne({
      id_car: data.id_car,
      $or: [
        { start_date: { $lte: endDate, $gte: startDate } },
        { end_date: { $lte: endDate, $gte: startDate } },
      ],
    });
    if (existingCarReserve) {
      throw new Error('Car is already reserved for the selected dates');
    }

    const existingUserReserve = await Reserve.findOne({
      id_user: data.id_user,
      $or: [
        { start_date: { $lte: endDate, $gte: startDate } },
        { end_date: { $lte: endDate, $gte: startDate } },
      ],
    });
    if (existingUserReserve) {
      throw new Error('User already has a reservation for the selected dates');
    }

    const car = await Car.findById(data.id_car);
    if (!car) {
      throw new Error('Car not found');
    }

    const dayDifference =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const final_value = dayDifference * car.value_per_day;

    const reserve = new Reserve({
      ...data,
      start_date: startDate,
      end_date: endDate,
      final_value,
    });

    await reserve.save();
    const { final_value: _, ...createdReserve } =
      reserve.toObject({ versionKey: false });

    return createdReserve;
  }
}

export default CreateReserveService;
