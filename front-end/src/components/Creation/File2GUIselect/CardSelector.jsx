import React from "react";
import "./CardSelector.css";
import { MagicCard } from "../MagicCard/MagicCard";

const CardSelector = ({ cards, selectedCard, onCardSelect }) => {
  return (
    <div className="card-selector-div">
      <div className="card-selector">
        {cards.map((card, index) => (
          <MagicCard
            key={index}
            selected={selectedCard === index}
            className={`card ${selectedCard === index ? "selected" : ""}`}
            onClick={() => onCardSelect(index)}
          >
            <div className="card-content">
              <div className="card-icon">{card.icon}</div>
              <div className="card-title">{card.title}</div>
            </div>
          </MagicCard>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;
