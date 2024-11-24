import React, { createContext, useContext, useState, useEffect } from 'react';
import { Produto } from '../types/Produto';
import { createProduto, getAllProdutos, editProduto, deleteProduto, getProdutoById } from '@/api/produtoCRUD';

interface ProdutoContextType {
  produtos: Produto[];
  loading: boolean;
  error: string | null;
  addProduto: (produto: Produto) => Promise<void>;
  fetchProdutos: () => Promise<void>;
  updateProduto: (id: number, updatedProduto: Produto) => Promise<void>;
  removeProduto: (id: number) => Promise<void>;
  validarPreco: (price: number) => boolean;
  validarQuantidade: (quantity: number) => boolean;
  validarImagemUrl: (imageUrl: string) => boolean;
  fetchProdutoById: (id: number) => Promise<Produto | null>; // Nova função para buscar por ID
}

const ProdutoContext = createContext<ProdutoContextType | undefined>(undefined);

export const ProdutoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const data = await getAllProdutos();
      setProdutos(data);
    } catch (error) {
      setError('Falha ao buscar produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const addProduto = async (produto: Produto) => {
    setLoading(true);
    setError(null);
    try {
      const novoProduto = await createProduto(
        produto.nome,
        produto.descricao,
        produto.preco,
        produto.quantidade,
        produto.imagem,
        produto.fornecedorId
      );
      setProdutos((prev) => [...prev, novoProduto]);
      await fetchProdutos();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao adicionar produto');
    } finally {
      setLoading(false);
    }
  };

  const updateProduto = async (id: number, updatedProduto: Produto) => {
    setLoading(true);
    setError(null);
    try {
      const produtoAtualizado = await editProduto(id, updatedProduto);
      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) => (produto.id === id ? produtoAtualizado : produto))
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar produto');
    } finally {
      setLoading(false);
    }
  };

  const removeProduto = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProduto(id);
      setProdutos((prevProdutos) => prevProdutos.filter((produto) => produto.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao excluir produto');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar produto por ID
  const fetchProdutoById = async (id: number): Promise<Produto | null> => {
    setLoading(true);
    setError(null);
    try {
      const produto = await getProdutoById(id);
      return produto;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao buscar produto por ID');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validarPreco = (price: number) => price > 0;
  const validarQuantidade = (quantity: number) => Number.isInteger(quantity) && quantity > 0;
  const validarImagemUrl = (imageUrl: string) =>
    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(imageUrl);

  return (
    <ProdutoContext.Provider
      value={{
        produtos,
        loading,
        error,
        addProduto,
        fetchProdutos,
        updateProduto,
        removeProduto,
        validarPreco,
        validarQuantidade,
        validarImagemUrl,
        fetchProdutoById, // Nova função no contexto
      }}
    >
      {children}
    </ProdutoContext.Provider>
  );
};

export const useProduto = () => {
  const context = useContext(ProdutoContext);
  if (!context) {
    throw new Error('useProduto must be used within a ProdutoProvider');
  }
  return context;
};
