import { User } from '../models/User';
import mongoose from 'mongoose';

class ShowUserService {
  public async execute(id: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const user = await User.findById(id).lean();

    if (!user) {
      throw new Error('User not found');
    }

    const { __v, ...showedUser } = user as any;
    return showedUser;
  }
}

export default ShowUserService;
