import express from "express";
import ProcedimentoVeterinarioController from "../controllers/ProcedimentoVeterinarioController.js";

const router = express.Router();

router.get("/procedimentos-veterinarios", ProcedimentoVeterinarioController.listar);
router.get("/procedimentos-veterinarios/:id", ProcedimentoVeterinarioController.buscarPorId);
router.post("/procedimentos-veterinarios", ProcedimentoVeterinarioController.criar);
router.put("/procedimentos-veterinarios/:id", ProcedimentoVeterinarioController.atualizar);
router.delete("/procedimentos-veterinarios/:id", ProcedimentoVeterinarioController.excluir);

export default router;