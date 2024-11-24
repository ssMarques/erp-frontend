
import TransacaoList from "@/components/transacao/TransacaoList";

const TransacaoPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Gerenciamento de Transações</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <TransacaoList/>
      </div>
    </div>
  );
};

export default TransacaoPage;
