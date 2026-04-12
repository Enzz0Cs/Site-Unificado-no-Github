import ApiService from './ApiService.js';

const PROCEDIMENTO_ENDPOINT = '/procedimentos-veterinarios';

class ProcedimentoVeterinarioService {
  static async listar(animal_id = '') {
    const url = animal_id
      ? `${PROCEDIMENTO_ENDPOINT}?animal_id=${animal_id}`
      : PROCEDIMENTO_ENDPOINT;

    const response = await ApiService.get(url);
    return response.data;
  }

  static async buscarPorId(id) {
    const response = await ApiService.get(`${PROCEDIMENTO_ENDPOINT}/${id}`);
    return response.data;
  }

  static async salvar(dados) {
    if (dados.ProcedimentoID) {
      const response = await ApiService.put(
        `${PROCEDIMENTO_ENDPOINT}/${dados.ProcedimentoID}`,
        dados
      );
      return response.data;
    }

    const { ProcedimentoID, ...dadosLimpos } = dados;
    const response = await ApiService.post(PROCEDIMENTO_ENDPOINT, dadosLimpos);
    return response.data;
  }

  static async excluir(id) {
    const response = await ApiService.delete(`${PROCEDIMENTO_ENDPOINT}/${id}`);
    return response.data;
  }
}

export default ProcedimentoVeterinarioService;