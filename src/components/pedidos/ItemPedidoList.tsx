import React, { useEffect } from 'react';
import { usePedidoItemContext } from '../../context/PedidoItemContext';
import { useProduto } from '../../context/ProdutoContext';
import { Button } from '../ui/button';
import { usePedidoContext } from '../../context/PedidoContext';
import { FaCheckCircle, FaClock } from 'react-icons/fa';

const PedidoItemList: React.FC = () => {
  const { pedidoItems, listarPedidoItems } = usePedidoItemContext();
  const { produtos } = useProduto();
  const { updatePedidoStatus, fetchPedidos, pedidos } = usePedidoContext();

  useEffect(() => {
    listarPedidoItems();
    fetchPedidos(); // Carregar os pedidos assim que o componente for montado
  }, [listarPedidoItems, fetchPedidos]);

  const getProdutoNome = (produtoId: number) => {
    const produto = produtos.find((prod) => prod.id === produtoId);
    return produto ? produto.nome : 'Produto desconhecido';
  };

  const handlePagar = async (pedidoId: number) => {
    // Atualiza o status no back-end
    await updatePedidoStatus(pedidoId);
    fetchPedidos(); // Recarregar os pedidos para garantir que os status sejam atualizados
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-500 text-white'; // Fundo verde, texto branco
      case 'Pendente':
        return 'bg-yellow-500 text-white'; // Fundo amarelo, texto branco
      default:
        return 'bg-gray-300 text-gray-800'; // Caso o status seja desconhecido
    }
  };

  // Função para formatar valores numéricos, com fallback para 0.00
  const formatNumber = (value: number | undefined) => {
    return value ? value.toFixed(2) : '0.00';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Lista de Itens do Pedido</h2>
      {pedidoItems.length === 0 ? (
        <p className="text-gray-700 text-center">Nenhum item encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidoItems.map((item) => {
            const pedido = pedidos.find((pedido) => pedido.id === item.pedidoId); // Busca o pedido no contexto
            const pedidoStatus = pedido ? pedido.status : 'Pendente'; // Se o pedido existir, pega o status

            // Calculando o total, com fallback para valores nulos
            const total = (item.quantidade || 0) * (item.precoUnitario || 0);

            return (
              <div key={item.id} className="p-4 border border-gray-300 rounded-md">
                <h3 className="text-lg font-semibold">Pedido: {item.pedidoId}</h3>
                <h4 className="text-lg font-semibold">{getProdutoNome(item.produtoId)}</h4>
                <p className="text-gray-700">Quantidade: {item.quantidade}</p>
                <p className="text-gray-900">Preço Unitário: R$ {formatNumber(item.precoUnitario)}</p>
                <p className="text-gray-900">Total: R$ {formatNumber(total)}</p>
                <div className="mt-4">
                  {/* Exibe o status com maior destaque */}
                  <p className={`p-2 rounded-md font-bold text-center ${getStatusStyle(pedidoStatus)}`}>
                    {pedidoStatus === 'Concluído' ? (
                      <span className="flex items-center justify-center">
                        <FaCheckCircle className="mr-2 text-white" />
                        {pedidoStatus}
                      </span>
                    ) : pedidoStatus === 'Pendente' ? (
                      <span className="flex items-center justify-center">
                        <FaClock className="mr-2 text-white" />
                        {pedidoStatus}
                      </span>
                    ) : (
                      'Pendente'
                    )}
                  </p>
                </div>
                {/* Exibe o botão "Pagar" apenas se o status do pedido for "Pendente" */}
                {pedidoStatus !== 'Concluído' && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      className="text-green-500"
                      onClick={() => handlePagar(item.pedidoId)} // Chama a função handlePagar
                    >
                      Pagar
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PedidoItemList;
