import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { handleError } from '../../../shared/errors/HandleError';

class AuthController {
  public async authenticate(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      console.log('AuthController - email:', email, 'password:', password); // Adicionando log

      const user = await User.findOne({ email });

      if (!user) {
        console.log('AuthController - User not found'); // Adicionando log
        throw new Error('Incorrect email/password combination');
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        console.log('AuthController - Password does not match'); // Adicionando log
        throw new Error('Incorrect email/password combination');
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1h',
        },
      );

      console.log('AuthController - Token generated:', token); // Adicionando log

      return res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error) {
        console.log('AuthController - Error:', error.message); // Adicionando log
        return handleError(res, error);
      }
      console.log('AuthController - Unknown Error'); // Adicionando log para erro desconhecido
      return res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
}

export default AuthController;
