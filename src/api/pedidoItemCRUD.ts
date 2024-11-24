import axios from 'axios';

const API_URL = 'http://localhost:3000/pedido-items';

// Função para criar um novo item de pedido
export const createPedidoItem = async (
  pedidoId: number,
  produtoId: number,
  quantidade: number,
  precoUnitario: number
) => {
  try {
    const response = await axios.post(API_URL, {
      pedidoId,
      produtoId,
      quantidade,
      precoUnitario,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar item de pedido:', error);
    throw error;
  }
};

// Função para obter todos os itens de pedido
export const getAllPedidoItems = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar itens de pedido:', error);
    throw error;
  }
};

// Função para editar um item de pedido
export const editPedidoItem = async (
  id: number,
  quantidade: number,
  precoUnitario: number
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      quantidade,
      precoUnitario,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao editar item de pedido:', error);
    throw error;
  }
};


// Função para deletar um item de pedido
export const deletePedidoItem = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/find/${id}`);
  } catch (error) {
    console.error('Erro ao deletar item de pedido:', error);
    throw error;
  }
};


