export interface Usuario {
  id: number;        
  nome: string;      
  email: string;     
  senha: string;     
  permissao: 'admin' | 'usuario_comum';  
}
