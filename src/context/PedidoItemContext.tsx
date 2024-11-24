  // PedidoItemContext.tsx
  import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
  import { createPedidoItem, getAllPedidoItems, editPedidoItem, deletePedidoItem } from './../api/pedidoItemCRUD';
  import { useProduto } from './ProdutoContext';
  import { Produto } from '@/types/Produto';
  import { PedidoItem } from '@/types/PedidoItem';

  type PedidoItemContextType = {
    pedidoItems: PedidoItem[];
    adicionarPedidoItem: (pedidoId: number, produtoId: number, quantidade: number, precoUnitario: number) => Promise<void>;
    atualizarPedidoItem: (id: number, quantidade: number, precoUnitario: number) => Promise<void>;
    excluirPedidoItem: (id: number) => Promise<void>;
    listarPedidoItems: () => Promise<void>;
    produtosDisponiveis: () => Promise<Produto[] | void>;
  };

  const PedidoItemContext = createContext<PedidoItemContextType | undefined>(undefined);

  export const PedidoItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pedidoItems, setPedidoItems] = useState<PedidoItem[]>([]);
    const { produtos, fetchProdutos } = useProduto();

    const produtosDisponiveis = async () => {
      try {
        await fetchProdutos();
        return produtos; 
      } catch (error) {
        console.error("Erro ao listar produtos:", error);
      }
    };

    const adicionarPedidoItem = async (pedidoId: number, produtoId: number, quantidade: number, precoUnitario: number) => {
      try {
        if (quantidade <= 0) throw new Error('A quantidade deve ser maior que zero.');

        const produto = produtos.find((prod) => prod.id === produtoId);
        if (!produto) throw new Error('Produto não encontrado.');
        if (quantidade > produto.quantidade) throw new Error('A quantidade é maior do que a disponível no estoque.');

        const novoItem = await createPedidoItem(pedidoId, produtoId, quantidade, precoUnitario);
        setPedidoItems([...pedidoItems, novoItem]);
      } catch (error) {
        console.error("Erro ao adicionar item de pedido:", error);
      }
    };

    const listarPedidoItems = async () => {
      try {
        const items = await getAllPedidoItems();
        setPedidoItems(items);
      } catch (error) {
        console.error("Erro ao listar itens de pedido:", error);
      }
    };

    const atualizarPedidoItem = async (id: number, quantidade: number, precoUnitario: number) => {
      try {
        if (quantidade <= 0) throw new Error('A quantidade deve ser maior que zero.');

        const item = pedidoItems.find((item) => item.id === id);
        if (!item) throw new Error('Item de pedido não encontrado.');

        const produto = produtos.find((prod) => prod.id === item.produtoId);
        if (!produto) throw new Error('Produto não encontrado.');
        if (quantidade > produto.quantidade) throw new Error('A quantidade é maior do que a disponível no estoque.');

        const itemAtualizado = await editPedidoItem(id, quantidade, precoUnitario);
        setPedidoItems(pedidoItems.map((item) => (item.id === id ? itemAtualizado : item)));
      } catch (error) {
        console.error("Erro ao atualizar item de pedido:", error);
      }
    };

    const excluirPedidoItem = async (id: number) => {
      try {
        await deletePedidoItem(id);
        setPedidoItems(pedidoItems.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Erro ao deletar item de pedido:", error);
      }
    };

    useEffect(() => {
      listarPedidoItems();
    }, []);

    return (
      <PedidoItemContext.Provider
        value={{
          pedidoItems,
          adicionarPedidoItem,
          atualizarPedidoItem,
          excluirPedidoItem,
          listarPedidoItems,
          produtosDisponiveis,
        }}
      >
        {children}
      </PedidoItemContext.Provider>
    );
  };

  export const usePedidoItemContext = () => {
    const context = useContext(PedidoItemContext);
    if (!context) {
      throw new Error('usePedidoItemContext deve ser usado dentro de um PedidoItemProvider');
    }
    return context;
  };
