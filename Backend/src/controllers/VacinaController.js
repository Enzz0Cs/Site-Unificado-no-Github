import VacinaModel from "../models/VacinaModel.js";

class VacinaController {

    static async listar(req, res) {
        try {
            const { termo } = req.query;
            let vacinas;

            if (termo) {
                vacinas = await VacinaModel.filtrar(termo);
            } else {
                vacinas = await VacinaModel.listarTodos();
            }

            res.status(200).json(vacinas);
        } catch (error) {
            console.error('Erro ao listar vacinas:', error);
            res.status(500).json({ error: 'Erro ao buscar vacinas no sistema.' });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const vacina = await VacinaModel.buscarPorId(id);

            if (!vacina) {
                return res.status(404).json({ error: 'Vacina não encontrada.' });
            }

            res.status(200).json(vacina);
        } catch (error) {
            console.error('Erro ao buscar vacina por ID:', error);
            res.status(500).json({ error: 'Erro interno ao buscar vacina.' });
        }
    }

    static async criar(req, res) {
        try {
            const { CodigoVacina, NomeVacina } = req.body;
            if (!CodigoVacina || !NomeVacina) {
                return res.status(400).json({
                    error: 'Todos os campos (Código e Nome da Vacina) devem ser preenchidos.'
                });
            }

            const dadosVacina = {
                CodigoVacina,
                NomeVacina
            };

            const novaVacina = await VacinaModel.criar(dadosVacina);
            res.status(201).json(novaVacina);

        } catch (error) {
            console.error('Erro ao cadastrar vacina:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "Já existe uma vacina cadastrada com este código." });
            }
            res.status(500).json({ error: 'Erro ao criar cadastro da vacina.' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { CodigoVacina, NomeVacina } = req.body;

            if (!CodigoVacina || !NomeVacina) {
                return res.status(400).json({
                    error: 'Todos os campos (Código e Nome da Vacina) devem ser preenchidos para atualização.'
                });
            }

            const dadosVacina = {
                CodigoVacina,
                NomeVacina
            };

            const vacinaAtualizada = await VacinaModel.atualizar(id, dadosVacina);

            if (!vacinaAtualizada) {
                return res.status(404).json({ error: 'Vacina não encontrada para atualização.' });
            }

            res.status(200).json(vacinaAtualizada);
        } catch (error) {
            console.error('Erro ao atualizar vacina:', error);
            res.status(500).json({ error: 'Erro ao atualizar dados da vacina.' });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await VacinaModel.excluir(id);

            if (!sucesso) {
                return res.status(404).json({ error: 'Vacina não encontrada para exclusão.' });
            }

            res.status(200).json({ message: 'Vacina excluída com sucesso!' });
        } catch (error) {
            console.error('Erro ao excluir vacina:', error);
            if (error.code && error.code.includes('ROW_IS_REFERENCED')) {
                return res.status(409).json({ error: "Não é possível excluir: Esta vacina já foi aplicada em animais." });
            }
            res.status(500).json({ error: 'Erro interno ao excluir vacina.' });
        }
    }
}

export default VacinaController;