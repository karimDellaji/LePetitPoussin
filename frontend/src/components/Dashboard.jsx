import { useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import Eleves from './Eleves';
import Presence from './Presence';
import Staff from './Staff';
import Inventaire from './Inventaire';
import EspaceParents from './EspaceParents';
import Depenses from './Depenses';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
    case 'dashboard': return <Home />;
    case 'eleves': return <Eleves />;
    case 'presence': return <Presence />;
    case 'staff': return <Staff />;
    case 'depenses': return <Depenses />; // <-- Ajouté ici
    case 'inventaire': return <Inventaire />;
    case 'espace_parents': return <EspaceParents />;
    default: return <Home />;
  }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
}