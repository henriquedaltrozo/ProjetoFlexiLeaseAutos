import { User } from '../models/User';
import axios from 'axios';
import { parse } from 'date-fns';

interface ICreateUserDTO {
  name: string;
  cpf: string;
  birth: string;
  email: string;
  password: string;
  cep: string;
  qualified: string;
}

class CreateUserService {
  public async execute(data: ICreateUserDTO): Promise<any> {
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

    const user = new User({
      ...data,
      birth: birthDate,
      qualified: data.qualified === 'sim' ? 'sim' : 'não',
      ...userAddress,
    });

    await user.save();

    const createdUser = user.toObject({ versionKey: false });
    createdUser.password = data.password;

    return createdUser;
  }
}

export default CreateUserService;
