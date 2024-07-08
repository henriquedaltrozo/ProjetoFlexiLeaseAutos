import { Reserve } from '../models/Reserve';
import { parse, isValid, format } from 'date-fns';

interface IListReservesDTO {
  id_user?: string;
  id_car?: string;
  start_date?: string;
  end_date?: string;
  final_value?: number;
  limit: number;
  offset: number;
}

class ListReservesService {
  public async execute(params: IListReservesDTO): Promise<any> {
    const {
      id_user,
      id_car,
      start_date,
      end_date,
      final_value,
      limit,
      offset,
    } = params;

    const query: any = {};

    if (id_user) query.id_user = id_user;
    if (id_car) query.id_car = id_car;
    if (start_date) {
      const parsedStartDate = parse(start_date, 'dd/MM/yyyy', new Date());
      if (isValid(parsedStartDate)) {
        query.start_date = { $gte: parsedStartDate };
      } else {
        throw new Error(
          'Start date must be a valid date in the format dd/MM/yyyy',
        );
      }
    }
    if (end_date) {
      const parsedEndDate = parse(end_date, 'dd/MM/yyyy', new Date());
      if (isValid(parsedEndDate)) {
        query.end_date = { $lte: parsedEndDate };
      } else {
        throw new Error(
          'End date must be a valid date in the format dd/MM/yyyy',
        );
      }
    }
    if (final_value) query.final_value = final_value;

    const total = await Reserve.countDocuments(query);
    const reserves = await Reserve.find(query).skip(offset).limit(limit).exec();

    const formattedReserves = reserves.map(reserve => ({
      ...reserve.toObject({ versionKey: false }),
      start_date: format(reserve.start_date, 'dd/MM/yyyy'),
      end_date: format(reserve.end_date, 'dd/MM/yyyy'),
    }));

    return {
      reserves: formattedReserves,
      total,
      limit,
      offset,
      offsets: Math.ceil(total / limit),
    };
  }
}

export default ListReservesService;
