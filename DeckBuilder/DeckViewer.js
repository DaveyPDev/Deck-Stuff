// import React from 'react';
// import DeckCard from './DeckCard';
// import './DeckViewer.css';

// const DeckViewer = ({ deck, onRemove, onAdd }) => {
// 	const supertypeOrder = [ 'Pokémon', 'Trainer', 'Energy' ];
// 	const trainerTypes = {
// 		Supporter : 1,
// 		Item      : 2,
// 		Tool      : 3,
// 		Stadium   : 4
// 	};

// 	// Function to extract Pokémon species from the card name
// 	const getPokemonSpecies = (name) => {
// 		// Assuming the Pokémon name format is "Pokemon Species ..."
// 		return name.split(' ')[0];
// 	};

// 	// Sort function for Pokémon cards
// 	const sortPokemonSpecies = (a, b) => {
// 		const speciesA = getPokemonSpecies(a.name);
// 		const speciesB = getPokemonSpecies(b.name);
// 		// Sort alphabetically by species name
// 		return speciesA.localeCompare(speciesB);
// 	};

// 	const sortPokemonTypes = (a, b) => {
// 		// Define the order of evolution stages
// 		const evolutionOrder = {
// 			Basic   : 0,
// 			V       : 1,
// 			LV      : 2,
// 			GX      : 3,
// 			VMAX    : 4,
// 			EX      : 5,
// 			BREAK   : 6,
// 			'Stage 1' : 7,
// 			'Stage 2' : 8
// 		};

// 		const getEvolutionStage = (card) => {
// 			// Initialize evolutionStage to 'Basic' when declaring it
// 			let evolutionStage = 'Basic';
// 			if (card.name.includes('-EX')) {
// 				evolutionStage = 'EX'; // Stage 3 (EX)
// 			}
// 			else if (card.name.includes('-GX')) {
// 				evolutionStage = 'GX'; // Stage 2 (GX)
// 			}
// 			else if (card.name.includes('BREAK') || card.name.includes('VMAX')) {
// 				evolutionStage = 'VMAX'; // Stage 1 (BREAK or VMAX)
// 			}
// 			else if (card.name.includes('V ')) {
// 				evolutionStage = 'V'; // Stage 1 (V)
// 			}
// 			else if (card.name.includes('LV')) {
// 				evolutionStage = 'LV'; // Stage 2 (LV)
// 			}
// 			else if (card.name.includes('Stage 1')) {
// 				evolutionStage = 'Stage 1'; // Regular Stage 1
// 			}
// 			else if (card.name.includes('Stage 2')) {
// 				evolutionStage = 'Stage 2'; // Regular Stage 2
// 			}
// 			return evolutionStage;
// 		};

// 		// Get the evolution stage for each card
// 		const evolutionStageA = getEvolutionStage(a);
// 		const evolutionStageB = getEvolutionStage(b);

// 		// Sort by evolution stage
// 		if (evolutionOrder[evolutionStageA] !== evolutionOrder[evolutionStageB]) {
// 			return evolutionOrder[evolutionStageA] - evolutionOrder[evolutionStageB];
// 		}
// 		else {
// 			// If the evolution stages are the same, sort alphabetically by name
// 			return a.name.localeCompare(b.name);
// 		}
// 	};

// 	// Function to determine the energy type of a card
// 	const getEnergyType = (card) => {
// 		// Define special energy and regular energy types
// 		const specialEnergy = [ 'Special Energy Type 1', 'Special Energy Type 2' ];
// 		const regularEnergy = [ 'Regular Energy Type 1', 'Regular Energy Type 2' ];

// 		// Check if the card name is in special energy types or regular energy types
// 		if (specialEnergy.includes(card.name)) {
// 			console.log(`${card.name} is a Special Energy.`);
// 			return 'Special';
// 		}
// 		else if (regularEnergy.includes(card.name)) {
// 			console.log(`${card.name} is a Regular Energy.`);
// 			return 'Regular';
// 		}
// 		else {
// 			console.log(`${card.name} is not recognized as Special or Regular Energy.`);
// 			return 'Regular'; // Default to regular energy if not specified
// 		}
// 	};

// 	// Sort function for the deck
// 	const sortedDeck = [ ...deck ].sort((a, b) => {
// 		if (supertypeOrder.indexOf(a.supertype) < supertypeOrder.indexOf(b.supertype)) return -1;
// 		if (supertypeOrder.indexOf(a.supertype) > supertypeOrder.indexOf(b.supertype)) return 1;

// 		// Sorting logic for Trainer cards
// 		if (a.supertype === 'Trainer' && b.supertype === 'Trainer') {
// 			const aIsStadium = a.subtypes ? a.subtypes.includes('Stadium') : false;
// 			const bIsStadium = b.subtypes ? b.subtypes.includes('Stadium') : false;

