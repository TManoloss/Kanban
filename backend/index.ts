import express from 'express';
import dotenv from 'dotenv';
import router from './routes/auth';
import routerKanban from './routes/kanban'
import cors from 'cors';



dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rotas
app.use('/auth', router);
app.use('/boards',routerKanban )
app.use('/columns/order', routerKanban)
app.use('/tasks', routerKanban)
app.use('/tasks/position', routerKanban)

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});