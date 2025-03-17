const Footer: React.FC = () => {
    return (
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <p className="text-sm">© {new Date().getFullYear()} Nome do Salão. Todos os direitos reservados.</p>
          <nav className="flex space-x-4">
            <a href="#" className="hover:underline">Política de Privacidade</a>
            <a href="#" className="hover:underline">Termos de Serviço</a>
            <a href="#" className="hover:underline">Contato</a>
          </nav>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  