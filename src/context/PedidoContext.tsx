import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createPedido, getAllPedidos, updatePedido, deletePedido } from '../api/pedidoCRUD';
import { Pedido } from '@/types/Pedido';

interface PedidoContextType {
  pedidos: Pedido[];
  fetchPedidos: () => Promise<void>;
  addPedido: (clienteId: string) => Promise<void>;
  updatePedidoStatus: (id: number) => Promise<void>;
  removePedido: (id: number) => Promise<void>;
  getPedidoById: (id: number) => Pedido | undefined;
  error: string | null;
  novoPedidoId: number | null;
  setNovoPedidoId: React.Dispatch<React.SetStateAction<number | null>>;
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const usePedidoContext = () => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedidoContext must be used within a PedidoProvider');
  }
  return context;
};

interface PedidoProviderProps {
  children: ReactNode;
}

export const PedidoProvider: React.FC<PedidoProviderProps> = ({ children }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [novoPedidoId, setNovoPedidoId] = useState<number | null>(null);

  const fetchPedidos = async () => {
    try {
      const data = await getAllPedidos();
      setPedidos(data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError('Erro ao buscar pedidos');
    }
  };

  const addPedido = async (clienteId: string) => {
    try {
      const newPedido = await createPedido(Number(clienteId));
      setPedidos((prevPedidos) => [...prevPedidos, newPedido]);
      setNovoPedidoId(newPedido);
      return newPedido;
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      setError((err as Error).message);
      return 0;
    }
  };

  const updatePedidoStatus = async (id: number) => {
    try {
      await updatePedido(id); 
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === id ? { ...pedido, status: "Concluído" } : pedido
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar pedido:', err);
      setError((err as Error).message);
    }
  };

  const removePedido = async (id: number) => {
    try {
      await deletePedido(id);
      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== id));
    } catch (err) {
      console.error('Erro ao excluir pedido:', err);
      setError('Erro ao excluir pedido');
    }
  };

  const getPedidoById = (id: number): Pedido | undefined => {
    return pedidos.find((pedido) => pedido.id === id);
  };

  return (
    <PedidoContext.Provider
      value={{
        pedidos,
        fetchPedidos,
        addPedido,
        updatePedidoStatus,
        removePedido,
        getPedidoById,
        error,
        novoPedidoId,
        setNovoPedidoId,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};
