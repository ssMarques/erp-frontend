import { Label } from '../ui/label';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { usePedidoContext } from '../../context/PedidoContext';
import { useCliente } from '../../context/ClienteContext';
import { usePedidoItemContext } from '../../context/PedidoItemContext';
import { useProduto } from '../../context/ProdutoContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useEffect, useState, FormEvent } from 'react';

const PedidoCompletoForm: React.FC = () => {
    const [clienteId, setClienteId] = useState<string>('');
    const [pedidoError, setPedidoError] = useState<string | null>(null);
    const [createdPedidoId, setCreatedPedidoId] = useState<number | null>(null);
    const [itemAdded, setItemAdded] = useState<boolean>(false); // Novo estado para controlar o botão de finalizar

    const { addPedido } = usePedidoContext();
    const { clientes, fetchClientes } = useCliente();
    const [produtoId, setProdutoId] = useState<number>(0);
    const [quantidade, setQuantidade] = useState<number>(1);
    const [precoUnitario, setPrecoUnitario] = useState<number>(0);
    const [quantidadeDisponivel, setQuantidadeDisponivel] = useState<number>(0);
    const [quantidadeError, setQuantidadeError] = useState<string | null>(null);
    const { adicionarPedidoItem } = usePedidoItemContext();
    const { produtos, fetchProdutos } = useProduto();

    useEffect(() => {
        fetchClientes();
        fetchProdutos();
    }, [fetchClientes, fetchProdutos]);

    const handlePedidoSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setPedidoError(null);

        if (!clienteId) {
            setPedidoError('O Cliente é obrigatório.');
            return;
        }

        const clienteExistente = clientes.some(cliente => String(cliente.id) === clienteId);
        if (!clienteExistente) {
            setPedidoError('Cliente não encontrado.');
            return;
        }

        try {
            const pedidoCriadoId = await addPedido(clienteId);
            setCreatedPedidoId(Number(pedidoCriadoId));
            setClienteId('');
        } catch (err) {
            setPedidoError('Erro ao processar o pedido. Tente novamente.');
            console.error(err);
        }
    };

    const handleProdutoChange = (value: string) => {
        const produtoSelecionado = produtos.find(produto => produto.id === Number(value));
        if (produtoSelecionado) {
            setProdutoId(Number(produtoSelecionado.id));
            setPrecoUnitario(produtoSelecionado.preco);
            setQuantidadeDisponivel(produtoSelecionado.quantidade); 
        }
    };

    const handleQuantidadeChange = (value: number) => {
        setQuantidade(value);
        if (value > quantidadeDisponivel) {
            setQuantidadeError(`Quantidade indisponível. Apenas ${quantidadeDisponivel} em estoque.`);
        } else {
            setQuantidadeError(null);
        }
    };

    const handlePedidoItemSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!produtoId || quantidade <= 0 || !createdPedidoId || quantidade > quantidadeDisponivel) {
            return;
        }

        try {
            await adicionarPedidoItem(createdPedidoId, produtoId, quantidade, precoUnitario);
            setItemAdded(true); // Define que ao menos um item foi adicionado
            setProdutoId(0);
            setQuantidade(1);
            setPrecoUnitario(0);
            setQuantidadeDisponivel(0);
            setQuantidadeError(null);
        } catch (error) {
            console.error('Erro ao adicionar item ao pedido', error);
        }
    };

    // Função para resetar o formulário ao finalizar o pedido
    const handleFinalizePedido = () => {
        setCreatedPedidoId(null);
        setItemAdded(false);
        setClienteId('');
        setProdutoId(0);
        setQuantidade(1);
        setPrecoUnitario(0);
        setQuantidadeDisponivel(0);
        setQuantidadeError(null);
    };

    return (
        <div className="pedido-completo-form space-y-8 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            {!createdPedidoId && (
                <form onSubmit={handlePedidoSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-center mb-4">Criar Pedido</h2>
                    <div>
                        <Label htmlFor="clienteId" className="block text-sm font-medium text-gray-700">Cliente</Label>
                        <Select value={clienteId} onValueChange={setClienteId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                {clientes.map(cliente => (
                                    <SelectItem key={cliente.id} value={String(cliente.id)}>
                                        {cliente.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {pedidoError && <div className="text-red-500 text-sm">{pedidoError}</div>}
                    <Button type="submit" className="w-full py-2 px-4 text-white rounded-md">
                        Criar Pedido
                    </Button>
                </form>
            )}

            {createdPedidoId !== null && createdPedidoId !== 0 && (
                <form onSubmit={handlePedidoItemSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-center mb-4">Adicionar Itens ao Pedido</h2>
                    
                    <div>
                        <Label htmlFor="produtoId" className="block text-sm font-medium text-gray-700">Produto</Label>
                        <Select value={produtoId ? String(produtoId) : ''} onValueChange={handleProdutoChange} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                            <SelectContent>
                                {produtos.map(produto => (
                                    <SelectItem key={produto.id} value={String(produto.id)}>
                                        {produto.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">Quantidade</Label>
                        <Input
                            type="number"
                            value={quantidade || ''}
                            onChange={e => handleQuantidadeChange(Number(e.target.value))}
                            required
                            min={1}
                        />
                        {quantidadeError && <div className="text-red-500 text-sm">{quantidadeError}</div>}
                    </div>

                    <div>
                        <Label htmlFor="precoUnitario" className="block text-sm font-medium text-gray-700">Preço Unitário</Label>
                        <Input
                            type="number"
                            value={precoUnitario}
                            readOnly
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full py-2 px-4 text-white rounded-md">
                        Adicionar Item
                    </Button>

                    {itemAdded && (
                        <Button 
                            type="button" 
                            onClick={handleFinalizePedido} 
                            className="w-full py-2 px-4 mt-4 text-white bg-green-500 rounded-md"
                        >
                            Finalizar Pedido
                        </Button>
                    )}
                </form>
            )}
        </div>
    );
};

export default PedidoCompletoForm;
