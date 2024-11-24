import { ItemPedido } from "./PedidoItem";


export interface Pedido {
  id?: number;
  clienteId: string;
  status: 'Pendente' | 'Concluído'
  total: number;
  itens: ItemPedido[]; 
}