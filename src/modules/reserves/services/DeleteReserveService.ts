import { Reserve } from '../models/Reserve';
import mongoose from 'mongoose';

class DeleteReserveService {
  public async execute(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const reserve = await Reserve.findById(id);

    if (!reserve) {
      throw new Error('Reserve not found');
    }

    await reserve.deleteOne();
  }
}

export default DeleteReserveService;
