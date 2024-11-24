import axios from 'axios';
import { Transacao } from '@/types/Transacao'; 

const API_URL = 'http://localhost:3000/transacoes';

// Criar nova transação
export const createTransacao = async (
  valor: number,
  tipo: 'Entrada' | 'Saída',
  produtoId: number | null,
  pedidoId: number | null
): Promise<Transacao> => {
  try {
    const response = await axios.post(API_URL, {
      valor,
      tipo,
      produtoId,
      pedidoId,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    throw error;
  }
};

// Obter todas as transações
export const getAllTransacoes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    throw error;
  }
};

// Buscar transação por ID
export const getTransacaoById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    throw error;
  }
};

// Atualizar transação
export const updateTransacao = async (
  id: number,
  valor: number,
  tipo: 'Entrada' | 'Saída',
  produtoId: number | null,
  pedidoId: number | null
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      valor,
      tipo,
      produtoId,
      pedidoId,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    throw error;
  }
};

// Excluir transação
export const deleteTransacao = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    throw error;
  }
};
