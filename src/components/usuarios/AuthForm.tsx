import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuarioContext } from '../../context/UsuarioContext';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface AuthFormProps {
  isLogin: boolean; 
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const { createUsuario } = useUsuarioContext();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [permissao, setPermissao] = useState<'admin' | 'usuario_comum'>('usuario_comum');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      console.log('Login com:', { email, senha });
      navigate('/');
    } else {
      if (email && senha && nome) {
        await createUsuario(nome, email, senha, permissao);
        console.log('Usuário cadastrado com sucesso:', { nome, email, senha, permissao });
        navigate('/login');
      } else {
        console.error('Todos os campos são obrigatórios para o cadastro.');
      }
    }

    setEmail('');
    setSenha('');
    setNome('');
    setPermissao('usuario_comum');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-center">{isLogin ? 'Login' : 'Cadastro de Usuário'}</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
          <Input
            type="password"
            id="senha"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
              <Input
                type="text"
                id="nome"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="permissao" className="block text-sm font-medium text-gray-700">Permissão</label>
              <select
                id="permissao"
                name="permissao"
                value={permissao}
                onChange={(e) => setPermissao(e.target.value as 'admin' | 'usuario_comum')}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="usuario_comum">Usuário Comum</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </>
        )}

        <div>
          <Button
            type="submit"
            className="w-full py-2 px-4  text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </Button>
        </div>

        <div className="text-sm text-center">
          {isLogin ? (
            <p>
              Não tem uma conta?{' '}
              <button onClick={() => navigate('/cadastro')} className=" hover:text-indigo-800">
                Cadastre-se
              </button>
            </p>
          ) : (
            <p>
              Já tem uma conta?{' '}
              <button onClick={() => navigate('/login')} className="text-indigo-600 hover:text-indigo-800">
                Entre
              </button>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default AuthForm;
