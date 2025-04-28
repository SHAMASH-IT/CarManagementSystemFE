'use client';

import React, { useState } from 'react';
import { FaUsers, FaChartLine, FaStar, FaClipboardList, FaDownload, FaFilter } from 'react-icons/fa';

const DashboardAdmin = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mensuel');
  const [activeTab, setActiveTab] = useState('apercu');

  const kpis = [
    {
      title: "Utilisateurs Actifs",
      value: "1,234",
      icon: <FaUsers className="w-8 h-8 text-blue-500" />,
      change: "+12%"
    },
    {
      title: "Taux de Satisfaction",
      value: "92%",
      icon: <FaStar className="w-8 h-8 text-yellow-500" />,
      change: "+5%"
    },
    {
      title: "Services Actifs",
      value: "48",
      icon: <FaClipboardList className="w-8 h-8 text-green-500" />,
      change: "+3"
    },
    {
      title: "Performance Globale",
      value: "95%",
      icon: <FaChartLine className="w-8 h-8 text-purple-500" />,
      change: "+8%"
    }
  ];

  const rapportsPersonnalises = [
    { id: 1, nom: "Performance Mensuelle", date: "01/03/2024", type: "Excel" },
    { id: 2, nom: "Satisfaction Client Q1", date: "15/03/2024", type: "PDF" },
    { id: 3, nom: "Analyse des Services", date: "20/03/2024", type: "Excel" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord Administrateur</h1>
        <div className="flex gap-4">
          <select 
            className="px-4 py-2 rounded-lg border border-gray-300"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="mensuel">Vue Mensuelle</option>
            <option value="trimestriel">Vue Trimestrielle</option>
            <option value="annuel">Vue Annuelle</option>
          </select>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button 
              className={`px-4 py-2 ${activeTab === 'apercu' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              onClick={() => setActiveTab('apercu')}
            >
              Aperçu
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'rapports' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              onClick={() => setActiveTab('rapports')}
            >
              Rapports
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'apercu' ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">{kpi.icon}</div>
                  <span className="text-sm font-semibold text-green-600">{kpi.change}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">{kpi.title}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Rapports et Satisfaction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Rapports des Services</h2>
                <button className="text-blue-500 hover:text-blue-600">
                  <FaFilter className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {["Service Client", "Support Technique", "Marketing", "Ventes"].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{service}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${Math.floor(Math.random() * 40 + 60)}%`}}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">Bon</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Satisfaction Client</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score NPS</span>
                  <span className="text-lg font-bold text-green-600">78</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Promoteurs</span>
                    <span className="font-medium">82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: "82%"}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Neutres</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: "12%"}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Détracteurs</span>
                    <span className="font-medium">6%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: "6%"}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Section Rapports Personnalisés
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Rapports Personnalisés</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <span>Nouveau Rapport</span>
              <FaDownload className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du Rapport</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rapportsPersonnalises.map((rapport) => (
                  <tr key={rapport.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{rapport.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{rapport.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{rapport.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaDownload className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;