// 			if (aIsStadium && !bIsStadium) return 1;
// 			if (!aIsStadium && bIsStadium) return -1;

// 			const aWeight = a.subtypes
// 				? Math.min(...a.subtypes.map((type) => trainerTypes[type] || Infinity))
// 				: Infinity;
// 			const bWeight = b.subtypes
// 				? Math.min(...b.subtypes.map((type) => trainerTypes[type] || Infinity))
// 				: Infinity;

// 			if (aWeight < bWeight) return -1;
// 			if (aWeight > bWeight) return 1;
// 		}

// 		// Sorting logic for Pokémon cards
// 		if (a.supertype === 'Pokémon' && b.supertype === 'Pokémon') {
// 			return sortPokemonTypes(a, b);
// 		}

// 		// Sorting logic for Energy cards
// 		if (a.supertype === 'Energy' && b.supertype === 'Energy') {
// 			// Sort special energy types before regular energy types
// 			if (a.subtypes.includes('Special') && !b.subtypes.includes('Special')) return -1;
// 			if (!a.subtypes.includes('Special') && b.subtypes.includes('Special')) return 1;

// 			// If both are special or both are regular, sort by subtype
// 			if (a.subtypes[0] && b.subtypes[0]) {
// 				return a.subtypes[0].localeCompare(b.subtypes[0]);
// 			}
// 		}

// 		// Default sorting by name
// 		return a.name.localeCompare(b.name);
// 	});

// 	return (
// 		<div className="DeckViewer">
// 			<h3>Deck</h3>
// 			<div className="deck">
// 				{deck.map((card, index) => (
// 					<div key={index} className="deck-card">
// 						<DeckCard
// 							name={card.name}
// 							set={card.set}
// 							quantity={card.quantity}
// 							onRemove={() => onRemove(card.id)}
// 							onAdd={() => onAdd(card)}
// 						/>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	);
// };
// export default DeckViewer;

import React from 'react';
import DeckCard from './DeckCard';
import './DeckViewer.css';

