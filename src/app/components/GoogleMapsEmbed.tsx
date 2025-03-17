import React from 'react';

const GoogleMapEmbed: React.FC = () => {
  return (
    <div className="w-full">
      {/* Map container with responsive aspect ratio */}
      <div className="relative w-full overflow-hidden">
        {/* Mobile: 200px height, Tablet: 300px height, Desktop: 500px height */}
        <div className="h-48 sm:h-64 md:h-96 lg:h-128">
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            style={{ border: 0 }}
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Estr.%20Concei%C3%A7%C3%A3o%20da%20Ab%C3%B3boda%201010,%202785-020%20S%C3%A3o%20Domingos%20de%20Rana+(Eleanor)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            title="Eleanor location map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapEmbed;