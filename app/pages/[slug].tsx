"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintQRCode from '../../components/PrintQRCode';
import { useRouter } from 'next/router'
const QrPage: React.FC = () => {
  const router = useRouter()
  const [url, setUrl] = useState<string>('http://ecirtp.fr');
  const [taille, setTaille] = useState<string>('400');
  const [generate, setGenerate] = useState<boolean>(true);
  const printRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleChangeTaille = (e: ChangeEvent<HTMLInputElement>) => {
    setTaille(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenerate(true);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page { size: 62mm; margin: 0; }
      body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
      div { width: 62mm !important; height: auto !important; }
      canvas { width: 62mm !important; height: auto !important; }
    `,
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen dark">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-200 mb-4">
          Générateur de QR Code
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="Entrez votre code ici..."
          />
          <div className="flex justify-center mt-4">
            <a className="text-sm text-gray-400 hover:underline mb-2" href="#">Choisir la taille de votre QR code {router.query.slug} </a>
          </div>
          <input
            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            type="text"
            value={taille}
            onChange={handleChangeTaille}
            placeholder="Taille du QR Code..."
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150"
          >
            Générer
          </button>
        </form>
        {generate && url && (
          <div className="mt-3" ref={printRef}>
            <PrintQRCode text={url} size={parseInt(taille, 10)} logo="/ecir.png" />
          </div>
        )}
        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-red-600 hover:to-pink-600 transition ease-in-out duration-150"
        >
          Imprimer
        </button>
      </div>
    </div>
  );
};

export default QrPage;
