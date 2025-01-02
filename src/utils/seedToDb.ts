import {seedproductstoDB} from '../../prisma/seed';

seedproductstoDB(data)
  .then(() => console.log('db migrada con suceso'))
  .catch(err => console.log('Hubo un problema en alimentar la db', err));
