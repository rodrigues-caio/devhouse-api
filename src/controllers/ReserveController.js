import Reserve from '../models/Reserve';
import User from '../models/User';
import House from '../models/House';

class ReserveController {
  async index(request, response) {
    const { user_id } = request.headers;

    const reserves = await Reserve.find({ user: user_id }).populate('house');

    return response.json(reserves);
  }

  async store(request, response) {
    const { user_id } = request.headers;
    const { house_id } = request.params;
    const { date } = request.body;

    const house = await House.findById(house_id);

    if (!house) {
      return response.status(400).json({ error: 'Casa não encontrada!' });
    }

    if (house.status !== true) {
      return response.status(400).json({ error: 'Solicitação indisponível.' });
    }

    const user = await User.findById(user_id);

    if (String(user._id) === String(house.user)) {
      return response
        .status(401)
        .json({ message: 'Solicitação não permitida.' });
    }

    const reserve = await Reserve.create({
      user: user_id,
      house: house_id,
      date,
    });

    await reserve.populate('house').populate('user').execPopulate();

    return response.json(reserve);
  }

  async destroy(request, response) {
    const { reserve_id } = request.body;

    await Reserve.findByIdAndDelete({ _id: reserve_id });

    return response.send();
  }
}

export default new ReserveController();
