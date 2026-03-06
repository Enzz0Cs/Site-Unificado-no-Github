import express from 'express';
import VacinaController from '../controllers/VacinaController.js';

const router = express.Router();

router.get('/vacinas', VacinaController.listar);
router.get('/vacinas/busca', VacinaController.listar);
router.get('/vacinas/:id', VacinaController.buscarPorId);
router.post('/vacinas', VacinaController.criar);
router.put('/vacinas/:id', VacinaController.atualizar);
router.delete('/vacinas/:id', VacinaController.excluir);

export default router;