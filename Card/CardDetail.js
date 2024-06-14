import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './CardDetail.css';

const CardDetails = ({ match, card }) => {
	const [ cardDetails, setCardDetails ] = useState(null);
	const [ error, setError ] = useState(null);
	const { cardId } = useParams();

	const typeSymbols = {
		Grass     : '🌿',
		Fire      : '🔥',
		Water     : '💧',
		Electric  : '⚡️',
		Lightning : '⚡️',
		Psychic   : '🔮',
		Fighting  : '🥊',
		Fairy     : '🧚',
		Normal    : '🐾',
		Colorless : '🐾',
		Flying    : '🦅',
		Poison    : '☠️',
		Ground    : '⛰️',
		Rock      : '🪨',
		Bug       : '🐛',
		Ghost     : '👻',
		Steel     : '🔩',
		Ice       : '❄️',
		Dragon    : '🐉',
		Dark      : '🌑'
	};

	useEffect(
		() => {
			fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`)
				.then((response) => response.json())
				.then((data) => setCardDetails(data.data))
				.catch((error) => {
					console.error('Error fetching card details:', error);
					setError('Error fetching card details. Please try again later.');
				});
		},
		[ cardId ]
	);

	const renderErrorMessage = () => {
		return <p className="error-message">{error}</p>;
	};

	const renderLoadingMessage = () => {
		return <p>Loading card details...</p>;
	};

	const renderCardImage = () => {
		return (
			<div className="CardDetailsImage">
				<img src={cardDetails.images.small} alt={cardDetails.name} className="CardImage" />
			</div>
		);
	};

	const renderCardInfo = () => {
		return (
			<div className="CardDetailsInfo">
				<p>
					<strong>Name:</strong> {cardDetails.name}
				</p>
				{cardDetails.types && (
					<p>
						<strong>Type:</strong> {typeSymbols[cardDetails.types[0]] || 'N/A'}
					</p>
				)}
				{cardDetails.hp && (
					<p>
						<strong>HP:</strong> {cardDetails.hp}
					</p>
				)}
				{cardDetails.supertype && (
					<p>
						<strong>Supertype:</strong> {cardDetails.supertype}
					</p>
				)}
				{cardDetails.subtypes && (
					<p>
						<strong>Subtypes:</strong> {cardDetails.subtypes.join(', ')}
					</p>
				)}
				{/* If the card is a special energy card, render the special energy card rules */}
				{cardDetails.subtypes &&
				cardDetails.subtypes.includes('Special') &&
				cardDetails.rules &&
				cardDetails.rules.length > 0 && (
					<div>
						<strong>Special Energy:</strong>
						{cardDetails.rules.map((rule, index) => {
							if (
								rule.startsWith('This card provides') ||
								rule.startsWith('While this card is attached to')
							) {
								return (
									<div key={index} className="SpecialEnergyDetail">
										{rule}
									</div>
								);
							}
							return null;
						})}
					</div>
				)}
				{cardDetails.evolvesFrom && (
					<p>
						<strong>Evolves From:</strong> {cardDetails.evolvesFrom}
					</p>
				)}
				{/* If the card is a WOTC trainer card, render the trainer effect */}
				{!cardDetails.subtypes &&
				cardDetails.rules &&
				cardDetails.rules.length > 0 && (
					<div className="WOTCTrainerDetail">
						<strong>Trainer Effect:</strong> {cardDetails.rules[0]}
					</div>
				)}
				{/* If the card is an item, render rule1 under the subtypes */}
				{cardDetails.subtypes &&
				cardDetails.subtypes.includes('Item') &&
				cardDetails.rules &&
				cardDetails.rules.length > 0 && (
					<div className="ItemDetail">
						<strong>Item:</strong> {cardDetails.rules[0]}
					</div>
				)}
				{/* If the card is a supporter, render rule1 under the subtypes*/}
				{cardDetails.subtypes &&
				cardDetails.subtypes.includes('Supporter') &&
				cardDetails.rules &&
				cardDetails.rules.length > 0 && (
					<div className="SupporterDetail">
						<strong>Supporter:</strong> {cardDetails.rules[0]}
					</div>
				)}
				{/* If the card is a tool, render rule1 under the subtypes*/}
				{cardDetails.subtypes &&
				cardDetails.subtypes.includes('Pokémon Tool') &&
				cardDetails.rules &&
				cardDetails.rules.length > 0 && (
					<div className="ToolDetail">
						<strong>Tool:</strong> {cardDetails.rules[0]}
					</div>
				)}
				
				{/* If the card is a stadium, render rule1 under the subtypes*/}
				{cardDetails.subtypes &&
				cardDetails.subtypes.includes('Stadium') &&
				cardDetails.rules &&
				cardDetails.rules.length > 0 && (
					<div className="StadiumDetail">
						<strong>Stadium:</strong> {cardDetails.rules[1]}
					</div>
				)}
				{/* If the card has abilities, render them */}
				{cardDetails.abilities &&
				cardDetails.abilities.length > 0 && (
					<div>
						<p>
							{cardDetails.abilities.map((ability, index) => (
								<div key={index} className="AbilityDetail">
									{ability.type === 'Ability' && (
										<div>
											<strong>Ability - {ability.name}:</strong>
											<p className="AbilityEffect">{ability.text}</p>
										</div>
									)}
									{ability.type === 'Poké-Power' && (
										<div>
											<strong>Poké-Power - {ability.name}:</strong>
											<p className="AbilityEffect">{ability.text}</p>
										</div>
									)}
									{ability.type === 'Poké-Body' && (
										<div>
											<strong>Poké-Body - {ability.name}:</strong>
											<p className="AbilityEffect">{ability.text}</p>
										</div>
									)}
									{ability.type === 'Pokémon Power' && (
										<div>
											<strong>Pokémon Power - {ability.name}:</strong>
											<p className="AbilityEffect">{ability.text}</p>
										</div>
									)}
								</div>
							))}
						</p>
					</div>
				)}

				{cardDetails.attacks &&
				cardDetails.attacks.length > 0 && (
					<div>
						<p>
							<strong>Attacks:</strong>
							{cardDetails.attacks.map((attack, index) => (
								<div key={index} className="AttackDetail">
									<strong>{attack.name}:</strong> {attack.text}
									{attack.cost && (
										<span className="AttackCost">
											{' '}
											{attack.cost.map((cost) => typeSymbols[cost]).join(' ')}
										</span>
									)}
									{attack.damage && <span className="AttackDamage"> - Damage: {attack.damage}</span>}
								</div>
							))}
						</p>
					</div>
				)}
				{cardDetails.weaknesses &&
				cardDetails.weaknesses.length > 0 && (
					<p>
						<strong>Weaknesses:</strong> {typeSymbols[cardDetails.weaknesses[0].type] || 'N/A'}
					</p>
				)}
				{cardDetails.resistances &&
				cardDetails.resistances.length > 0 && (
					<p>
						<strong>Resistance:</strong> {typeSymbols[cardDetails.resistances[0].type] || 'N/A'}
					</p>
				)}
				{cardDetails.retreatCost &&
				cardDetails.retreatCost.length > 0 && (
					<p>
						<strong>Retreat Cost:</strong>{' '}
						{cardDetails.retreatCost.map((type) => typeSymbols[type]).join(' ') || 'N/A'}
					</p>
				)}

				{cardDetails.rules &&
				cardDetails.rules.length > 0 && (
					<div>
						{cardDetails.rules.map((rule, index) => {
							if (rule.includes('VSTAR')) {
								const [ vstarLabel, vstarRule ] = rule.split(': ', 2);
								return (
									<div key={index}>
										<p>
											<strong>{vstarLabel}:</strong> {vstarRule}
										</p>
									</div>
								);
							}
							if (rule.includes('Radiant Pokémon Rule')) {
								const [ radiantLabel, radiantRule ] = rule.split(': ', 2);
								return (
									<div key={index}>
										<strong>{radiantLabel}:</strong> {radiantRule}
									</div>
								);
							}
							if (rule.includes('Prism Star')) {
								const [ prismStarLabel, prismStarRule ] = rule.split(': ', 2);
								return (
									<div key={index}>
										<strong>{prismStarLabel}:</strong> {prismStarRule}
									</div>
								);
							}
							return null;
						})}
					</div>
				)}

				{cardDetails.set && (
					<p>
						<strong>Set Name:</strong> {cardDetails.set.name || 'N/A'}
					</p>
				)}
				{cardDetails.rarity && (
					<p>
						<strong>Rarity:</strong> {cardDetails.rarity}
					</p>
				)}
				{cardDetails.flavorText && (
					<p className="flavor-text">
						<strong>Flavor Text:</strong> {cardDetails.flavorText}
					</p>
				)}
			</div>
		);
	};

	return (
		<div className="CardDetails">
			<div className="CardDetailsContainer">
				{cardDetails ? (
					<React.Fragment>
						{renderCardImage()}
						{renderCardInfo()}
					</React.Fragment>
				) : error ? (
					renderErrorMessage()
				) : (
					renderLoadingMessage()
				)}
			</div>
		</div>
	);
};

export default CardDetails;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// import './CardDetail.css';

// const CardDetails = ({ match, card }) => {
// 	const [ cardDetails, setCardDetails ] = useState(null);
// 	const [ error, setError ] = useState(null);
// 	const { cardId } = useParams();

// 	useEffect(
// 		() => {
// 			fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`)
// 				.then((response) => response.json())
// 				.then((data) => setCardDetails(data.data))
// 				.catch((error) => {
// 					console.error('Error fetching card details:', error);
// 					setError('Error fetching card details. Please try again later.');
// 				});
// 		},
// 		[ cardId ]
// 	);

// 	if (error) {
// 		return <p className="error-message">{error}</p>;
// 	}

// 	if (!cardDetails) {
// 		return <p>Loading card details...</p>;
// 	}
// 	// ...
// 	const typeSymbols = {
// 		Grass     : '🌿',
// 		Fire      : '🔥',
// 		Water     : '💧',
// 		Electric  : '⚡️',
// 		Lightning : '⚡️',
// 		Psychic   : '🔮',
// 		Fighting  : '🥊',
// 		Fairy     : '🧚',
// 		Normal    : '🐾',
// 		Colorless : '🐾',
// 		Flying    : '🦅',
// 		Poison    : '☠️',
// 		Ground    : '⛰️',
// 		Rock      : '🪨',
// 		Bug       : '🐛',
// 		Ghost     : '👻',
// 		Steel     : '🔩',
// 		Ice       : '❄️',
// 		Dragon    : '🐉',
// 		Dark      : '🌑'
// 	};
//   // ...

//   return (
//     <div className="CardDetails">
//       <div className="CardDetailsContainer">
//         <div className="CardDetailsImage">
//           <img src={cardDetails.images.small} alt={cardDetails.name} className="CardImage" />
//         </div>
//         <div className="CardDetailsInfo">
//           <h3>Card Details</h3>
//           <p>
//             <strong>Name:</strong> {cardDetails.name}
//           </p>
//           {cardDetails.types && (
//             <p>
//               <strong>Type:</strong> {typeSymbols[cardDetails.types[0]] || 'N/A'}
//             </p>
//           )}
//           {cardDetails.hp && (
//             <p>
//               <strong>HP:</strong> {cardDetails.hp}
//             </p>
//           )}
//           {cardDetails.supertype && (
//             <p>
//               <strong>Supertype:</strong> {cardDetails.supertype}
//             </p>
//           )}
//           {cardDetails.subtypes && (
//             <p>
//               <strong>Subtypes:</strong> {cardDetails.subtypes.join(', ')}
//             </p>
//           )}
//           {/* If the card is an item, render rule1 under the subtypes */}
//           {cardDetails.subtypes &&
//             cardDetails.subtypes.includes('Item') &&
//             cardDetails.rules &&
//             cardDetails.rules.length > 0 && (
//               <div>
//                 <strong>Item:</strong> {cardDetails.rules[0]}
//               </div>
//           )}
//          {/* // If the card is a supporter, render rule1 under the subtypes*/}
//           {cardDetails.subtypes &&
//             cardDetails.subtypes.includes('Supporter') &&
//             cardDetails.rules &&
//             cardDetails.rules.length > 0 && (
//               <div>
//                 <strong>Supporter:</strong> {cardDetails.rules[0]}
//               </div>
//           )}
//                 {cardDetails.subtypes &&
//                 cardDetails.subtypes.includes('Tool') &&
//                 cardDetails.rules &&
//                 cardDetails.rules.length > 0 && (
//                   <div>
//                   <strong>Tool:</strong> {cardDetails.rules[1]}
//                   </div>
//                 )}
//                 {/* If the card has abilities, render them */}
//                 {cardDetails.abilities &&
//                 cardDetails.abilities.length > 0 && (
//                   <div>
//                   <strong>Abilities: </strong>
//                   {cardDetails.abilities.map((ability, index) => (
//                     <div key={index}>
//                     <strong>{ability.name}:</strong> {ability.text}
//                     </div>
//                   ))}
//                   </div>
//                 )}

//           {cardDetails.attacks &&
//           cardDetails.attacks.length > 0 && (
//             <div>
//               <strong>Attacks:</strong>
//               {cardDetails.attacks.map((attack, index) => (
//                 <div key={index} className="AttackDetail">
//                   <strong>{attack.name}:</strong> {attack.text}
//                 </div>
//               ))}
//             </div>
//           )}
//           {cardDetails.weaknesses &&
//           cardDetails.weaknesses.length > 0 && (
//             <p>
//               <strong>Weaknesses:</strong> {typeSymbols[cardDetails.weaknesses[0].type] || 'N/A'}
//             </p>
//           )}
//           {cardDetails.resistances &&
//           cardDetails.resistances.length > 0 && (
//             <p>
//               <strong>Resistance:</strong> {typeSymbols[cardDetails.resistances[0].type] || 'N/A'}
//             </p>
//           )}
//           {cardDetails.retreatCost &&
//           cardDetails.retreatCost.length > 0 && (
//             <p>
//               <strong>Retreat Cost:</strong>{' '}
//               {cardDetails.retreatCost.map((type) => typeSymbols[type]).join(', ') || 'N/A'}
//             </p>
//           )}
//           {cardDetails.set && (
//             <p>
//               <strong>Set Name:</strong> {cardDetails.set.name || 'N/A'}
//             </p>
//           )}
//           {cardDetails.rarity && (
//             <p>
//               <strong>Rarity:</strong> {cardDetails.rarity}
//             </p>
//           )}
//           {cardDetails.flavorText && (
//             <p>
//               <strong>Flavor Text:</strong> {cardDetails.flavorText}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
//   };
//   export default CardDetails;
