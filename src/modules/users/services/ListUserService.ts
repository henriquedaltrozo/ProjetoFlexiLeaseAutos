import { User } from '../models/User';

class ListUsersService {
  public async execute(): Promise<any[]> {
    const users = await User.find().lean();
    return users.map(user => {
      const { __v, ...listedUser } = user as any;
      listedUser.password = user.password;
      return listedUser;
    });
  }
}

export default ListUsersService;
