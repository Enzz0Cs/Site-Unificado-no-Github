import ApiService from './ApiService';

const ENDPOINT = '/historico';

const HistoricoService = {

    aplicar: async (dados) => {
        const response = await ApiService.post(ENDPOINT, dados);
        return response.data;
    },

    listar: async (animal_id) => {
        const response = await ApiService.get(`${ENDPOINT}/${animal_id}`);
        return response.data;
    }

};

export default HistoricoService;