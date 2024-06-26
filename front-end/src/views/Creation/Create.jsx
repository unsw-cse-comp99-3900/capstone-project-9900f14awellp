import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ResponsiveAppBar } from "../../components/Navbar";
import CardSelector from "../../components/Creation/File2GUIselect/CardSelector";
import ProgressIndicator from "../../components/Creation/CreationProgress/Progress";

import './global.css';

export default function Create() {
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();
  
    const steps = ['Select', 'Fill/Upload', 'Done'];
    const currentStep = 0;
  
    const cards = [
      { icon: '✏️', title: 'GUI Form', route: '/form' },
      { icon: '< >', title: 'File Upload', route: '/upload' },
    ];
  
    const handleCardSelect = (index) => {
      setSelectedCard(index);
    };
  
    const handleContinue = () => {
      if (selectedCard !== null) {
        navigate(cards[selectedCard].route);
      }
    };

    const handleBack = () => {
        console.log('No Back in this Page');
    }
  
    return (
      <div className='center'>
        <ResponsiveAppBar />
        <div className="title">Create your E-invoice</div>
        <CardSelector 
          cards={cards}
          selectedCard={selectedCard}
          onCardSelect={handleCardSelect}
        />
        <ProgressIndicator 
          steps={steps} 
          currentStep={currentStep} 
          onContinue={handleContinue}
          onBack={handleBack}
        />
      </div>
    );
  }