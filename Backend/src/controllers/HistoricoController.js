import HistoricoModel from "../models/HistoricoModel.js";

class HistoricoController {

    static async aplicar(req, res) {
        try {
            const dados = req.body;

            if (!dados.animal_id || !dados.vacina_id || !dados.data_aplicacao) {
                return res.status(400).json({
                    error: "Animal, vacina e data são obrigatórios"
                });
            }

            const resultado = await HistoricoModel.aplicarVacina(dados);

            res.status(201).json(resultado);

        } catch (error) {
            console.error("Erro ao aplicar vacina:", error);
            res.status(500).json({ error: "Erro ao aplicar vacina" });
        }
    }

    static async listar(req, res) {
        try {
            const { animal_id } = req.params;

            const dados = await HistoricoModel.listarPorAnimal(animal_id);

            res.json(dados);

        } catch (error) {
            console.error("Erro ao listar histórico:", error);
            res.status(500).json({ error: "Erro ao listar histórico" });
        }
    }

}

export default HistoricoController;