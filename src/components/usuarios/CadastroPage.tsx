import React from 'react';
import AuthForm from './AuthForm';

const CadastroPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <AuthForm isLogin={false} />
      </div>
    </div>
  );
};

export default CadastroPage;
