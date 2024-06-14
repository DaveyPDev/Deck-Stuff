import React, { useState } from 'react';
import axios from 'axios';
import DeckCard from './DeckCard.js';
import './DeckBuilder.css';
import CardViewer from '../Card/CardViewer.js';
import './DeckViewer.css';
import DeckViewer from './DeckViewer.js';
import Error from '../Shared/Error.js';
import styled from 'styled-components';
import { filterSearch } from '../Shared/FilterSearch.js';
// import DeckImporter from '../DeckImporter/DeckImporter.js';

const ErrorMessage = styled.div`
	color: red;
	font-weight: bold;
	margin: 10px 0;
`;

const DeckBuilder = () => {
	const [ deck, setDeck ] = useState([]);
	const [ error, setError ] = useState(null);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ searchInput, setSearchInput ] = useState('');
	const [ searchResults, setSearchResults ] = useState([]);
	const [ errorMessage, setErrorMessage ] = useState(null);
	const [ basicPokemonErrorMessage, setBasicPokemonErrorMessage ] = useState(null);
	const [ isAdvancedSearch, setIsAdvancedSearch ] = useState(false);
	const [ searchedCards, setSearchedCards ] = useState([]);
	const [ suggestedCards, setSuggestedCards ] = useState([]);

	const sortDeck = (deck) => {
		const supertypeOrder = { Pokémon: 1, Trainer: 2, Energy: 3 };
		const subtypeOrder = { Supporter: 1, Item: 2, Tool: 3, Stadium: 4 };

		return [ ...deck ].sort((a, b) => {
			if (supertypeOrder[a.supertype] < supertypeOrder[b.supertype]) return -1;
			if (supertypeOrder[a.supertype] > supertypeOrder[b.supertype]) return 1;

			if (a.supertype === 'Trainer' && b.supertype === 'Trainer') {
				const aOrder =
					a.subtype && typeof a.subtype === 'string' ? subtypeOrder[a.subtype] || Infinity : Infinity;
				const bOrder =
					b.subtype && typeof b.subtype === 'string' ? subtypeOrder[b.subtype] || Infinity : Infinity;

				if (aOrder < bOrder) return -1;
				if (aOrder > bOrder) return 1;
			}

			return a.name.localeCompare(b.name);
		});
	};

	const addCardToDeck = (card) => {
		console.log('Adding card to deck:', card);

		const existingCards = deck.filter((c) => c.name === card.name);
		const totalQuantityOfExistingCards = existingCards.reduce((sum, c) => sum + c.quantity, 0);

		const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

		const unlimitedCards = [
			'Water Energy',
			'Fire Energy',
			'Grass Energy',
			'Lightning Energy',
			'Metal Energy',
			'Darkness Energy',
			'Psychic Energy',
			'Fighting Energy',
			'Fairy Energy'
		];

		let errorOccurred = false;
		let updatedDeck = [ ...deck ];

		if (totalCards >= 60) {
			setErrorMessage('Cannot exceed 60 cards in the deck.');
			errorOccurred = true;
		}
		else if (totalQuantityOfExistingCards >= 4 && !unlimitedCards.includes(card.name)) {
			setErrorMessage('Cannot add more copies of this card.');
			errorOccurred = true;
		}
		else {
			const existingCardIndex = updatedDeck.findIndex((c) => c.id === card.id);

			if (existingCardIndex !== -1) {
				updatedDeck[existingCardIndex].quantity += 1;
			}
			else {
				updatedDeck.push({ ...card, quantity: 1 });
			}

			const sortedDeck = sortDeck(updatedDeck);
			setDeck(sortedDeck);
			setErrorMessage(null);

			console.log('Updated deck:', updatedDeck);
		}

		const basicPokemonExists = updatedDeck.some(
			(c) => c.subtypes && c.subtypes.includes('Basic') && c.supertype === 'Pokémon'
		);

		if (!basicPokemonExists) {
			setBasicPokemonErrorMessage('The deck requires 1 basic Pokémon.');
		}
		else {
			setBasicPokemonErrorMessage(null);
		}
	};

	const removeCardFromDeck = (cardId) => {
		const updatedDeck = deck
			.map((card) => (card.id === cardId ? { ...card, quantity: card.quantity - 1 } : card))
			.filter((card) => card.quantity > 0);

		const sortedDeck = sortDeck(updatedDeck);
		setDeck(sortedDeck);
	};

	const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

	const handleSearch = async (event) => {
		event.preventDefault();

		if (!searchInput) {
			return;
		}

		const url = `https://api.pokemontcg.io/v2/cards?q=name:"${searchInput}*"`;

		try {
			const response = await fetch(url);
			const results = await response.json();

			if (results.data) {
				setSearchResults(results.data);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		if (isAdvancedSearch) {
			const query = {
				legality   : [ 'Standard', 'Expanded', 'Unlimited' ],
				set        : 'set1',
				name       : searchTerm,
				stage      : 'stage1',
				supporters : 'supporter1',
				tool       : 'tool1',
				stadiums   : 'stadium1',
				items      : 'item1'
			};
			const filteredSuggestions = filterSearch(searchedCards, query);
			setSuggestedCards(filteredSuggestions);
		}
		else {
			const filteredSuggestions = searchedCards.filter((card) =>
				card.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setSuggestedCards(filteredSuggestions);
		}
	};

	const handleInputChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleDeckImport = (importedDeck) => {
		setDeck(importedDeck);
	};

	return (
		<div className="DeckBuilder">
			<h2>Deck Builder</h2>
			<p>Total Cards in deck: {totalCards}</p>
			{basicPokemonErrorMessage && <ErrorMessage>{basicPokemonErrorMessage}</ErrorMessage>}
			{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
			<DeckViewer deck={deck} onRemove={removeCardFromDeck} onAdd={addCardToDeck} />
			<button onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}>
				{isAdvancedSearch ? 'Switch to Regular Search' : 'Switch to Advanced Search'}
			</button>
			{/* <DeckImporter onImport={handleDeckImport} /> Add DeckImporter component here */}
			<div className="deck-display">{/* Render the deck here if needed */}</div>
			{error && <p className="error-message">{error}</p>}
			<div className="search-container">
				<form onSubmit={handleSearch}>
					<input
						type="text"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder="Search for a card"
					/>
					<button type="submit">Search</button>
				</form>
			</div>
			<div className="search-results">
				{searchResults.map((card) => (
					<DeckCard
						key={card.id}
						card={card}
						onRemove={() => removeCardFromDeck(card.id)}
						onAdd={() => addCardToDeck(card)}
					/>
				))}
			</div>
		</div>
	);
};
export default DeckBuilder;

// import React, { useState } from 'react';

// import DeckCard from './DeckCard';
// import './DeckBuilder.css';
// import CardViewer from '../Card/CardViewer';
// import './DeckViewer.css';
// import DeckViewer from './DeckViewer.js';
// // import DeckImporter from './DeckImporter.js';
// import Error from '../Shared/Error.js';

// import styled from 'styled-components';
// import { filterSearch } from '../Shared/FilterSearch';

// const ErrorMessage = styled.div`
// 	color: red;
// 	font-weight: bold;
// 	margin: 10px 0;
// `;

// const DeckBuilder = () => {
// 	const [ deck, setDeck ] = useState([]);
// 	const [ error, setError ] = useState(null);
// 	const [ searchTerm, setSearchTerm ] = useState('');
// 	const [ searchInput, setSearchInput ] = useState('');
// 	const [ searchResults, setSearchResults ] = useState([]);
// 	const [ errorMessage, setErrorMessage ] = useState(null);
// 	const [ basicPokemonErrorMessage, setBasicPokemonErrorMessage ] = useState(null);
// 	const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
// 	const [searchedCards, setSearchedCards] = useState([]);
// 	const [suggestedCards, setSuggestedCards] = useState([]);

// 	const sortDeck = (deck) => {
// 		const supertypeOrder = { 'Pokémon': 1, 'Trainer': 2, 'Energy': 3 };
// 		const subtypeOrder = { 'Supporter': 1, 'Item': 2, 'Tool': 3, 'Stadium': 4 };

// 		return [...deck].sort((a, b) => {
// 			// Sort by supertype according to the defined order
// 			if (supertypeOrder[a.supertype] < supertypeOrder[b.supertype]) return -1;
// 			if (supertypeOrder[a.supertype] > supertypeOrder[b.supertype]) return 1;

// 			// If the supertypes are the same and they are 'Trainer', sort by subtype
// 			if (a.supertype === 'Trainer' && b.supertype === 'Trainer') {
// 				const aOrder = a.subtype && typeof a.subtype === 'string' ? subtypeOrder[a.subtype] || Infinity : Infinity;
// 				const bOrder = b.subtype && typeof b.subtype === 'string' ? subtypeOrder[b.subtype] || Infinity : Infinity;

// 				if (aOrder < bOrder) return -1;
// 				if (aOrder > bOrder) return 1;
// 			}

// 			// If the supertypes (and subtypes for Trainers) are the same, sort by name
// 			return a.name.localeCompare(b.name);
// 		});
// 	};

// 	const addCardToDeck = (card) => {
// 		console.log('Adding card to deck:', card);
// 		const existingCards = deck.filter((c) => c.name === card.name);
// 		const totalQuantityOfExistingCards = existingCards.reduce((sum, c) => sum + c.quantity, 0);
// 		console.log('Total quantity of existing cards:', totalQuantityOfExistingCards);
// 		console.log('Current deck:', deck);

// 		const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

// 		const unlimitedCards = [
// 			'Water Energy',
// 			'Fire Energy',
// 			'Grass Energy',
// 			'Lightning Energy',
// 			'Metal Energy',
// 			'Darkness Energy',
// 			'Psychic Energy',
// 			'Fighting Energy',
// 			'Fairy Energy'
// 		];

// 		let errorOccurred = false;
// 		let updatedDeck = [...deck];

// 		if (totalCards >= 60) {
// 			console.error('Cannot exceed 60 cards in the deck.');
// 			setErrorMessage('Cannot exceed 60 cards in the deck.');
// 			errorOccurred = true;
// 		} else if (totalQuantityOfExistingCards >= 4 && !unlimitedCards.includes(card.name)) {
// 			console.error('Cannot add more copies of this card.');
// 			setErrorMessage('Cannot add more copies of this card.');
// 			errorOccurred = true;
// 		} else {
// 			const existingCardIndex = updatedDeck.findIndex((c) => c.id === card.id);

// 			if (existingCardIndex !== -1) {
// 				updatedDeck[existingCardIndex].quantity += 1;
// 			} else {
// 				updatedDeck.push({ ...card, quantity: 1 });
// 			}

// 			setSearchTerm('');
// 			const sortedDeck = sortDeck(updatedDeck); // Sort the deck before setting the state
// 			setDeck(sortedDeck); // Then update the state with the sorted deck
// 			setErrorMessage(null); // Clear any previous errors
// 		}

// 		// Check for at least one basic Pokémon
// 		const basicPokemonExists = updatedDeck.some(
// 			(c) => c.subtypes && c.subtypes.includes('Basic') && c.supertype === 'Pokémon'
// 		);

// 		if (!basicPokemonExists) {
// 			console.error('The deck must contain at least one basic Pokémon.');
// 			setBasicPokemonErrorMessage('The deck requires 1 basic Pokémon.');
// 		} else {
// 			setBasicPokemonErrorMessage(null); // Clear the error if basic Pokémon exists
// 		}
// 	};

// 	console.log('Deck:', deck);
// 	const removeCardFromDeck = (cardId) => {
// 		console.log('Remove card from deck:', cardId);
// 		const updatedDeck = deck
// 			.map((card) => (card.id === cardId ? { ...card, quantity: card.quantity - 1 } : card))
// 			.filter((card) => card.quantity > 0);

// 			const sortedDeck = sortDeck(updatedDeck); // Sort the deck before setting the state
// 			setDeck(sortedDeck);// Then update the state with the sorted deck
// 	};

// 	const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

// 	const handleSearch = async (event) => {
// 		event.preventDefault(); // Prevent the form from being submitted

// 		if (!searchInput) {
// 			console.log('Search term is empty');
// 			return;
// 		}

// 		const url = `https://api.pokemontcg.io/v2/cards?q=name:"${searchInput}*"`;

// 		console.log(`Searching for: ${searchInput}`);

// 		try {
// 			const response = await fetch(url);
// 			const results = await response.json();
// 			console.log(results);

// 			if (results.data) {
// 				setSearchResults(results.data);
// 			}
// 			else {
// 				console.error('No data in response');
// 			}
// 		} catch (error) {
// 			console.error('Error fetching data:', error);
// 		}

// 		if (isAdvancedSearch) {
// 			const query = {
// 				legality: ['Standard', 'Expanded', 'Unlimited'],
// 				set: 'set1',
// 				name: searchTerm,
// 				stage: 'stage1',
// 				supporters: 'supporter1',
// 				tool: 'tool1',
// 				stadiums: 'stadium1',
// 				items: 'item1'
// 			};
// 			const filteredSuggestions = filterSearch(searchedCards, query);
// 			setSuggestedCards(filteredSuggestions);
// 		} else {
// 			const filteredSuggestions = searchedCards.filter((card) =>
// 				card.name.toLowerCase().includes(searchTerm.toLowerCase())
// 			);
// 			setSuggestedCards(filteredSuggestions);
// 		}
// 	};

// 	const handleInputChange = (event) => {
// 		setSearchTerm(event.target.value);
// 		console.log('Updated search term:', event.target.value);
// 	};

// 	const handleDeckImport = (importedDeck) => {

//         setDeck(importedDeck);
//     };

// 	return (
// 		<div className="DeckBuilder">
// 			<h2>Deck Builder</h2>
// 			<p>Total Cards in deck: {totalCards}</p>
// 			{basicPokemonErrorMessage && <ErrorMessage>{basicPokemonErrorMessage}</ErrorMessage>}
// 			{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
// 			<DeckViewer deck={deck} onRemove={removeCardFromDeck} onAdd={addCardToDeck} />

// 			<button onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}>
// 				{isAdvancedSearch ? 'Switch to Regular Search' : 'Switch to Advanced Search'}
// 			</button>
// 			{/* <DeckImporter /> */}
// 			<div className="deck-display">
// 				{/* <div className="deck">
// 					{deck.map((card) => (
// 						<DeckCard
// 							key={card.id}
// 							card={card}
// 							onRemove={() => removeCardFromDeck(card.id)}
// 							onAdd={() => addCardToDeck(card)}
// 							onDelete={() => removeCardFromDeck(card.id)}
// 						/>
// 					))}
// 				</div> */}
// 				{/* <ul>{deck.map((card) => <li key={card.id}>{card.name}</li>)}</ul> */}
// 			</div>
// 			{/* <CardViewer searchTerm={searchTerm} onAdd={addCardToDeck} hideTitle={true} isInDeckBuilderMode={true} /> */}
// 			{error && <p className="error-message">{error}</p>}

// 			<div className="search-container">
// 				<form onSubmit={handleSearch}>
// 					<input
// 						type="text"
// 						value={searchInput}
// 						onChange={(e) => setSearchInput(e.target.value)}
// 						placeholder="Search for a card"
// 					/>
// 					<button type="submit">Search</button>
// 				</form>
// 			</div>
// 			<div className="search-results">
// 				{searchResults.map((card) => (
// 					<DeckCard
// 						key={card.id}
// 						card={card}
// 						onRemove={() => removeCardFromDeck(card.id)}
// 						onAdd={() => addCardToDeck(card)}
// 					/>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default DeckBuilder;

// // <!-- START TAKE 3 --->

// import React, { useState } from 'react';
// import DeckCard from './DeckCard';
// import './DeckBuilder.css';
// import CardViewer from '../Card/CardViewer';
// import './DeckViewer.js';
// import DeckViewer from './DeckViewer.js';
// import styled from 'styled-components';
// import Error from '../Shared/Error.js';

// const ErrorMessage = styled.div`
// 	color: red;
// 	font-weight: bold;
// 	margin: 10px 0;
// 	// Add any other styles you want
// `;

// const DeckBuilder = () => {
// 	const [ deck, setDeck ] = useState([]);
// 	const [ error, setError ] = useState(null);
// 	const [ searchTerm, setSearchTerm ] = useState('');
// 	const [ searchInput, setSearchInput ] = useState('');
// 	const [ searchResults, setSearchResults ] = useState([]);
// 	const [ errorMessage, setErrorMessage ] = useState(null);
// 	const [ basicPokemonErrorMessage, setBasicPokemonErrorMessage ] = useState(null);

// 	const addCardToDeck = (card) => {
// 		console.log('Adding card to deck:', card);
// 		const existingCards = deck.filter((c) => c.name === card.name);
// 		const totalQuantityOfExistingCards = existingCards.reduce((sum, c) => sum + c.quantity, 0);
// 		console.log('Total quantity of existing cards:', totalQuantityOfExistingCards);
// 		console.log('Current deck:', deck);

// 		const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

// 		const unlimitedCards = [
// 			'Water Energy',
// 			'Fire Energy',
// 			'Grass Energy',
// 			'Lightning Energy',
// 			'Metal Energy',
// 			'Darkness Energy',
// 			'Psychic Energy',
// 			'Fighting Energy',
// 			'Fairy Energy'
// 		];

// 		let errorOccurred = false;

// 		if (totalCards >= 60) {
// 			console.error('Cannot exceed 60 cards in the deck.');
// 			setErrorMessage('Cannot exceed 60 cards in the deck.');
// 			errorOccurred = true;
// 		}
// 		else if (totalQuantityOfExistingCards >= 4 && !unlimitedCards.includes(card.name)) {
// 			console.error('Cannot add more copies of this card.');
// 			setErrorMessage('Cannot add more copies of this card.');
// 			errorOccurred = true;
// 		}
// 		else {
// 			const updatedDeck = [ ...deck ];
// 			const existingCardIndex = updatedDeck.findIndex((c) => c.id === card.id);

// 			if (existingCardIndex !== -1) {
// 				updatedDeck[existingCardIndex].quantity += 1;
// 			}
// 			else {
// 				updatedDeck.push({ ...card, quantity: 1 });
// 			}

// 			setDeck(updatedDeck);
// 			setErrorMessage(null); // Clear any previous errors

// 			// Check for at least one basic Pokémon
// 			const basicPokemonExists = updatedDeck.some(
// 				(c) => c.subtypes && c.subtypes.includes('Basic') && c.supertype === 'Pokémon'
// 			);

// 			if (!basicPokemonExists) {
// 				console.error('The deck must contain at least one basic Pokémon.');
// 				setBasicPokemonErrorMessage('The deck requires 1 basic Pokémon.');
// 				errorOccurred = true;
// 			}
// 			else {
// 				setBasicPokemonErrorMessage(null); // Clear the error if basic Pokémon exists
// 			}
// 		}

// 		if (!errorOccurred) {
// 			setSearchTerm('');
// 		}
// 	};

// 	console.log('Deck:', deck);
// 	const removeCardFromDeck = (cardId) => {
// 		console.log('Remove card from deck:', cardId);
// 		const updatedDeck = deck
// 			.map((card) => (card.id === cardId ? { ...card, quantity: card.quantity - 1 } : card))
// 			.filter((card) => card.quantity > 0);

// 		setDeck(updatedDeck);
// 		console.log('Deck:', updatedDeck);
// 	};

// 	const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

// 	const handleSearch = async (event) => {
// 		event.preventDefault(); // Prevent the form from being submitted

// 		if (!searchInput) {
// 			console.log('Search term is empty');
// 			return;
// 		}

// 		const url = `https://api.pokemontcg.io/v2/cards?q=name:${searchInput}*`;
// 		console.log(`Searching for: ${searchInput}`);

// 		try {
// 			const response = await fetch(url);
// 			const results = await response.json();
// 			console.log(results);

// 			if (results.data) {
// 				setSearchResults(results.data);
// 			}
// 			else {
// 				console.error('No data in response');
// 			}
// 		} catch (error) {
// 			console.error('Error fetching data:', error);
// 		}
// 	};

// 	const handleInputChange = (event) => {
// 		setSearchTerm(event.target.value);
// 		console.log('Updated search term:', event.target.value);
// 	};

// 	return (
// 		<div className="DeckBuilder">
// 			<h2>Deck Builder</h2>
// 			<p>Total Cards in deck: {totalCards}</p>
// 			{basicPokemonErrorMessage && <ErrorMessage>{basicPokemonErrorMessage}</ErrorMessage>}
// 			{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
// 			<DeckViewer deck={deck} onRemove={removeCardFromDeck} onAdd={addCardToDeck} />

// 			<div className="deck-display">
// 				{/* <div className="deck">
// 					{deck.map((card) => (
// 						<DeckCard
// 							key={card.id}
// 							card={card}
// 							onRemove={() => removeCardFromDeck(card.id)}
// 							onAdd={() => addCardToDeck(card)}
// 							onDelete={() => removeCardFromDeck(card.id)}
// 						/>
// 					))}
// 				</div> */}
// 				{/* <ul>{deck.map((card) => <li key={card.id}>{card.name}</li>)}</ul> */}
// 			</div>
// 			{/* <CardViewer searchTerm={searchTerm} onAdd={addCardToDeck} hideTitle={true} isInDeckBuilderMode={true} /> */}
// 			{error && <p className="error-message">{error}</p>}

// 			<div className="search-container">
// 				<form onSubmit={handleSearch}>
// 					<input
// 						type="text"
// 						value={searchInput}
// 						onChange={(e) => setSearchInput(e.target.value)}
// 						placeholder="Search for a card"
// 					/>
// 					<button type="submit">Search</button>
// 				</form>
// 			</div>
// 			<div className="search-results">
// 				{searchResults.map((card) => (
// 					<DeckCard
// 						key={card.id}
// 						card={card}
// 						onRemove={() => removeCardFromDeck(card.id)}
// 						onAdd={() => addCardToDeck(card)}
// 					/>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default DeckBuilder;

// // <!---- END TAKE 3 ---->

// import React, { useState } from 'react';
// import DeckCard from './DeckCard';
// import './DeckBuilder.css';
// import CardViewer from '../Card/CardViewer';
// import './DeckViewer.js';
// import DeckViewer from './DeckViewer.js';

// const DeckBuilder = () => {
// 	const [ deck, setDeck ] = useState([]);
// 	const [ error, setError ] = useState(null);
// 	const [ searchTerm, setSearchTerm ] = useState('');

// 	const addCardToDeck = (card) => {
//     console.log('Adding card to deck:', card);
//     const existingCardIndex = deck.findIndex((c) => c.id === card.id);
//     console.log('Existing card index:', existingCardIndex);
//     console.log('Current deck:', deck);
//     setDeck([...deck, card]);

//     const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

//     if (totalCards < 60 && (!deck[existingCardIndex] || deck[existingCardIndex].quantity < 4)) {
//         const updatedDeck = [...deck];

//         if (existingCardIndex !== -1) {
//             updatedDeck[existingCardIndex].quantity += 1;
//         } else {
//             updatedDeck.push({ ...card, quantity: 1 });
//         }

//         setDeck(updatedDeck);
//         setError(null);
//     } else {
//         console.error('Cannot add more copies of this card or exceed 60 cards in the deck.');
//         setError('Cannot add more copies of this card or exceed 60 cards in the deck.');
//     }
//     console.log('Deck:', deck);
//     setSearchTerm('');
// };

// 	const removeCardFromDeck = (cardId) => {
// 		console.log('Remove card from deck:', cardId);
// 		const updatedDeck = deck
// 			.map((card) => (card.id === cardId ? { ...card, quantity: card.quantity - 1 } : card))
// 			.filter((card) => card.quantity > 0);

// 		setDeck(updatedDeck);
// 		console.log('Deck:', updatedDeck);
// 	};

// 	const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

// 	return (
// 		<div className="DeckBuilder">
// 			<h2>Deck Builder</h2>
// 			<p>Total Cards in deck: {totalCards}</p>
// 			{error && <p className="error">{error}</p>}
// 			<DeckViewer deck={deck} onRemove={removeCardFromDeck} onAdd={addCardToDeck} />
// 			<CardViewer searchTerm={searchTerm} onAdd={addCardToDeck} hideTitle={true} isInDeckBuilderMode={true} />
//       {error && <p className="error-message">{error}</p>}

//       <div className="deck-display">
// 				<div className="deck">
// 					{deck.map((card) => (
// 						<DeckCard
// 							key={card.id}
// 							card={card}
// 							onRemove={() => removeCardFromDeck(card.id)}
// 							onAdd={() => addCardToDeck(card)}
// 							onDelete={() => removeCardFromDeck(card.id)}
// 						/>
// 					))}
// 				</div>
// 				<ul>{deck.map((card) => <li key={card.id}>{card.name}</li>)}</ul>
// 			</div>
// 		</div>
// 	);
// };

// export default DeckBuilder;

// import React, { useState } from 'react';
// import DeckCard from './DeckCard';
// import './DeckBuilder.css';
// import CardViewer from '../Card/CardViewer';
// import './DeckViewer.js';
// import DeckViewer from './DeckViewer.js';

// const DeckBuilder = () => {
// 	const [ deck, setDeck ] = useState([]);
// 	const [ error, setError ] = useState(null);
// 	const [ searchTerm, setSearchTerm ] = useState('');

// 	const addCardToDeck = (card) => {
//     console.log('Adding card to deck:', card);
//     const existingCardIndex = deck.findIndex((c) => c.id === card.id);
//     console.log('Existing card index:', existingCardIndex);
//     console.log('Current deck:', deck);
//     setDeck([...deck, card]);

//     const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

//     if (totalCards < 60 && (!deck[existingCardIndex] || deck[existingCardIndex].quantity < 4)) {
//         const updatedDeck = [...deck];

//         if (existingCardIndex !== -1) {
//             updatedDeck[existingCardIndex].quantity += 1;
//         } else {
//             updatedDeck.push({ ...card, quantity: 1 });
//         }

//         setDeck(updatedDeck);
//         setError(null);
//     } else {
//         console.error('Cannot add more copies of this card or exceed 60 cards in the deck.');
//         setError('Cannot add more copies of this card or exceed 60 cards in the deck.');
//     }
//     console.log('Deck:', deck);
//     setSearchTerm('');
// };

// 	const removeCardFromDeck = (cardId) => {
// 		console.log('Remove card from deck:', cardId);
// 		const updatedDeck = deck
// 			.map((card) => (card.id === cardId ? { ...card, quantity: card.quantity - 1 } : card))
// 			.filter((card) => card.quantity > 0);

// 		setDeck(updatedDeck);
// 		console.log('Deck:', updatedDeck);
// 	};

// 	const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);

// 	return (
// 		<div className="DeckBuilder">
// 			<h2>Deck Builder</h2>
// 			<p>Total Cards in deck: {totalCards}</p>
// 			{error && <p className="error">{error}</p>}
// 			<DeckViewer deck={deck} onRemove={removeCardFromDeck} onAdd={addCardToDeck} />
// 			<CardViewer searchTerm={searchTerm} onAdd={addCardToDeck} hideTitle={true} isInDeckBuilderMode={true} />
//       {error && <p className="error-message">{error}</p>}

//       <div className="deck-display">
// 				<div className="deck">
// 					{deck.map((card) => (
// 						<DeckCard
// 							key={card.id}
// 							card={card}
// 							onRemove={() => removeCardFromDeck(card.id)}
// 							onAdd={() => addCardToDeck(card)}
// 							onDelete={() => removeCardFromDeck(card.id)}
// 						/>
// 					))}
// 				</div>
// 				<ul>{deck.map((card) => <li key={card.id}>{card.name}</li>)}</ul>
// 			</div>
// 		</div>
// 	);
// };

// export default DeckBuilder;
