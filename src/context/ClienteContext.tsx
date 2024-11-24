  import React, { createContext, useContext, useState, useEffect } from 'react';
  import { Cliente } from '../types/Cliente';
  import { createCliente, getAllCliente, editCliente as editarCliente, deleteCliente as excluirCliente } from '../api/clienteCRUD';

  interface ClienteContextType {
    clientes: Cliente[];
    loading: boolean;
    error: string | null;
    addCliente: (cliente: Cliente) => Promise<void>;
    fetchClientes: () => Promise<void>;
    editCliente: (id: number, cliente: Cliente) => Promise<void>;
    deleteCliente: (id: number) => Promise<void>;
  }

  export const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

  export const ClienteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClientes = async () => {
      setLoading(true);
      try {
        const data = await getAllCliente();
        setClientes(data);
      } catch (error) {
        setError('Falha ao buscar clientes.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchClientes();
    }, []);

    const addCliente = async (cliente: Cliente) => {
      setLoading(true);
      try {
        const newCliente = await createCliente(cliente.nome, cliente.cpf_cnpj, cliente.contato, cliente.endereco);
        setClientes((prevClientes) => [...prevClientes, newCliente]);
        await fetchClientes();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erro ao adicionar cliente');
      } finally {
        setLoading(false);
      }
    };

    const editCliente = async (id: number, cliente: Cliente) => {
      setLoading(true);
      try {
        await editarCliente(id, cliente);
        fetchClientes();
      } catch (error) {
        setError('Falha ao editar o cliente.');
      } finally {
        setLoading(false);
      }
    };

    const deleteCliente = async (id: number) => {
      setLoading(true);
      try {
        await excluirCliente(id);
        setClientes((prevClientes) => prevClientes.filter(cliente => cliente.id !== id));
      } catch (error) {
        setError('Falha ao excluir o cliente.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <ClienteContext.Provider value={{ clientes, loading, error, addCliente, fetchClientes, editCliente, deleteCliente }}>
        {children}
      </ClienteContext.Provider>
    );
  };

  export const useCliente = () => {
    const context = useContext(ClienteContext);
    if (!context) {
      throw new Error('useCliente must be used within a ClienteProvider');
    }
    return context;
  };
