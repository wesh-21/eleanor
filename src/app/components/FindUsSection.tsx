import React from 'react';
import GoogleMapsEmbed from './GoogleMapsEmbed'; // Certifique-se de que este caminho de importação está correto

const FindUsSection = () => {
  // Função para lidar com o clique no botão de Obter Direções
  const handleGetDirections = () => {
    // Endereço codificado para URL
    const destination = encodeURIComponent("Eleanor, Estr. Conceição da Abóboda 1010, 2785-020 São Domingos de Rana");
    
    // Criar URL de direções do Google Maps
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    
    // Abrir numa nova aba
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl md:text-3xl font-serif mb-6">Encontre-nos</h2>
     
      {/* Google Map */}
      <GoogleMapsEmbed />
     
      <div className="mt-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm sm:text-base">Eleanor, Estr. Conceição da Abóboda 1010<br />2785-020 São Domingos de Rana</p>
        </div>
       
        <div className="mt-4">
          <button
            className="px-4 sm:px-6 py-2 rounded-md text-white font-medium hover:opacity-90 transition"
            style={{ backgroundColor: "#F3CEC6", color: "#333" }}
            onClick={handleGetDirections}
            aria-label="Obter direções para Eleanor"
          >
            Obter Direções
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindUsSection;