import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ProdutoPage from './pages/ProdutoPage';
import FornecedorPage from './pages/FornecedorPage';
import ClientePage from './pages/ClientePage';
import PedidoPage from './pages/PedidoPage';
import LoginPage from './components/usuarios/LoginPage';
import CadastroPage from './components/usuarios/CadastroPage';
import TransacaoPage from './pages/TransacaoPage';

import NavBar from './components/NavBar';
import { ProdutoProvider } from './context/ProdutoContext';
import { FornecedorProvider } from './context/FornecedorContext';
import { ClienteProvider } from './context/ClienteContext';
import { PedidoItemProvider } from './context/PedidoItemContext';
import { PedidoProvider } from './context/PedidoContext';
import { TransacaoProvider } from './context/TransacaoContext';
import { UsuarioProvider } from './context/UsuarioContext';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <UsuarioProvider>
        <TransacaoProvider>
          <PedidoItemProvider>
            <PedidoProvider>
              <ClienteProvider>
                <ProdutoProvider>
                  <FornecedorProvider>
                    <Router>
                      <NavBar />
                      <Routes>
                        {/* Rotas Públicas */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/cadastro" element={<CadastroPage />} />

                        {/* Rotas Protegidas */}
                        <Route
                          path="/produtos"
                          element={
                            <ProdutoPage />
                          }
                        />
                        <Route
                          path="/fornecedores"
                          element={
                            <FornecedorPage />
                          }
                        />
                        <Route
                          path="/clientes"
                          element={
                            <ClientePage />
                          }
                        />
                        <Route
                          path="/pedidos"
                          element={
                            <PedidoPage />
                          }
                        />
                        <Route
                          path="/transacao"
                          element={
                            <TransacaoPage />
                          }
                        />


                        <Route path="/" element={<HomePage />} />
                      </Routes>
                    </Router>
                  </FornecedorProvider>
                </ProdutoProvider>
              </ClienteProvider>
            </PedidoProvider>
          </PedidoItemProvider>
        </TransacaoProvider>
      </UsuarioProvider>
    </AuthProvider>
  );
}

export default App;
