import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { createUsuario, getAllUsuarios, getUsuarioById, editUsuario, deleteUsuario } from '../api/usuarioCRUD'; // Importe as funções de CRUD
import { Usuario } from '@/types/Usuario'; // Importe o tipo Usuario

interface UsuarioContextProps {
  usuarios: Usuario[];
  createUsuario: (nome: string, email: string, senha: string, permissao: 'admin' | 'usuario_comum') => void;
  getAllUsuarios: () => void;
  getUsuarioById: (id: number) => Promise<Usuario | undefined>;
  editUsuario: (id: number, nome: string, email: string, senha: string, permissao: 'admin' | 'usuario_comum') => void;
  deleteUsuario: (id: number) => void;
}

const UsuarioContext = createContext<UsuarioContextProps | undefined>(undefined);

export const UsuarioProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Função para criar um novo usuário
  const handleCreateUsuario = async (nome: string, email: string, senha: string, permissao: 'admin' | 'usuario_comum' = 'usuario_comum') => {
    try {
      const newUsuario = await createUsuario(nome, email, senha, permissao);
      setUsuarios((prev) => [...prev, newUsuario]);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  // Função para buscar todos os usuários
  const handleGetAllUsuarios = async () => {
    try {
      const usuariosData = await getAllUsuarios();
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  // Função para buscar um usuário por ID
  const handleGetUsuarioById = async (id: number) => {
    try {
      const usuarioData = await getUsuarioById(id);
      return usuarioData;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      return undefined;
    }
  };

  // Função para editar um usuário existente
  const handleEditUsuario = async (id: number, nome: string, email: string, senha: string, permissao: 'admin' | 'usuario_comum') => {
    try {
      const updatedUsuario = await editUsuario(id, nome, email, senha, permissao);
      setUsuarios((prev) =>
        prev.map((usuario) => (usuario.id === id ? updatedUsuario : usuario))
      );
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
    }
  };

  // Função para excluir um usuário
  const handleDeleteUsuario = async (id: number) => {
    try {
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  useEffect(() => {
    handleGetAllUsuarios(); // Carrega os usuários quando o componente é montado
  }, []); // A dependência vazia garante que a função seja chamada apenas uma vez ao montar o componente

  return (
    <UsuarioContext.Provider
      value={{
        usuarios,
        createUsuario: handleCreateUsuario,
        getAllUsuarios: handleGetAllUsuarios,
        getUsuarioById: handleGetUsuarioById,
        editUsuario: handleEditUsuario,
        deleteUsuario: handleDeleteUsuario,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuarioContext = (): UsuarioContextProps => {
  const context = React.useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuarioContext must be used within a UsuarioProvider');
  }
  return context;
};
