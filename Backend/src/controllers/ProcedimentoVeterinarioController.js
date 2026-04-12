import ProcedimentoVeterinarioModel from "../models/ProcedimentoVeterinarioModel.js";

class ProcedimentoVeterinarioController {
  static async listar(req, res) {
    try {
      const { animal_id } = req.query;

      let procedimentos;

      if (animal_id) {
        procedimentos = await ProcedimentoVeterinarioModel.listarPorAnimal(animal_id);
      } else {
        procedimentos = await ProcedimentoVeterinarioModel.listarTodos();
      }

      res.status(200).json(procedimentos);
    } catch (error) {
      console.error("Erro ao listar procedimentos veterinários:", error);
      res.status(500).json({ error: "Erro ao listar procedimentos veterinários." });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const procedimento = await ProcedimentoVeterinarioModel.buscarPorId(id);

      if (!procedimento) {
        return res.status(404).json({ error: "Procedimento veterinário não encontrado." });
      }

      res.status(200).json(procedimento);
    } catch (error) {
      console.error("Erro ao buscar procedimento veterinário:", error);
      res.status(500).json({ error: "Erro ao buscar procedimento veterinário." });
    }
  }

  static async criar(req, res) {
    try {
      const {
        animal_id,
        tipo,
        data_procedimento,
        descricao,
        veterinario,
        situacao,
        confirmarDuplicidade
      } = req.body;

      if (!animal_id || !tipo || !data_procedimento || !descricao || !veterinario) {
        return res.status(400).json({
          error: "Todos os campos obrigatórios devem ser preenchidos: animal, tipo, data, descrição e veterinário."
        });
      }

      const duplicado = await ProcedimentoVeterinarioModel.verificarDuplicidade({
        animal_id,
        tipo,
        data_procedimento,
        descricao
      });

      if (duplicado && !confirmarDuplicidade) {
        return res.status(409).json({
          error: "Já existe um procedimento semelhante para este animal na mesma data.",
          duplicidade: true
        });
      }

      const novoProcedimento = await ProcedimentoVeterinarioModel.criar({
        animal_id,
        tipo,
        data_procedimento,
        descricao,
        veterinario,
        situacao: situacao || "Realizado"
      });

      res.status(201).json(novoProcedimento);
    } catch (error) {
      console.error("Erro ao criar procedimento veterinário:", error);
      res.status(500).json({ error: "Erro ao criar procedimento veterinário." });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        animal_id,
        tipo,
        data_procedimento,
        descricao,
        veterinario,
        situacao,
        confirmarDuplicidade
      } = req.body;

      if (!animal_id || !tipo || !data_procedimento || !descricao || !veterinario) {
        return res.status(400).json({
          error: "Todos os campos obrigatórios devem ser preenchidos para atualização."
        });
      }

      const duplicado = await ProcedimentoVeterinarioModel.verificarDuplicidade({
        animal_id,
        tipo,
        data_procedimento,
        descricao,
        ignorarId: id
      });

      if (duplicado && !confirmarDuplicidade) {
        return res.status(409).json({
          error: "Já existe um procedimento semelhante para este animal na mesma data.",
          duplicidade: true
        });
      }

      const procedimentoAtualizado = await ProcedimentoVeterinarioModel.atualizar(id, {
        animal_id,
        tipo,
        data_procedimento,
        descricao,
        veterinario,
        situacao: situacao || "Realizado"
      });

      if (!procedimentoAtualizado) {
        return res.status(404).json({ error: "Procedimento veterinário não encontrado para atualização." });
      }

      res.status(200).json(procedimentoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar procedimento veterinário:", error);
      res.status(500).json({ error: "Erro ao atualizar procedimento veterinário." });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await ProcedimentoVeterinarioModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Procedimento veterinário não encontrado para exclusão." });
      }

      res.status(200).json({ message: "Procedimento veterinário excluído com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir procedimento veterinário:", error);
      res.status(500).json({ error: "Erro ao excluir procedimento veterinário." });
    }
  }
}

export default ProcedimentoVeterinarioController;