import { Cliente } from '@/types/Cliente';
import axios from 'axios';

const API_URL = 'http://localhost:3000/clientes';

export const createCliente = async (
  nome: string,
  cpf_cnpj: string,
  contato: string,
  endereco: string,
): Promise<Cliente> => {
  try {
    const response = await axios.post(API_URL, {
      nome,
      cpf_cnpj,
      contato,
      endereco,
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};

export const getAllCliente = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};

export const getClienteByCNPJeCPF = async (cnpjCpf: string) => {
  try {
    const response = await axios.get(`${API_URL}/cnpj/${cnpjCpf}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cliente pelo CNPJ:', error);
    throw error;
  }
};

export const editCliente = async (id: number, updateCliente: Cliente) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updateCliente);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar cliente:', error);
    throw error;
  }
};

export const deleteCliente = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/find/${id}`);
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    throw error;
  }
};
