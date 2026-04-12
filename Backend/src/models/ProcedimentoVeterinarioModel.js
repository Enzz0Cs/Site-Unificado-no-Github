import pool from "../config/database.js";

class ProcedimentoVeterinarioModel {
  static async listarTodos() {
    const sql = `
      SELECT 
        pv.ProcedimentoID,
        pv.animal_id,
        a.nome_animal,
        pv.tipo,
        pv.data_procedimento,
        pv.descricao,
        pv.veterinario,
        pv.situacao,
        pv.created_at,
        pv.updated_at
      FROM procedimentos_veterinarios pv
      INNER JOIN animais a ON a.id = pv.animal_id
      ORDER BY pv.data_procedimento DESC, pv.ProcedimentoID DESC
    `;

    const [rows] = await pool.query(sql);
    return rows;
  }

  static async listarPorAnimal(animal_id) {
    const sql = `
      SELECT 
        pv.ProcedimentoID,
        pv.animal_id,
        pv.tipo,
        pv.data_procedimento,
        pv.descricao,
        pv.veterinario,
        pv.situacao,
        pv.created_at,
        pv.updated_at
      FROM procedimentos_veterinarios pv
      WHERE pv.animal_id = ?
      ORDER BY pv.data_procedimento DESC, pv.ProcedimentoID DESC
    `;

    const [rows] = await pool.query(sql, [animal_id]);
    return rows;
  }

  static async buscarPorId(id) {
    const sql = `
      SELECT 
        ProcedimentoID,
        animal_id,
        tipo,
        data_procedimento,
        descricao,
        veterinario,
        situacao
      FROM procedimentos_veterinarios
      WHERE ProcedimentoID = ?
    `;

    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  }

  static async verificarDuplicidade({ animal_id, tipo, data_procedimento, descricao, ignorarId = null }) {
    let sql = `
      SELECT ProcedimentoID
      FROM procedimentos_veterinarios
      WHERE animal_id = ?
        AND tipo = ?
        AND data_procedimento = ?
        AND descricao = ?
    `;

    const params = [animal_id, tipo, data_procedimento, descricao];

    if (ignorarId) {
      sql += ` AND ProcedimentoID <> ?`;
      params.push(ignorarId);
    }

    const [rows] = await pool.query(sql, params);
    return rows.length > 0;
  }

  static async criar(dados) {
    const sql = `
      INSERT INTO procedimentos_veterinarios
      (animal_id, tipo, data_procedimento, descricao, veterinario, situacao, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      dados.animal_id,
      dados.tipo,
      dados.data_procedimento,
      dados.descricao,
      dados.veterinario,
      dados.situacao
    ];

    const [result] = await pool.query(sql, values);
    return { ProcedimentoID: result.insertId, ...dados };
  }

  static async atualizar(id, dados) {
    const sql = `
      UPDATE procedimentos_veterinarios
      SET animal_id = ?, tipo = ?, data_procedimento = ?, descricao = ?, veterinario = ?, situacao = ?, updated_at = NOW()
      WHERE ProcedimentoID = ?
    `;

    const values = [
      dados.animal_id,
      dados.tipo,
      dados.data_procedimento,
      dados.descricao,
      dados.veterinario,
      dados.situacao,
      id
    ];

    const [result] = await pool.query(sql, values);
    return result.affectedRows > 0 ? { ProcedimentoID: id, ...dados } : null;
  }

  static async excluir(id) {
    const [result] = await pool.query(
      "DELETE FROM procedimentos_veterinarios WHERE ProcedimentoID = ?",
      [id]
    );

    return result.affectedRows > 0;
  }
}

export default ProcedimentoVeterinarioModel;