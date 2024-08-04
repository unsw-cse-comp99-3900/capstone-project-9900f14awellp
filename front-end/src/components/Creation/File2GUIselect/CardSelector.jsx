import React from "react";
import "./CardSelector.css";
import { MagicCard } from "../MagicCard/MagicCard";

/**
 * CardSelector Component
 *
 * This component renders a selectable list of cards.
 *
 * @param {Object[]} cards - An array of card objects to be displayed
 * @param {number} selectedCard - The index of the currently selected card
 * @param {function} onCardSelect - Callback function to handle card selection
 */
const CardSelector = ({ cards, selectedCard, onCardSelect }) => {
  return (
    // Outer container for the card selector
    <div className="card-selector-div">
      {/*Inner container for the cards*/}
      <div className="card-selector">
        {/* Map through the cards array and render each card */}
        {cards.map((card, index) => (
          <MagicCard
            // Unique key for each card (using index as fallback)
            key={index}
            // Boolean prop to indicate if this card is selected
            selected={selectedCard === index}
            // CSS classes for styling, including 'selected' class when appropriate
            className={`card ${selectedCard === index ? "selected" : ""}`}
            // Click handler to select this card
            onClick={() => onCardSelect(index)}
          >
            {/* Content of each card */}
            <div className="card-content">
              {/* Icon for the card */}
              <div className="card-icon">{card.icon}</div>
              {/* Title of the card */}
              <div className="card-title">{card.title}</div>
            </div>
          </MagicCard>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;
