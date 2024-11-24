import axios from 'axios';


const API_URL = 'http://localhost:3000/usuarios';

// Função para criar um novo usuário
export const createUsuario = async (
  nome: string,
  email: string,
  senha: string,
  permissao: 'admin' | 'usuario_comum' = 'usuario_comum'
) => {
  try {
    const response = await axios.post(API_URL, {
      nome,
      email,
      senha,
      permissao
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// Função para buscar todos os usuários
export const getAllUsuarios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// Função para buscar um usuário por ID
export const getUsuarioById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    throw error;
  }
};

// Função para editar um usuário existente
export const editUsuario = async (
  id: number,
  nome: string,
  email: string,
  senha: string,
  permissao: 'admin' | 'usuario_comum'
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      nome,
      email,
      senha,
      permissao
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    throw error;
  }
};

// Função para excluir um usuário
export const deleteUsuario = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};
