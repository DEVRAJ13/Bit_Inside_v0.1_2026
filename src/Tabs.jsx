import { useState } from 'react'
import { House, Search, MessageCircle, UserRound } from "lucide-react";
import './Tabs.css'
import Home from './Home';
import Explore from './Explore';
import Community from './Community';
import Profile from './Profile';


function Tabs() {
  const [activeTab, setActiveTab] = useState('home');
 
  const tabs = [
    {id: 'home', icon: House, label: 'Home'},
    {id: 'explore', icon: Search, label: 'Explore'},
    {id: 'community', icon: MessageCircle, label: 'Community'},
    {id: 'profile', icon: UserRound, label: 'Profile'}
  ]

  function renderContent() {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'explore':
        return <Explore />;
      case 'community':
        return <Community />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  }

  return (
    <div className="tabs-container">
      <div className="page-content">
        {renderContent()} 
        </div>
      <div className="tabs-header">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-label={tab.label}
              >
                <Icon size={28} strokeWidth={1.8} />
              </button>
            )
          })}
        </div>
    </div>
  );
}

export default Tabs;