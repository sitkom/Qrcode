"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintQRCode from '../components/PrintQRCode';
import * as XLSX from 'xlsx';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const QrPage: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [taille, setTaille] = useState<string>('400');
  const [nom, setNom] = useState<string>('');
  const [prenom, setPrenom] = useState<string>('');
  const [qrCodes, setQrCodes] = useState<Array<{ nom: string, prenom: string, code: string, taille: string }>>([]);
  const [lastQrCode, setLastQrCode] = useState<{ nom: string, prenom: string, code: string, taille: string } | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const generateRandomCode = () => {
    const length = Math.floor(Math.random() * 5) + 6; // Génère une longueur entre 6 et 10
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleChangeTaille = (e: ChangeEvent<HTMLInputElement>) => {
    setTaille(e.target.value);
  };

  const handleChangeNom = (e: ChangeEvent<HTMLInputElement>) => {
    setNom(e.target.value);
  };

  const handleChangePrenom = (e: ChangeEvent<HTMLInputElement>) => {
    setPrenom(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newQrCode = { nom, prenom, code, taille };
    if (editIndex !== null) {
      const updatedQrCodes = [...qrCodes];
      updatedQrCodes[editIndex] = newQrCode;
      setQrCodes(updatedQrCodes);
      setEditIndex(null);
    } else {
      setQrCodes([...qrCodes, newQrCode]);
    }
    setLastQrCode(newQrCode);
    setNom('');
    setPrenom('');
    setCode('');
    setTaille('400');
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

  const handleExport = () => {
    const data = [
      ['Nom', 'Prénom', 'Code', 'Taille'],
      ...qrCodes.map(qr => [qr.nom, qr.prenom, qr.code, qr.taille]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'QR Data');

    XLSX.writeFile(workbook, 'qr_data.xlsx');
  };

  const handleEdit = (index: number) => {
    const qrCode = qrCodes[index];
    setNom(qrCode.nom);
    setPrenom(qrCode.prenom);
    setCode(qrCode.code);
    setTaille(qrCode.taille);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedQrCodes = qrCodes.filter((_, i) => i !== index);
    setQrCodes(updatedQrCodes);
  };

  return (
    <div className="flex flex-row h-screen dark">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6 mr-4">
        <h1 className="text-2xl font-bold text-gray-200 mb-4">
          Générateur de QR Code
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <button
            type="button"
            onClick={generateRandomCode}
            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
          >
            Générer un code aléatoire
          </button>
          {code && (
            <div className="text-gray-200 mb-4">
              <strong>Code généré:</strong> {code}
            </div>
          )}
          <div className="flex justify-center mt-4">
            <a className="text-sm text-gray-400 hover:underline mb-2" href="#">Choisir la taille de votre QR code</a>
          </div>
          <input
            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            type="text"
            value={taille}
            onChange={handleChangeTaille}
            placeholder="Taille du QR Code..."
          />
          <input
            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            type="text"
            value={nom}
            onChange={handleChangeNom}
            placeholder="Nom..."
          />
          <input
            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            type="text"
            value={prenom}
            onChange={handleChangePrenom}
            placeholder="Prénom..."
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150"
          >
            {editIndex !== null ? 'Modifier' : 'Ajouter'}
          </button>
        </form>
        {lastQrCode && (
          <div className="mt-6" ref={printRef}>
            <PrintQRCode text={lastQrCode.code} size={parseInt(lastQrCode.taille, 10)} logo="/ecir.png" />
            <p className="text-gray-200 mt-2"><strong>Nom:</strong> {lastQrCode.nom}</p>
            <p className="text-gray-200"><strong>Prénom:</strong> {lastQrCode.prenom}</p>
            <p className="text-gray-200"><strong>Code:</strong> {lastQrCode.code}</p>
          </div>
        )}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handlePrint}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 hover:to-pink-600 transition ease-in-out duration-150"
          >
            Imprimer
          </button>
          <button
            onClick={handleExport}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-600 hover:to-orange-600 transition ease-in-out duration-150"
          >
            Exporter
          </button>
        </div>
      </div>
      <div className="w-1/3 bg-gray-800 rounded-lg shadow-md p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-200 mb-4">Liste des QR Codes</h2>
        <ul className="space-y-4">
          {qrCodes.map((qr, index) => (
            <li key={index} className="bg-gray-700 text-gray-200 p-4 rounded-md flex justify-between items-center">
              <div>
                <p><strong>Nom:</strong> {qr.nom}</p>
                <p><strong>Prénom:</strong> {qr.prenom}</p>
                <p><strong>Code:</strong> {qr.code}</p>
                <p><strong>Taille:</strong> {qr.taille}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition ease-in-out duration-150"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition ease-in-out duration-150"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QrPage;
