export interface PedidoItem {
    produtoNome: string;
    id?: number;
    pedidoId: number;
    produtoId: number;        
    quantidade: number;       
    precoUnitario: number;    
  }