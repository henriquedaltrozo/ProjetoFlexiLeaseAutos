import { Car } from '../models/Car';
import { Document } from 'mongoose';

interface IListCarDTO {
  model?: string;
  color?: string;
  year?: number;
  value_per_day?: number;
  number_of_passengers?: number;
  limit?: number;
  offset?: number;
}

class ListCarService {
  public async execute(query: IListCarDTO): Promise<{
    cars: Document[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0, ...filters } = query;

    const cars = await Car.find(filters).limit(limit).skip(offset).exec();

    const total = await Car.countDocuments(filters);

    return {
      cars,
      total,
      limit,
      offset,
    };
  }
}

export default ListCarService;
