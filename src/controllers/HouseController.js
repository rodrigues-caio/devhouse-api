import * as Yup from 'yup';
import House from '../models/House';
import User from '../models/User';

class HouseController {
  async update(request, response) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.boolean().required(),
    });

    const { filename } = request.file;
    const { house_id } = request.params;
    const { user_id } = request.headers;
    const { description, price, location, status } = request.body;

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Falha na validação.' });
    }

    const user = await User.findById(user_id);
    const houses = await House.findById(house_id);

    if (String(user._id) !== String(houses.user)) {
      return response.status(401).json({ error: 'Não autorizado.' });
    }

    await House.updateOne(
      { _id: house_id },
      {
        user: user_id,
        thumbnail: filename,
        description,
        price,
        location,
        status,
      }
    );

    return response.send();
  }

  async index(request, response) {
    const { status } = request.query;

    const houses = await House.find({ status });

    return response.json(houses);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.boolean().required(),
    });

    const { filename } = request.file;
    const { description, price, location, status } = request.body;
    const { user_id } = request.headers;

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Falha na validação.' });
    }

    const house = await House.create({
      user: user_id,
      thumbnail: filename,
      description,
      price,
      location,
      status,
    });

    return response.json(house);
  }

  async destroy(request, response) {
    const { house_id } = request.params;
    const { user_id } = request.headers;

    const user = await User.findById(user_id);
    const houses = await House.findById(house_id);

    if (String(user._id) !== String(houses.user)) {
      return response.status(401).json({ error: 'Não autorizado.' });
    }

    await House.findByIdAndDelete({ _id: house_id });

    return response.json({ message: 'Excluída com sucesso' });
  }
}

export default new HouseController();
