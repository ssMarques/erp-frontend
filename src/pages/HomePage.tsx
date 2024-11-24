import { To, useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const handleButtonClick = (path: To) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Seção de Funcionalidades Principais */}
      <section className="w-full max-w-5xl mb-10">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Funcionalidades Principais</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Gerenciamento de Produtos",
              description: "Consulte e cadastre novos produtos com facilidade. Clique em ver mais para acessar todas as funcionalidades!",
              path: "/produtos",
            },
            {
              title: "Relatórios de Vendas",
              description: "Gere relatórios detalhados para analisar seu desempenho de vendas e tomar decisões informadas.",
              path: "",
            },
            {
              title: "Cadastro de Fornecedores",
              description: "Mantenha um registro organizado de seus fornecedores, incluindo contatos, produtos fornecidos e histórico de compras.",
              path: "/fornecedores", 
            },
            {
              title: "Gestão de Clientes",
              description: "Armazene informações sobre seus clientes, como histórico de compras, preferências e contatos, para um atendimento personalizado.",
              path: "/clientes",
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
              <h3 className="text-2xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <button
                onClick={() => handleButtonClick(feature.path)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Ver Mais
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="w-full max-w-5xl mb-10">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Sobre a Nossa Empresa</h2>
        <p className="text-gray-600 text-center">
          A <strong>ERP Fácil</strong> é uma empresa inovadora dedicada a transformar a gestão de vendas, oferecendo soluções que maximizam
          o potencial de negócios e simplificam operações. Comprometida com a satisfação do cliente, a ERP Fácil disponibiliza um sistema intuitivo de 
          gestão de vendas, integração com e-commerce e ferramentas de análise de desempenho, tudo apoiado por suporte contínuo. Além disso, a empresa 
          se dedica a contribuir com o desenvolvimento das comunidades em que atua, promovendo práticas sustentáveis e apoiando iniciativas locais.
        </p>
      </section>

      {/* Rodapé */}
      <footer className="mt-10 w-full bg-gray-800 text-white p-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4">Contato</h3>
          <p className="mb-2">E-mail: <a href="mailto:erpfacil@hotmail.com" className="text-blue-400 hover:underline">erpfacil@hotmail.com</a></p>
          <p className="mb-2">Telefone: <span className="text-blue-400">(45) 99871-4428</span></p>
          <p className="mb-4">Endereço: Av. Brasil, 1012 - Cascavel, Paraná, 85103-000</p>
          <div className="flex justify-center mb-4">
            <a href="#" className="mx-2 text-blue-400 hover:underline">Facebook</a>
            <a href="#" className="mx-2 text-blue-400 hover:underline">Instagram</a>
            <a href="#" className="mx-2 text-blue-400 hover:underline">LinkedIn</a>
          </div>
          <p>© 2024 Sistema de Vendas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
