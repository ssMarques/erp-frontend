import { useEffect, useState } from 'react';
import { useTransacao } from '@/context/TransacaoContext';
import { Button } from '@/components/ui/button'; 
import Modal from '../../components/Modal';
import { Input } from '@/components/ui/input'; 
import { Transacao } from '@/types/Transacao';
import { FaDollarSign, FaArrowDown, FaArrowUp, FaCalendarAlt } from 'react-icons/fa'; 

const TransacaoList = () => {
  const { transacoes, listarTransacoes, atualizarTransacao, excluirTransacao } = useTransacao();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(null);
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    listarTransacoes();
  }, [listarTransacoes]);

  const handleEdit = (transacao: Transacao) => {
    setTransacaoEditando(transacao);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    excluirTransacao(id);
  };

  const handleSave = async () => {
    if (transacaoEditando) {
      try {
        await atualizarTransacao(
          transacaoEditando.id,
          transacaoEditando.valor,
          transacaoEditando.tipo,
          transacaoEditando.produtoId,
          transacaoEditando.pedidoId
        );
        setIsModalOpen(false);
      } catch (error) {
        setErro('Erro ao atualizar transação');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lista de Transações</h1>
      <div>
        {transacoes
          .filter((transacao) => transacao.valor !== null && transacao.tipo !== null) // Filtra transações com valores não nulos
          .map((transacao) => (
            <div key={transacao.id} className="p-4 mb-4 bg-white shadow-lg rounded-lg border border-gray-300">
              <div className="flex flex-col">
                {/* Valor */}
                <div className="flex items-center mb-2">
                  <FaDollarSign className="text-xl mr-2 text-gray-500" />
                  <p className="font-semibold text-lg">{`R$ ${transacao.valor.toFixed(2)}`}</p>
                </div>

                {/* Tipo */}
                <div className="flex items-center mb-2">
                  {transacao.tipo === 'Entrada' ? (
                    <FaArrowUp className="text-green-500 mr-2" />
                  ) : (
                    <FaArrowDown className="text-red-500 mr-2" />
                  )}
                  <p className="font-medium text-gray-700">{transacao.tipo}</p>
                </div>

                {/* Produto */}
                {transacao.produtoId !== null && (
                  <div className="flex items-center mb-2">
                    <p className="text-gray-600">Produto:</p>
                    <span className="ml-2 text-sm text-gray-500">{transacao.produtoId}</span>
                  </div>
                )}

                {/* Pedido */}
                {transacao.pedidoId !== null && (
                  <div className="flex items-center mb-2">
                    <p className="text-gray-600">Pedido:</p>
                    <span className="ml-2 text-sm text-gray-500">{transacao.pedidoId}</span>
                  </div>
                )}

                {/* Data */}
                {transacao.data && (
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <p className="text-gray-600">{new Date(transacao.data).toLocaleDateString()}</p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <Button onClick={() => handleEdit(transacao)} variant="outline" className="w-24">
                    Editar
                  </Button>
                  <Button onClick={() => handleDelete(transacao.id)} className="w-24">
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal para editar transação */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Editar Transação</h3>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <Input
            value={transacaoEditando?.valor || ''}
            onChange={(e) =>
              setTransacaoEditando({
                ...transacaoEditando!,
                valor: parseFloat(e.target.value),
              })
            }
            placeholder="Valor"
            className="mb-4"
          />
          <Input
            value={transacaoEditando?.tipo || ''}
            onChange={(e) =>
              setTransacaoEditando({
                ...transacaoEditando!,
                tipo: e.target.value as 'Entrada' | 'Saída',
              })
            }
            placeholder="Tipo"
            className="mb-4"
          />
          <Button onClick={handleSave} className="w-full">
            Salvar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TransacaoList;
