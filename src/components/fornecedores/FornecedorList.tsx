import React, { useEffect, useState } from 'react';
import { Fornecedor } from '../../types/Fornecedor';
import Modal from '../Modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useFornecedor } from '../../context/FornecedorContext';

const FornecedorList: React.FC = () => {
  const { fornecedores, fetchFornecedores, updateFornecedor, deleteFornecedor } = useFornecedor();
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [contatoFiltro, setContatoFiltro] = useState('');
  const [detailsVisible, setDetailsVisible] = useState<number | null>(null);

  useEffect(() => {
    fetchFornecedores();
  }, [fornecedores]);

  const handleEdit = (fornecedor: Fornecedor) => {
    setFornecedorEditando(fornecedor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (id) await deleteFornecedor(id);
  };

  const handleSave = async () => {
    if (fornecedorEditando && fornecedorEditando.id) {
      await updateFornecedor(fornecedorEditando.id, fornecedorEditando);
      setIsModalOpen(false);
      setFornecedorEditando(null);
    }
  };

  const toggleDetails = (id: number) => {
    setDetailsVisible(detailsVisible === id ? null : id);
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Lista de Fornecedores</h2>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filtrar por Nome"
          value={nomeFiltro}
          onChange={(e) => setNomeFiltro(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Filtrar por Contato"
          value={contatoFiltro}
          onChange={(e) => setContatoFiltro(e.target.value)}
          className="mb-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fornecedores
          .filter(fornecedor =>
            fornecedor.nome?.toLowerCase().includes(nomeFiltro.toLowerCase()) &&
            fornecedor.contato?.toLowerCase().includes(contatoFiltro.toLowerCase())
          )
          .map((fornecedor) => (
            <div key={fornecedor.id} className="p-4 border border-gray-300 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-semibold w-1/2 text-justify">{fornecedor.nome}</span>
                <Button onClick={() => toggleDetails(fornecedor.id!)} className="text-sm mt-1">
                  {detailsVisible === fornecedor.id ? 'Menos Detalhes' : 'Mais Detalhes'}
                </Button>
              </div>

              {detailsVisible === fornecedor.id && (
                <div className="mt-2 p-2 border border-gray-300 rounded bg-gray-100">
                  <p><strong>CNPJ:</strong> {fornecedor.cnpj}</p>
                  <p><strong>Contato:</strong> {fornecedor.contato}</p>
                  <p><strong>Endereço:</strong> {fornecedor.endereco}</p>
                  <div className="mt-2 flex justify-between">
                    <Button onClick={() => handleEdit(fornecedor)} className="text-blue-500 hover:text-blue-700">
                      Editar
                    </Button>
                    <Button onClick={() => handleDelete(fornecedor.id!)} className="text-red-500 hover:text-red-700">
                      Excluir
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {fornecedorEditando && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Editar Fornecedor</h3>
            <Input
              type="text"
              value={fornecedorEditando.nome}
              onChange={(e) => setFornecedorEditando({ ...fornecedorEditando, nome: e.target.value })}
              placeholder="Nome"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <Input
              type="text"
              value={fornecedorEditando.cnpj}
              onChange={(e) => setFornecedorEditando({ ...fornecedorEditando, cnpj: e.target.value })}
              placeholder="CNPJ"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <Input
              type="text"
              value={fornecedorEditando.contato}
              onChange={(e) => setFornecedorEditando({ ...fornecedorEditando, contato: e.target.value })}
              placeholder="Contato"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <Input
              type="text"
              value={fornecedorEditando.endereco}
              onChange={(e) => setFornecedorEditando({ ...fornecedorEditando, endereco: e.target.value })}
              placeholder="Endereço"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded">
              Salvar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FornecedorList;
