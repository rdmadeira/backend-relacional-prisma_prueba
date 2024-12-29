import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';

const app: Application = express();
dotenv.config();
///////////////////////////////////////////////////////////////////////////
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message:
      'Para entrar en la api: Especificá una ruta completa con una entidad, formato de ruta /api/v1/<entidad>',
  });
});
app.use('/', routes);

///////////////////////////////////////////////////////////////////////////
const port = process.env.PORT;

app.listen(() => console.log('Server running on port: ', port));
