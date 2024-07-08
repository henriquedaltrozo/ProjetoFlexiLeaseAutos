import { Reserve } from '../models/Reserve';
import mongoose from 'mongoose';

class ShowReserveService {
  public async execute(id: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const reserve = await Reserve.findById(id);

    if (!reserve) {
      throw new Error('Reserve not found');
    }

    return reserve.toObject({ versionKey: false });
  }
}

export default ShowReserveService;
