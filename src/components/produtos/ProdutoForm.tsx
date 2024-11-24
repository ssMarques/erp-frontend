import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useProduto } from '../../context/ProdutoContext';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { useFornecedor } from '../../context/FornecedorContext';


const ProdutoForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    imagem: '',
    fornecedorId: '',
  });
  const [erros, setErros] = useState({
    geral: '',
    preco: '',
    quantidade: '',
    imagem: '',
    fornecedorId: '',
  });

  const { addProduto, validarPreco, validarQuantidade, validarImagemUrl } = useProduto();
  const { fornecedores } = useFornecedor();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'preco') {
      setErros({ ...erros, preco: validarPreco(Number(value)) ? '' : 'Preço inválido.' });
    } else if (name === 'quantidade') {
      setErros({ ...erros, quantidade: validarQuantidade(Number(value)) ? '' : 'Quantidade deve ser um número inteiro e maior que zero.' });
    } else if (name === 'imagem') {
      setErros({ ...erros, imagem: validarImagemUrl(value) ? '' : 'URL de imagem inválida.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErros({ geral: '', preco: '', quantidade: '', imagem: '', fornecedorId: '' });

    if (!validarPreco(Number(formData.preco))) {
      setErros((prev) => ({ ...prev, preco: 'Preço inválido.' }));
      return;
    }
    if (!validarQuantidade(Number(formData.quantidade))) {
      setErros((prev) => ({ ...prev, quantidade: 'Quantidade deve ser um número inteiro e maior que zero.' }));
      return;
    }
    if (!validarImagemUrl(formData.imagem)) {
      setErros((prev) => ({ ...prev, imagem: 'URL de imagem inválida.' }));
      return;
    }
    if (!formData.fornecedorId) {
      setErros((prev) => ({ ...prev, fornecedorId: 'Selecione um fornecedor.' }));
      return;
    }

    try {
      await addProduto({
        nome: formData.nome,
        descricao: formData.descricao,
        preco: Number(formData.preco),
        quantidade: Number(formData.quantidade),
        imagem: formData.imagem,
        fornecedorId: Number(formData.fornecedorId),
      });
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        quantidade: '',
        imagem: '',
        fornecedorId: '',
      });
    } catch (error) {
      setErros((prev) => ({ ...prev, geral: 'Falha ao criar o produto. Tente novamente.' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      {erros.geral && <p className="text-red-500 text-sm">{erros.geral}</p>}
      <h2 className="text-2xl font-semibold text-center mb-4">Cadastro de Produto</h2>
      <Input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
      <Input
        type="text"
        name="descricao"
        placeholder="Descrição"
        value={formData.descricao}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
      <Input
        type="number"
        name="preco"
        placeholder="Preço"
        value={formData.preco}
        onChange={handleChange}
        required
        step="0.01"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
      {erros.preco && <p className="text-red-500 text-sm">{erros.preco}</p>}
      <Input
        type="number"
        name="quantidade"
        placeholder="Quantidade"
        value={formData.quantidade}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
      {erros.quantidade && <p className="text-red-500 text-sm">{erros.quantidade}</p>}
      <Input
        type="text"
        name="imagem"
        placeholder="URL da Imagem"
        value={formData.imagem}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
      {erros.imagem && <p className="text-red-500 text-sm">{erros.imagem}</p>}
      
      <div className="space-y-2">
        <Select
          value={formData.fornecedorId}
          onValueChange={(value) => setFormData({ ...formData, fornecedorId: value })}
          required
        >
          <SelectTrigger className="w-full px-4 py-2 border rounded-md">
            <SelectValue placeholder="Selecione um fornecedor" />
          </SelectTrigger>
          <SelectContent>
            {fornecedores.map((fornecedor) => (
              <SelectItem key={fornecedor.id} value={String(fornecedor.id)}>
                {fornecedor.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {erros.fornecedorId && <p className="text-red-500 text-sm">{erros.fornecedorId}</p>}
      </div>

      <Button type="submit" className="w-full py-2 rounded-md transition duration-200">
        Criar Produto
      </Button>
    </form>
  );
};

export default ProdutoForm;
