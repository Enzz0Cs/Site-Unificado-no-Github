import pool from "../config/database.js";

class VacinaModel {
    static async listarTodos() {
        const sql = `
            SELECT 
                id AS VacinaID,
                codigo AS CodigoVacina,
                vacina AS NomeVacina,
                created_at,
                updated_at
            FROM vacinas 
            ORDER BY id DESC
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }

    static async buscarPorId(id) {
        const sql = "SELECT id AS VacinaID, codigo AS CodigoVacina, vacina AS NomeVacina FROM vacinas WHERE id = ?";
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    }

    static async criar(dados) {
        // O banco espera 'codigo' e 'vacina'
        const sql = "INSERT INTO vacinas (codigo, vacina, created_at, updated_at) VALUES (?, ?, NOW(), NOW())";
        const values = [dados.CodigoVacina, dados.NomeVacina];
        const [result] = await pool.query(sql, values);
        return { VacinaID: result.insertId, ...dados };
    }

    static async atualizar(id, dados) {
        const sql = "UPDATE vacinas SET codigo = ?, vacina = ?, updated_at = NOW() WHERE id = ?";
        const values = [dados.CodigoVacina, dados.NomeVacina, id];
        const [result] = await pool.query(sql, values);
        return result.affectedRows > 0 ? { VacinaID: id, ...dados } : null;
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM vacinas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

export default VacinaModel;