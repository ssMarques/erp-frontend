import axios from 'axios';

const API_URL = 'http://localhost:3000/pedidos';

// Função para listar todos os pedidos
export const getAllPedidos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    throw error;
  }
};

// Função para buscar um pedido por ID
export const getPedidoById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pedido com ID ${id}:`, error);
    throw error;
  }
};

// Função para criar um novo pedido
  export const createPedido = async (clienteId: number) => {
    try {
      const response = await axios.post(API_URL, {
        clienteId,
      });
      console.log('Resposta da API:', response.data);

      return response.data.pedido;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  };



// Função para atualizar um pedido existente
export const updatePedido = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar pedido com ID ${id}:`, error);
    throw error;
  }
};

// Função para deletar um pedido por ID
export const deletePedido = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/find/${id}`);
    return { message: 'Pedido excluído com sucesso' };
  } catch (error) {
    console.error(`Erro ao excluir pedido com ID ${id}:`, error);
    throw error;
  }
};
