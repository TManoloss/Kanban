import { Router } from 'express';
import { register, login } from '../controllers/auth'
import { validateLogin, validateRegister } from '../middleware/validation'
const router = Router();

router.post("/login", (req, res, next) => {
  login(req, res).catch(next);
});
router.post("/register", (req, res, next) => { register(req, res).catch(next);});

export default router;