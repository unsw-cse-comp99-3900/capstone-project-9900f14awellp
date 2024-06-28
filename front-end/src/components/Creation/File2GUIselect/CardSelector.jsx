import React from 'react';
import './CardSelector.css';

const CardSelector = ({ cards, selectedCard, onCardSelect }) => {
  return (
    <div className='card-selector-div'>
      <div className="card-selector">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${selectedCard === index ? 'selected' : ''}`}
            onClick={() => onCardSelect(index)}
          >
            <div className="card-icon">{card.icon}</div>
            <div className="card-title">{card.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;