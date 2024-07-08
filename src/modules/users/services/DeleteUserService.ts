import { User } from '../models/User';
import mongoose from 'mongoose';

class DeleteUserService {
  public async execute(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    await user.deleteOne();
  }
}

export default DeleteUserService;
