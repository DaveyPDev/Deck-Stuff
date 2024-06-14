import React from 'react';
import './DeckCard.css'

const DeckCard = ({ card, onRemove, onAdd }) => {
	return (
		<div className="DeckCard deckCard">
			<img src={card.images.small} alt={card.name} />
			<div className="cardCount buttonContainer">
				<button onClick={() => onRemove(card.id)}>-</button>
				<p>{card.quantity}</p>
				<button onClick={() => onAdd(card)}>+</button>
			</div>
		</div>
	);
};

export default DeckCard;


