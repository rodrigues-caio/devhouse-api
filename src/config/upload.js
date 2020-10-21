import multer from 'multer';
import path from 'path';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) => {
      const extensao = path.extname(file.originalname);
      const name = path.basename(file.originalname, extensao);

      callback(null, `${name}-${Date.now()}${extensao}`);
    },
  }),
};
