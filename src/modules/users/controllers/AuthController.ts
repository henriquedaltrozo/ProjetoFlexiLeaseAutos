import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { handleError } from '../../../shared/errors/HandleError';

class AuthController {
  public async authenticate(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Incorrect email/password combination');
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        throw new Error('Incorrect email/password combination');
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '12h',
        },
      );

      return res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error) {
        return handleError(res, error);
      }
      return res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
}

export default AuthController;
