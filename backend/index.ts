import express from 'express';
import dotenv from 'dotenv';
import router from './routes/auth';

dotenv.config();

const app = express();
app.use(express.json());

// Rotas
app.use('/auth', router);

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});