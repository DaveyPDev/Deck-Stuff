import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ card }) => {
	// console.log('Rendering Card:', card);
	return (
		<Link to={`/cards/${card.id}`}>
			<div className="Card">
				<img src={card.images.small} alt={card.name} />
			</div>
		</Link>
	);
};

export default Card;

// import React from 'react';
// import './Card.css';

// const Card = ({ card, onAdd}) => {
// 	console.log('Rendering Card:', card);
// 	return (
// 		<div className="Card" onClick={() => onAdd(card)}>
// 			<img src={card.imageUrl} alt={card.name} />
// 		</div>
// 	);
// };

// export default Card;