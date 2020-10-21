import * as Yup from 'yup';
import User from '../models/User';

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });

    const { email } = request.body;

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Email inválido' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    return response.json(user);
  }
}

export default new SessionController();
