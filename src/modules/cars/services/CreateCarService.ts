import { Car } from '../models/Car';
import { Document } from 'mongoose';

interface ICreateCarDTO {
  model: string;
  color: string;
  year: number;
  value_per_day: number;
  accessories: { description: string }[];
  number_of_passengers: number;
}

class CreateCarService {
  public async execute(data: ICreateCarDTO): Promise<Document> {
    const car = new Car(data);
    await car.save();
    return car;
  }
}

export default CreateCarService;
