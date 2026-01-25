import { Printer, FileText, Download } from 'lucide-react';

export default function Documents() {
  const genererFicheVierge = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Fiche d'Inscription</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 50px; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
            .logo-placeholder { font-size: 24px; font-weight: bold; color: #2563eb; }
            .title { text-align: center; margin: 40px 0; text-transform: uppercase; letter-spacing: 2px; }
            .section { margin-bottom: 30px; }
            .section-title { background: #f3f4f6; padding: 10px; font-weight: bold; margin-bottom: 15px; border-left: 5px solid #2563eb; }
            .field { margin-bottom: 15px; border-bottom: 1px dotted #ccc; padding-bottom: 5px; display: flex; }
            .label { width: 200px; font-weight: bold; }
            .footer { margin-top: 50px; display: flex; justify-content: space-between; font-style: italic; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-placeholder">LePetitPoussin 🐣</div>
            <div>Jardin d'enfants</div>
            <div>Année Scolaire : 2025/2026</div>
          </div>
          
          <h1 class="title">Dossier d'Inscription</h1>

          <div class="section">
            <div class="section-title">INFORMATIONS DE L'ENFANT</div>
            <div class="field"><span class="label">Nom :</span></div>
            <div class="field"><span class="label">Prénom :</span></div>
            <div class="field"><span class="label">Date de naissance :</span></div>
            <div class="field"><span class="label">Allergies/Santé :</span></div>
          </div>

          <div class="section">
            <div class="section-title">REPRÉSENTANTS LÉGAUX</div>
            <div class="field"><span class="label">Nom du Père/Mère :</span></div>
            <div class="field"><span class="label">Téléphone :</span></div>
            <div class="field"><span class="label">Adresse :</span></div>
          </div>

          <div class="footer">
            <p>Fait à ......................., le ..../..../20....</p>
            <p>Signature des parents (précédée de "Lu et approuvé")</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all group">
        <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <FileText size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">Fiche d'Inscription Vierge</h3>
        <p className="text-gray-500 mb-6 text-sm">Générer un formulaire vide pour les nouvelles inscriptions manuscrites.</p>
        <button 
          onClick={genererFicheVierge}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full justify-center"
        >
          <Printer size={18} /> Imprimer le document
        </button>
      </div>
    </div>
  );
}