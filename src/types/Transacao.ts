export interface Transacao {
    id: number;
    valor: number;
    tipo: 'Entrada' | 'Saída';
    produtoId: number | null;
    pedidoId: number | null;
    data: string;
  }
  