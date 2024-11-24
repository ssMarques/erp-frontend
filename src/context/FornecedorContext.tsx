import React, { createContext, useContext, useState, useEffect } from 'react';
import { Fornecedor } from '@/types/Fornecedor';
import {
    createFornecedor,
    getAllFornecedores,
    editFornecedor,
    deleteFornecedor,
    getFornecedorByCnpj, 
} from '@/api/fornecedorCRUD';

interface FornecedorContextType {
    fornecedores: Fornecedor[];
    loading: boolean;
    error: string | null;
    addFornecedor: (fornecedor: Fornecedor) => Promise<void>;
    fetchFornecedores: () => Promise<void>;
    updateFornecedor: (id: number, updatedFornecedor: Fornecedor) => Promise<void>;
    deleteFornecedor: (id: number) => Promise<void>;
    buscarFornecedor: (cnpj: string) => Promise<void>;
    fornecedorEncontrado: Fornecedor | null;
}

const FornecedorContext = createContext<FornecedorContextType | undefined>(undefined);

export const FornecedorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fornecedorEncontrado, setFornecedorEncontrado] = useState<Fornecedor | null>(null);

    const fetchFornecedores = async () => {
        setLoading(true);
        try {
            const fornecedores = await getAllFornecedores();
            setFornecedores(fornecedores);
        } catch (error) {
            setError('Falha ao buscar fornecedores.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFornecedores();
    }, []);

    const addFornecedor = async (fornecedor: Fornecedor) => {
        setLoading(true);
        try {
            const novoFornecedor = await createFornecedor(
                fornecedor.nome,
                fornecedor.cnpj,
                fornecedor.contato,
                fornecedor.endereco
            );
            setFornecedores((prev) => [...prev, novoFornecedor]);
        } catch (error) {
            setError('Erro ao adicionar fornecedor');
        } finally {
            setLoading(false);
        }
    };

    const updateFornecedor = async (id: number, updatedFornecedor: Fornecedor) => {
        setLoading(true);
        try {
            const fornecedorAtualizado = await editFornecedor(id, updatedFornecedor);
            setFornecedores((prevFornecedores) =>
                prevFornecedores.map((fornecedor) =>
                    fornecedor.id === id ? fornecedorAtualizado : fornecedor
                )
            );
        } catch (error) {
            setError('Erro ao atualizar fornecedor');
        } finally {
            setLoading(false);
        }
    };

    const deleteFornecedorById = async (id: number) => {
        setLoading(true);
        try {
            await deleteFornecedor(id);
            setFornecedores((prevFornecedores) =>
                prevFornecedores.filter((fornecedor) => fornecedor.id !== id)
            );
        } catch (error) {
            setError('Erro ao excluir fornecedor');
        } finally {
            setLoading(false);
        }
    };

    const buscarFornecedor = async (cnpj: string) => {
        setLoading(true);
        setError(null);
        try {
            const fornecedor = await getFornecedorByCnpj(cnpj);
            setFornecedorEncontrado(fornecedor);
        } catch (error) {
            setError('Fornecedor não encontrado ou erro na busca.');
            setFornecedorEncontrado(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FornecedorContext.Provider
            value={{
                fornecedores,
                loading,
                error,
                addFornecedor,
                fetchFornecedores,
                updateFornecedor,
                deleteFornecedor: deleteFornecedorById,
                buscarFornecedor,
                fornecedorEncontrado,
            }}
        >
            {children}
        </FornecedorContext.Provider>
    );
};

export const useFornecedor = () => {
    const context = useContext(FornecedorContext);
    if (!context) {
        throw new Error('useFornecedor must be used within a FornecedorProvider');
    }
    return context;
};
