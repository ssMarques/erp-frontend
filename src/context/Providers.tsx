// context/Providers.tsx
import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UsuarioProvider } from './UsuarioContext';
import { TransacaoProvider } from './TransacaoContext';
import { PedidoItemProvider } from './PedidoItemContext';
import { PedidoProvider } from './PedidoContext';
import { ClienteProvider } from './ClienteContext';
import { ProdutoProvider } from './ProdutoContext';
import { FornecedorProvider } from './FornecedorContext';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <UsuarioProvider>
        <TransacaoProvider>
          <PedidoItemProvider>
            <PedidoProvider>
              <ClienteProvider>
                <ProdutoProvider>
                  <FornecedorProvider>{children}</FornecedorProvider>
                </ProdutoProvider>
              </ClienteProvider>
            </PedidoProvider>
          </PedidoItemProvider>
        </TransacaoProvider>
      </UsuarioProvider>
    </AuthProvider>
  );
};
