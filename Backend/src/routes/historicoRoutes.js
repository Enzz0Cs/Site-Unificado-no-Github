import express from "express";
import HistoricoController from "../controllers/HistoricoController.js";

const router = express.Router();

router.post("/historico", HistoricoController.aplicar);
router.get("/historico/:animal_id", HistoricoController.listar);

export default router;