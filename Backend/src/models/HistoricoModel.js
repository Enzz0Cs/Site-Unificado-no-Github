import pool from "../config/database.js";

class HistoricoModel {

    static async aplicarVacina(dados) {
        const { animal_id, vacina_id, data_aplicacao, observacoes } = dados;

        const sql = `
            INSERT INTO animal_vacina 
            (animal_id, vacina_id, data_aplicacao, observacoes)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            animal_id,
            vacina_id,
            data_aplicacao,
            observacoes
        ]);

        return { id: result.insertId, ...dados };
    }

    static async listarPorAnimal(animal_id) {
        const sql = `
            SELECT 
                av.id,
                av.data_aplicacao,
                av.observacoes,
                v.vacina AS nome_vacina
            FROM animal_vacina av
            JOIN vacinas v ON av.vacina_id = v.id
            WHERE av.animal_id = ?
            ORDER BY av.data_aplicacao DESC
        `;

        const [rows] = await pool.query(sql, [animal_id]);
        return rows;
    }

}

export default HistoricoModel;