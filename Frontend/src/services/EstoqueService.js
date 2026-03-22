import ApiService from './ApiService.js';

const ENDPOINT = '/estoque';

const EstoqueService = {

    listar: async () => {
        const response = await ApiService.get(ENDPOINT);
        return response.data || response;
    },

    salvar: async (dados) => {
        if (dados.id) {
            const response = await ApiService.put(`${ENDPOINT}/${dados.id}`, dados);
            return response.data || response;
        } else {
            const response = await ApiService.post(ENDPOINT, dados);
            return response.data || response;
        }
    },

    excluir: async (id) => {
        const response = await ApiService.delete(`${ENDPOINT}/${id}`);
        return response.data || response;
    }

};

export default EstoqueService;