import { User } from '../models/User';
import axios from 'axios';
import mongoose from 'mongoose';
import { parse } from 'date-fns';

interface IUpdateUserDTO {
  name?: string;
  cpf?: string;
  birth?: string;
  email?: string;
  password?: string;
  cep?: string;
  qualified?: string;
}

class UpdateUserService {
  public async execute(id: string, data: IUpdateUserDTO): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (data.birth) {
      const birthDate = parse(data.birth, 'dd/MM/yyyy', new Date());
      if (isNaN(birthDate.getTime())) {
        throw new Error(
          'Birth date must be a valid date in the format dd/MM/yyyy',
        );
      }

      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        throw new Error('User must be at least 18 years old');
      }
      user.birth = birthDate;
    }

    if (data.cep) {
      const response = await axios.get(
        `https://viacep.com.br/ws/${data.cep}/json`,
      );
      const {
        logradouro: patio,
        complemento: complement,
        bairro: neighborhood,
        localidade: locality,
        uf,
      } = response.data;

      const userAddress = {
        patio: patio || 'N/A',
        complement: complement || 'N/A',
        neighborhood: neighborhood || 'N/A',
        locality: locality || 'N/A',
        uf: uf || 'N/A',
      };

      Object.assign(user, userAddress);
    }

    if (data.qualified) {
      user.qualified = data.qualified === 'sim' ? 'sim' : 'não';
    }

    const { birth, ...otherData } = data;
    Object.assign(user, otherData);

    const plainPassword = data.password || user.password;
    await user.save();

    const updatedUser = user.toObject({ versionKey: false });
    updatedUser.password = plainPassword;

    return updatedUser;
  }
}

export default UpdateUserService;
