import { useState } from 'react';
import { Fornecedor } from '@/types/Fornecedor';
import { getFornecedorByCnpj } from '@/api/fornecedorCRUD';

interface UseFornecedorResult {
  fornecedor: Fornecedor | null;
  erro: string | null;
  loading: boolean;
  buscarFornecedor: (cnpj: string) => Promise<void>;
}

export function useFornecedor(): UseFornecedorResult {
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validarCnpj = (cnpj: string): boolean => {
    const apenasNumeros = cnpj.replace(/\D/g, '');
    return /^\d{14}$/.test(apenasNumeros);
  };

  const buscarFornecedor = async (cnpj: string) => {
    const cnpjNumerico = cnpj.replace(/\D/g, '');

    if (!validarCnpj(cnpjNumerico)) {
      setErro('CNPJ inválido. Insira um CNPJ com 14 dígitos.');
      setFornecedor(null);
      return;
    }

    setErro(null);
    setLoading(true);

    try {
      const fornecedorEncontrado = await getFornecedorByCnpj(cnpjNumerico);
      setFornecedor(fornecedorEncontrado);
    } catch (error) {
      setErro('Fornecedor não encontrado ou erro na busca.');
      setFornecedor(null);
    } finally {
      setLoading(false);
    }
  };

  return { fornecedor, erro, loading, buscarFornecedor };
}