const DeckViewer = ({ deck, onRemove, onAdd }) => {
    const supertypeOrder = ['Pokémon', 'Trainer', 'Energy'];
    const trainerTypes = {
        'Supporter': 1,
        'Item': 2,
        'Tool': 3,
        'Stadium': 4
    };

     // Function to extract Pokémon species from the card name
    const getPokemonSpecies = (name) => {
        // Assuming the Pokémon name format is "Pokemon Species ..."
        return name.split(' ')[0];
    };

    // Sort function for Pokémon cards
    const sortPokemonSpecies = (a, b) => {
        const speciesA = getPokemonSpecies(a.name);
        const speciesB = getPokemonSpecies(b.name);

        // Sort alphabetically by species name
        return speciesA.localeCompare(speciesB);
    };

    const sortPokemonTypes = (a, b) => {
        // Define the order of evolution stages
        const evolutionOrder = {
            'Basic': 0,
            'V': 1,
            'LV': 2,
            'GX': 3,
            'VMAX': 4,
            'EX': 5,
            'BREAK': 6,
            'Stage 1': 7,
            'Stage 2': 8
        };

        const getEvolutionStage = (card) => {
            // Initialize evolutionStage to 'Basic' when declaring it
            let evolutionStage = 'Basic';

            if (card.name.includes('-EX')) {
                evolutionStage = 'EX'; // Stage 3 (EX)
            } else if (card.name.includes('-GX')) {
                evolutionStage = 'GX'; // Stage 2 (GX)
            } else if (card.name.includes('BREAK') || card.name.includes('VMAX')) {
                evolutionStage = 'VMAX'; // Stage 1 (BREAK or VMAX)
            } else if (card.name.includes('V ')) {
                evolutionStage = 'V'; // Stage 1 (V)
            } else if (card.name.includes('LV')) {
                evolutionStage = 'LV'; // Stage 2 (LV)
            } else if (card.name.includes('Stage 1')) {
                evolutionStage = 'Stage 1'; // Regular Stage 1
            } else if (card.name.includes('Stage 2')) {
                evolutionStage = 'Stage 2'; // Regular Stage 2
            }

            return evolutionStage;
        };

        // Get the evolution stage for each card
        const evolutionStageA = getEvolutionStage(a);
        const evolutionStageB = getEvolutionStage(b);

        // Sort by evolution stage
        if (evolutionOrder[evolutionStageA] !== evolutionOrder[evolutionStageB]) {
            return evolutionOrder[evolutionStageA] - evolutionOrder[evolutionStageB];
        } else {
            // If the evolution stages are the same, sort alphabetically by name
            return a.name.localeCompare(b.name);
        }
    };

    // Function to determine the energy type of a card
    const getEnergyType = (card) => {
        // Define special energy and regular energy types
        const specialEnergy = ['Special Energy Type 1', 'Special Energy Type 2'];
        const regularEnergy = ['Regular Energy Type 1', 'Regular Energy Type 2'];

        // Check if the card name is in special energy types or regular energy types
        if (specialEnergy.includes(card.name)) {
            console.log(`${card.name} is a Special Energy.`);
            return 'Special';
        } else if (regularEnergy.includes(card.name)) {
            console.log(`${card.name} is a Regular Energy.`);
            return 'Regular';
        } else {
            console.log(`${card.name} is not recognized as Special or Regular Energy.`);
            return 'Regular'; // Default to regular energy if not specified
        }
    };

    // Sort function for the deck
    const sortedDeck = [...deck].sort((a, b) => {
        if (supertypeOrder.indexOf(a.supertype) < supertypeOrder.indexOf(b.supertype)) return -1;
        if (supertypeOrder.indexOf(a.supertype) > supertypeOrder.indexOf(b.supertype)) return 1;

        // Sorting logic for Trainer cards
        if (a.supertype === 'Trainer' && b.supertype === 'Trainer') {
            const aIsStadium = a.subtypes ? a.subtypes.includes('Stadium') : false;
            const bIsStadium = b.subtypes ? b.subtypes.includes('Stadium') : false;

            if (aIsStadium && !bIsStadium) return 1;
            if (!aIsStadium && bIsStadium) return -1;

            const aWeight = a.subtypes ? Math.min(...a.subtypes.map(type => trainerTypes[type] || Infinity)) : Infinity;
            const bWeight = b.subtypes ? Math.min(...b.subtypes.map(type => trainerTypes[type] || Infinity)) : Infinity;

            if (aWeight < bWeight) return -1;
            if (aWeight > bWeight) return 1;
        }

        // Sorting logic for Pokémon cards
        if (a.supertype === 'Pokémon' && b.supertype === 'Pokémon') {
            return sortPokemonTypes(a, b);
        }

        // Sorting logic for Energy cards
        if (a.supertype === 'Energy' && b.supertype === 'Energy') {
            // Sort special energy types before regular energy types
            if (a.subtypes.includes('Special') && !b.subtypes.includes('Special')) return -1;
            if (!a.subtypes.includes('Special') && b.subtypes.includes('Special')) return 1;

            // If both are special or both are regular, sort by subtype
            if (a.subtypes[0] && b.subtypes[0]) {
                return a.subtypes[0].localeCompare(b.subtypes[0]);
            }
        }

        // Default sorting by name
        return a.name.localeCompare(b.name);

    });

    return (
        <div className="DeckViewer">
            <h3>Deck</h3>
            <div className="deck">
                {sortedDeck.map(card => (
                    <div key={card.id} className="deck-card">
                        <DeckCard
                            card={card}
                            onRemove={() => onRemove(card.id)}
                            onAdd={() => onAdd(card)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeckViewer;

// import React from 'react';
// import DeckCard from './DeckCard';
// import './DeckViewer.css';

// const DeckViewer = ({ deck, onRemove, onAdd }) => {
//     const supertypeOrder = ['Pokémon', 'Trainer', 'Energy'];
//     const trainerTypes = {
//         'Supporter': 1,
//         'Item': 2,
//         'Tool': 3,
//         'Stadium': 4
//     };

//     const sortPokemonTypes = (a, b) => {
//         // Define the order of evolution stages
//         const evolutionOrder = {
//           'Basic': 0,
//           'V': 1,
//           'LV': 2,
//           'GX': 3,
//           'VMAX': 4,
//           'EX': 5,
//           'BREAK': 6,
//           'Stage 1': 7,
//           'Stage 2': 8
//       };

//     const getEvolutionStage = (card) => {
//         // Initialize evolutionStage to 'Basic' when declaring it
//         let evolutionStage = 'Basic';

//         if (card.name.includes('-EX')) {
//             evolutionStage = 'EX'; // Stage 3 (EX)
//         } else if (card.name.includes('-GX')) {
//             evolutionStage = 'GX'; // Stage 2 (GX)
//         } else if (card.name.includes('BREAK') || card.name.includes('VMAX')) {
//             evolutionStage = 'VMAX'; // Stage 1 (BREAK or VMAX)
//         } else if (card.name.includes('V ')) {
//             evolutionStage = 'V'; // Stage 1 (V)
//         } else if (card.name.includes('LV')) {
//             evolutionStage = 'LV'; // Stage 2 (LV)
//         } else if (card.name.includes('Stage 1')) {
//             evolutionStage = 'Stage 1'; // Regular Stage 1
//         } else if (card.name.includes('Stage 2')) {
//             evolutionStage = 'Stage 2'; // Regular Stage 2
//         }

//         return evolutionStage;
//     };

//         // Get the evolution stage for each card
//         const evolutionStageA = getEvolutionStage(a);
//         const evolutionStageB = getEvolutionStage(b);

//         // Sort by evolution stage
//         if (evolutionOrder[evolutionStageA] !== evolutionOrder[evolutionStageB]) {
//             return evolutionOrder[evolutionStageA] - evolutionOrder[evolutionStageB];
//         } else {
//             // If the evolution stages are the same, sort alphabetically by name
//             return a.name.localeCompare(b.name);
//         }
//     };

//     const sortedDeck = [...deck].sort((a, b) => {
//         if (supertypeOrder.indexOf(a.supertype) < supertypeOrder.indexOf(b.supertype)) return -1;
//         if (supertypeOrder.indexOf(a.supertype) > supertypeOrder.indexOf(b.supertype)) return 1;

//         if (a.supertype === 'Trainer' && b.supertype === 'Trainer') {
//             const aIsStadium = a.subtypes ? a.subtypes.includes('Stadium') : false;
//             const bIsStadium = b.subtypes ? b.subtypes.includes('Stadium') : false;

//             if (aIsStadium && !bIsStadium) return 1;
//             if (!aIsStadium && bIsStadium) return -1;

//             const aWeight = a.subtypes ? Math.min(...a.subtypes.map(type => trainerTypes[type] || Infinity)) : Infinity;
//             const bWeight = b.subtypes ? Math.min(...b.subtypes.map(type => trainerTypes[type] || Infinity)) : Infinity;

//             if (aWeight < bWeight) return -1;
//             if (aWeight > bWeight) return 1;
//         }

//         if (a.supertype === 'Pokémon' && b.supertype === 'Pokémon') {
//             return sortPokemonTypes(a, b);
//         }

//         return a.name.localeCompare(b.name);
//     });

//     return (
//         <div className="DeckViewer">
//             <h3>Deck</h3>
//             <div className="deck">
//                 {sortedDeck.map(card => (
//                     <div key={card.id} className="deck-card">
//                         <DeckCard
//                             card={card}
//                             onRemove={() => onRemove(card.id)}
//                             onAdd={() => onAdd(card)}
//                         />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default DeckViewer;

// import React from 'react';
// import DeckCard from './DeckCard';
// import './DeckViewer.css';

//   const DeckViewer = ({ deck, onRemove, onAdd }) => {
//     const supertypeOrder = ['Pokémon', 'Trainer', 'Energy'];
//     const subtypeOrder = [ 'Supporter', 'Item', 'Tool', 'Stadium'];
//     const trainerTypes = {
//       'Supporter': 1,
//       'Item': 2,
//       'Tool': 3,
//       'Stadium': 4
//     };

//     const sortedDeck = [...deck].sort((a, b) => {
//       // Sort by supertype first
//       if (supertypeOrder.indexOf(a.supertype) < supertypeOrder.indexOf(b.supertype)) return -1;
//       if (supertypeOrder.indexOf(a.supertype) > supertypeOrder.indexOf(b.supertype)) return 1;

//       // If the supertypes are the same and they are 'Trainer', sort by subtype
//       if (a.supertype === 'Trainer' && b.supertype === 'Trainer') {
//         // Check if a card has the 'Stadium' subtype
//         const aIsStadium = a.subtypes ? a.subtypes.includes('Stadium') : false;
//         const bIsStadium = b.subtypes ? b.subtypes.includes('Stadium') : false;

//         // If one card is a 'Stadium' and the other is not, sort the 'Stadium' card last
//         if (aIsStadium && !bIsStadium) return 1;
//         if (!aIsStadium && bIsStadium) return -1;

//         // If neither or both cards are 'Stadium', sort by the lowest weight subtype
//         const aWeight = a.subtypes ? Math.min(...a.subtypes.map(type => trainerTypes[type] || Infinity)) : Infinity;
//         const bWeight = b.subtypes ? Math.min(...b.subtypes.map(type => trainerTypes[type] || Infinity)) : Infinity;

//         // Compare the weights
//         if (aWeight < bWeight) return -1;
//         if (aWeight > bWeight) return 1;
//       }

//       // If the supertypes (and subtypes for Trainers) are the same, sort by name
//       return a.name.localeCompare(b.name);
//     });

//     return (
//       <div className="DeckViewer">
//         <h3>Deck</h3>
//         <div className="deck">
//           {sortedDeck.map(card => (
//             <div key={card.id} className="deck-card">
//               <DeckCard
//                 card={card}
//                 onRemove={() => onRemove(card.id)}
//                 onAdd={() => onAdd(card)}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   export default DeckViewer;
