import ApiService from './ApiService.js';
const VACINA_ENDPOINT = '/vacinas';

class VacinaService {
    static async listar(termo = '') {
        const url = termo ? `${VACINA_ENDPOINT}/busca?termo=${termo}` : VACINA_ENDPOINT;
        return await ApiService.get(url);
    }

    static async salvar(dados) {
        if (dados.VacinaID) {
            return await ApiService.put(`${VACINA_ENDPOINT}/${dados.VacinaID}`, dados);
        } else {
            const { VacinaID, ...dadosLimpos } = dados;
            return await ApiService.post(VACINA_ENDPOINT, dadosLimpos);
        }
    }

    static async excluir(id) {
        return await ApiService.delete(`${VACINA_ENDPOINT}/${id}`);
    }
}

export default VacinaService;