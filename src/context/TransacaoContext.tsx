import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transacao } from '@/types/Transacao'; // Ajuste conforme sua definição de Transacao
import { createTransacao, getAllTransacoes, updateTransacao, deleteTransacao } from '@/api/transacaoCRUD';

// Definição do contexto
interface TransacaoContextType {
  transacoes: Transacao[];
  criarTransacao: (valor: number, tipo: 'Entrada' | 'Saída', produtoId: number | null, pedidoId: number | null) => void;
  listarTransacoes: () => void;
  atualizarTransacao: (id: number, valor: number, tipo: 'Entrada' | 'Saída', produtoId: number | null, pedidoId: number | null) => void;
  excluirTransacao: (id: number) => void;
}

const TransacaoContext = createContext<TransacaoContextType | undefined>(undefined);

// Provedor do contexto
interface TransacaoProviderProps {
  children: ReactNode;
}

export const TransacaoProvider: React.FC<TransacaoProviderProps> = ({ children }) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  // Função para listar todas as transações
  const listarTransacoes = async () => {
    try {
      const data = await getAllTransacoes();
      setTransacoes(data);
    } catch (error) {
      console.error('Erro ao listar transações:', error);
    }
  };

  // Função para criar uma nova transação
  const criarTransacao = async (
    valor: number,
    tipo: 'Entrada' | 'Saída',
    produtoId: number | null,
    pedidoId: number | null
  ) => {
    try {
      const novaTransacao = await createTransacao(valor, tipo, produtoId, pedidoId);
      setTransacoes((prevTransacoes) => [...prevTransacoes, novaTransacao]);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  // Função para atualizar uma transação
  const atualizarTransacao = async (
    id: number,
    valor: number,
    tipo: 'Entrada' | 'Saída',
    produtoId: number | null,
    pedidoId: number | null
  ) => {
    try {
      const transacaoAtualizada = await updateTransacao(id, valor, tipo, produtoId, pedidoId);
      setTransacoes((prevTransacoes) =>
        prevTransacoes.map((transacao) =>
          transacao.id === id ? transacaoAtualizada : transacao
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  };

  // Função para excluir uma transação
  const excluirTransacao = async (id: number) => {
    try {
      await deleteTransacao(id);
      setTransacoes((prevTransacoes) => prevTransacoes.filter((transacao) => transacao.id !== id));
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  return (
    <TransacaoContext.Provider
      value={{
        transacoes,
        criarTransacao,
        listarTransacoes,
        atualizarTransacao,
        excluirTransacao,
      }}
    >
      {children}
    </TransacaoContext.Provider>
  );
};

// Hook personalizado para consumir o contexto
export const useTransacao = (): TransacaoContextType => {
  const context = useContext(TransacaoContext);
  if (!context) {
    throw new Error('useTransacao deve ser usado dentro de um TransacaoProvider');
  }
  return context;
};
