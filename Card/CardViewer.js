import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

import Card from './Card.js';
import CardDetails from './CardDetail.js';
import './CardViewer.css';
import SearchSuggestions from '../Shared/SearchSuggestions.js';
import DeckControl from '../DeckBuilder/DeckControl.js';
import CardSearch from './CardSearch.js';
import { filterSearch } from '../Shared/FilterSearch';

const CardViewer = ({ hideTitle, setActiveView }) => {
	const [ cards, setCards ] = useState([]);
	const [ selectedCardId, setSelectedCardId ] = useState(null);
	const [ selectedCard, setSelectedCard ] = useState(null);
	const [ error, setError ] = useState(null);
	const [ suggestedCards, setSuggestedCards ] = useState([]);
	const [ selectedCardImages, setSelectedCardImages ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ isAdvancedSearch, setIsAdvancedSearch ] = useState(false);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ searchInput, setSearchInput ] = useState('');
	const [ searchResults, setSearchResults ] = useState([]);

	const navigate = useNavigate();

	const handleCardClick = (card) => {
		console.log('Card clicked: Card Viewer', card);
		setSelectedCard(card);
		setSelectedCardImages(card.images);
		setActiveView('cardDetails');

		// // Navigate to the new page
		// navigate(`/cards/${encodeURIComponent(card.id)}`);
	};

	const handleSuggestedCardSelect = (selectedCard) => {
		console.log('Selected Card:', selectedCard);
		// You might want to do something with the selected card
	};

	const handleSearch = async (event) => {
		event.preventDefault(); // Prevent the form from being submitted

		if (!searchInput) {
			console.log('Search term is empty');
			return;
		}

		const url = `https://api.pokemontcg.io/v2/cards?q=name:"${searchInput}*"`;

		console.log(`Searching for: ${searchInput}`);

		try {
			const response = await fetch(url);
			const results = await response.json();
			console.log(results);

			if (results.data) {
				setSearchResults(results.data);
				setCards(results.data);
			}
			else {
				console.error('No data in response');
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
			const filteredSuggestions = filterSearch(searchResults, query);
			setSuggestedCards(filteredSuggestions);
		}
		else {
			const filteredSuggestions = searchResults.filter((card) =>
				card.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setSuggestedCards(filteredSuggestions);
		}
	};

	const debouncedSearch = debounce((searchTerm) => {
		handleSearch(searchTerm);
	}, 300);

	const handleSearchTermChange = (searchTerm) => {
		setSearchTerm(searchTerm);
		if (searchTerm.length >= 3) {
			debouncedSearch(searchTerm);
		}
	};

	return (
		<div className="CardViewer">
			{!hideTitle && <h2>Card Viewer</h2>}
			<button onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}>
				{isAdvancedSearch ? 'Switch to Regular Search' : 'Switch to Advanced Search'}
			</button>

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
			{/* <SearchSuggestions searchTerm={searchTerm} onSelect={handleSuggestedCardSelect} /> */}
			{error && <p className="error-message">{error}</p>}
			<div className="card-list">
				{cards.map((card, index) => (
					<div key={card.id} className="card-item card">
						<Card card={card} onClick={() => handleCardClick(card)} />
					</div>
				))}
			</div>
			{selectedCard && <CardDetails cardId={selectedCard.id} />}
			{selectedCardImages && (
				<div className="selected-card-images">
					<img src={selectedCardImages.small} alt="Selected Card" />
				</div>
			)}
		</div>
	);
};

export default CardViewer;

//! <!-- take # two --->
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

// import Card from './Card.js';
// import CardDetails from './CardDetail.js';
// import './CardViewer.css';
// import SearchSuggestions from '../Shared/SearchSuggestions.js';
// import DeckControl from '../Deck/DeckControl';
// import CardSearch from './CardSearch.js';
// import { filterSearch } from '../Shared/FilterSearch';

// const CardViewer = ({ hideTitle, allowAdd = true }) => {
// 	const [cards, setCards] = useState([]);
// 	const [selectedCardId, setSelectedCardId] = useState(null);
// 	const [selectedCard, setSelectedCard] = useState(null);
// 	const [error, setError] = useState(null);
// 	const [suggestedCards, setSuggestedCards] = useState([]);
// 	const [selectedCardImages, setSelectedCardImages] = useState(null);
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
// 	const [searchTerm, setSearchTerm] = useState('');

// 	const navigate = useNavigate();

// 	const handleCardClick = (card) => {
// 		console.log('Card clicked: Card Viewer', card);
// 		setSelectedCard(card);
// 		setSelectedCardImages(card.images);

// 		// Navigate to the new page
// 		navigate(`/cards/${encodeURIComponent(card.id)}`);
// 	  };

// 	const handleSuggestedCardSelect = (selectedCard) => {
// 		console.log('Selected Card:', selectedCard);
// 		// You might want to do something with the selected card
// 	};

// 	const handleSearch = (searchedCards, searchTerm) => {
// 		let filteredSuggestions;
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
// 			filteredSuggestions = filterSearch(searchedCards, query);
// 		} else {
// 			filteredSuggestions = searchedCards.filter((card) =>
// 				card.name.toLowerCase().includes(searchTerm.toLowerCase())
// 			);
// 		}
// 		setSuggestedCards(filteredSuggestions);
// 		setCards(filteredSuggestions); // Set the cards state to the filtered cards
// 	};

// 	<CardSearch
// 		setCards={setCards}
// 		setError={setError}
// 		setIsLoading={setIsLoading}
// 		setSuggestedCards={setSuggestedCards}
// 		setSearchTerm={setSearchTerm}
// 	/>

// 	return (
// 		<div className="CardViewer">
// 			{!hideTitle && <h2>Card Viewer</h2>}
// 			<button onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}>
// 				{isAdvancedSearch ? 'Switch to Regular Search' : 'Switch to Advanced Search'}
// 			</button>
// 			<CardSearch
// 				setCards={setCards}
// 				setError={setError}
// 				setIsLoading={setIsLoading}
// 				setSuggestedCards={setSuggestedCards}
// 			/>
// 			{/* <SearchSuggestions searchTerm={searchTerm} onSelect={handleSuggestedCardSelect} /> */}
// 			{error && <p className="error-message">{error}</p>}
// 			<div className="card-list">
// 				{cards.map((card, index) => (
// 					<div key={card.id} className="card-item card">
// 					<Link to={`/cards/${card.id}`}>
// 					  <Card card={card} onClick={() => handleCardClick(card)} />
// 					</Link>
// 				  </div>
// 				))}
// 			</div>
// 			{selectedCard && <CardDetails cardId={selectedCard.id} />}
// 			{selectedCardImages && (
// 				<div className="selected-card-images">
// 					<img src={selectedCardImages.small} alt="Selected Card" />
// 				</div>
// 			)}
// 		</div>
// 	);
// 			}

// 	export default CardViewer;
//! <!-- end take two --->

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// import Card from './Card.js';
// import CardDetails from './CardDetail.js';
// import './CardViewer.css';
// import SearchSuggestions from '../Shared/SearchSuggestions.js';
// import DeckControl from '../Deck/DeckControl';
// import CardSearch from './CardSearch.js';
// import { filterSearch } from '../Shared/FilterSearch';

// const CardViewer = ({ onAdd, hideTitle, allowAdd = true }) => {
// 	const [cards, setCards] = useState([]);
// 	const [selectedCardId, setSelectedCardId] = useState(null);
// 	const [selectedCard, setSelectedCard] = useState(null);
// 	const [error, setError] = useState(null);
// 	const [suggestedCards, setSuggestedCards] = useState([]);
// 	const [selectedCardImages, setSelectedCardImages] = useState(null);
// 	const [searchTerm, setSearchTerm] = useState('');
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

// 	const handleCardClick = (card) => {
// 		console.log('Card clicked: Card Viewer', card);
// 		setSelectedCard(card)
// 		setSelectedCardImages(card.images);
// 		if (allowAdd) {
// 			addCardToDeck(card);
// 		}
// 	};

// 	const handleSuggestedCardSelect = (selectedCard) => {
// 		console.log('Selected Card:', selectedCard);
// 		// You might want to do something with the selected card
// 	};

// 	const addCardToDeck = (card) => {
// 		console.log('Adding searched card to deck:', card);
// 		onAdd(card);
// 		setSelectedCardId(null);
// 	};

// 	// const handleSearch = (searchedCards, searchTerm) => {
// 	// 	const filteredSuggestions = searchedCards.filter((card) =>
// 	// 		card.name.toLowerCase().includes(searchTerm.toLowerCase())
// 	// 	);
// 	// 	setSuggestedCards(filteredSuggestions);
// 	// };

// 	const handleSearch = (searchedCards, searchTerm) => {
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

// 	return (
// 		    <div className="CardViewer">
// 		      {!hideTitle && <h2>Card Viewer</h2>}
// 			<button onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}>
// 				{isAdvancedSearch ? 'Switch to Regular Search' : 'Switch to Advanced Search'}
// 			</button>
// 		      <input
// 		        className="searchBar"
// 		        type="text"
// 		        placeholder="Search cards..."
// 		        value={searchTerm}
// 		        onChange={(e) => setSearchTerm(e.target.value)}
// 		      />
// 			   {/* <button className="searchBTN" onClick={searchCard}>
// 		        Search
// 		      </button> */}
// 		      <SearchSuggestions searchTerm={searchTerm} onSelect={handleSuggestedCardSelect} />
// 		      {error && <p className="error-message">{error}</p>}
// 		      <div className="card-list">
// 		        {cards.map((card, index) => (
// 		          <div key={card.id} className="card-item">
// 		            <Link to={`/cards/${card.id}`}>
// 		              {/* Clicking on the card will navigate to the card details page */}
// 		              <Card card={card} onClick={() => handleCardClick(card)} />
// 		            </Link>
// 		            {/* Conditionally render the add button based on allowAdd prop */}
// 		            {allowAdd && <DeckControl card={card} onAdd={addCardToDeck} />}
// 		          </div>
// 		        ))}
// 		      </div>
// 		      {selectedCardImages && (
// 		        <div className="selected-card-images">
// 		          <img src={selectedCardImages.small} alt="Selected Card" />
// 		        </div>
// 		      )}
// 		    </div>
// 		  );
// 		};

// export default CardViewer;

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { debounce } from 'lodash';

// import Card from './Card.js';
// import CardDetails from './CardDetail.js';
// import './CardViewer.css';
// import SearchSuggestions from '../Shared/SearchSuggestions.js';
// import DeckControl from '../Deck/DeckControl';

// const CardViewer = ({ onAdd, hideTitle,allowAdd = true }) => {
//   const [cards, setCards] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCardId, setSelectedCardId] = useState(null);
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [error, setError] = useState(null);
//   const [suggestedCards, setSuggestedCards] = useState([]);
//   const [searchedCard, setSearchedCard] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedCardImages, setSelectedCardImages] = useState(null);

//   useEffect(() => {
//     if (searchTerm !== '') {
//       console.log('Updating suggested cards...');
//       const filteredSuggestions = cards.filter((card) =>
//         card.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setSuggestedCards(filteredSuggestions);
//     }
//   }, [searchTerm, cards]);

//   const handleCardClick = (card) => {
//     console.log('Card clicked: Card Viewer', card);
// 	setSelectedCard(card)
//     setSelectedCardImages(card.images);
//     if (allowAdd) {
//       addCardToDeck(card);
//     }
//   };

//   const handleSuggestedCardSelect = (selectedCard) => {
//     console.log('Selected Card:', selectedCard);
//     // You might want to do something with the selected card
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, []);

//   const searchCard = () => {
//     console.log('searchCard called');
//     setIsLoading(true);
//     if (!searchTerm) {
//       console.log('Search term is empty. Please enter a search term.');
//       return;
//     }

//     const fetchSuggestions = debounce((searchTerm) => {
//       console.log('fetchSuggestions called with:', searchTerm);

//       if (!searchTerm) {
//         setSuggestedCards([]);
//         return;
//       }

//       fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchTerm)}*`)
//         .then((response) => response.json())
//         .then((data) => {
//           console.log('Received data:', data);

//           if (data.data && Array.isArray(data.data)) {
//             setSuggestedCards(data.data);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching suggestions:', error);
//         });
//     }, 300);
//     fetchSuggestions(searchTerm);

//     console.log('Searching for cards...');
//     fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchTerm)}&page=${currentPage}&pageSize=10`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.data && Array.isArray(data.data)) {
//           setCards(data.data);
//           setTotalPages(Math.ceil(data.totalCount / 10));

//           const filteredCards = data.data.filter((card) =>
//             card.name.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//           setSuggestedCards(filteredCards);

//           if (filteredCards.length > 0) {
//             setSearchedCard(filteredCards[0]);
//           } else {
//             setSearchedCard(null);
//             console.log('Card not found.');
//           }
//         } else {
//           console.error('Error fetching cards: Invalid data format');
//           setError('Error fetching cards. Please try again later.');
//         }
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching card:', error);
//         setError('Error fetching cards. Please try again later.');
//         setIsLoading(false);
//       });
//   };

//   const addCardToDeck = (card) => {
//     console.log('Adding searched card to deck:', card);
//     onAdd(card);
//     setSelectedCardId(null);
//   };

//   return (
//     <div className="CardViewer">
//       {!hideTitle && <h2>Card Viewer</h2>}
//       <input
//         className="searchBar"
//         type="text"
//         placeholder="Search cards..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
// 	   {/* <button className="searchBTN" onClick={searchCard}>
//         Search
//       </button> */}
//       <SearchSuggestions searchTerm={searchTerm} onSelect={handleSuggestedCardSelect} />
//       {error && <p className="error-message">{error}</p>}
//       <div className="card-list">
//         {cards.map((card, index) => (
//           <div key={card.id} className="card-item">
//             <Link to={`/cards/${card.id}`}>
//               {/* Clicking on the card will navigate to the card details page */}
//               <Card card={card} onClick={() => handleCardClick(card)} />
//             </Link>
//             {/* Conditionally render the add button based on allowAdd prop */}
//             {allowAdd && <DeckControl card={card} onAdd={addCardToDeck} />}
//           </div>
//         ))}
//       </div>
//       {selectedCardImages && (
//         <div className="selected-card-images">
//           <img src={selectedCardImages.small} alt="Selected Card" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CardViewer;

// //<----- CardViewer.js ----->

// import React, { useState, useEffect } from 'react';
// import { debounce } from 'lodash';
// import Card from './Card.js';
// import './CardViewer.css';
// import SearchSuggestions from '../Shared/SearchSuggestions.js';

// const CardViewer = ({ onAdd, hideTitle }) => {
// 	const [ cards, setCards ] = useState([]);
// 	const [ searchTerm, setSearchTerm ] = useState('');
// 	const [ selectedCardId, setSelectedCardId ] = useState(null);
// 	const [ error, setError ] = useState(null);
// 	const [ suggestedCards, setSuggestedCards ] = useState([]);
// 	const [ searchedCard, setSearchedCard ] = useState(null);
// 	const [ isLoading, setIsLoading ] = useState(false);
// 	const [ currentPage, setCurrentPage ] = useState(null);
// 	const [ totalPages, setTotalPages ] = useState(1);
// 	const [ hasSearched, setHasSearched ] = useState(false);
// 	const [selectedCardImages, setSelectedCardImages] = useState(null);

// 	useEffect(
// 		() => {
// 			if (searchTerm !== '') {
// 				console.log('Updating suggested cards...');
// 				const filteredSuggestions = cards.filter((card) =>
// 					card.name.toLowerCase().includes(searchTerm.toLowerCase())
// 				);
// 				setSuggestedCards(filteredSuggestions);
// 			}
// 		},
// 		[ searchTerm ]
// 	);

// 	// console.log('Rendering component...');

// 	const handleCardClick = (card) => {
// 		console.log('Card clicked: Card Viewer', card);
// 		setSelectedCardImages(card.images);
// 		addCardToDeck(card);

// 	};

// 	  const handleSuggestedCardSelect = (selectedCard) => {

// 		console.log('Selected Card:', selectedCard);

// 	  };

// 	useEffect(() => {
// 		setCurrentPage(1);
// 	}, []);

// 	const searchCard = () => {

// 		console.log('searchCard called');
// 		setIsLoading(true);
// 		if (!searchTerm) {
// 			console.log('Search term is empty. Please enter a search term.');
// 			return;
// 		}

// 		const fetchSuggestions = debounce((searchTerm) => {
// 			console.log('fetchSuggestions called with:', searchTerm);

// 			if (!searchTerm) {
// 				setSuggestedCards([]);
// 				return;
// 			}

// 			fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchTerm)}*`)
// 				.then((response) => response.json())
// 				.then((data) => {
// 					console.log('Received data:', data);

// 					if (data.data && Array.isArray(data.data)) {
// 						setSuggestedCards(data.data);
// 					}
// 				})
// 				.catch((error) => {
// 					console.error('Error fetching suggestions:', error);
// 				});
// 		}, 300);
// 		fetchSuggestions(searchTerm);

// 		console.log('Searching for cards...');
// 		fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchTerm)}&page=${currentPage}&pageSize=10`)
// 			.then((response) => response.json())
// 			.then((data) => {
// 				if (data.data && Array.isArray(data.data)) {
// 					setCards(data.data);
// 					setTotalPages(Math.ceil(data.totalCount / 10));

// 					const filteredCards = data.data.filter((card) =>
// 						card.name.toLowerCase().includes(searchTerm.toLowerCase())
// 					);
// 					setSuggestedCards(filteredCards);

// 					if (filteredCards.length > 0) {
// 						setSearchedCard(filteredCards[0]);
// 					}
// 					else {
// 						setSearchedCard(null);
// 						console.log('Card not found.');
// 					}
// 				}
// 				else {
// 					console.error('Error fetching cards: Invalid data format');
// 					setError('Error fetching cards. Please try again later.');
// 				}
// 				setIsLoading(false);
// 			})
// 			.catch((error) => {
// 				console.error('Error fetching card:', error);
// 				setError('Error fetching cards. Please try again later.');
// 				setIsLoading(false);
// 			});
// 	};

// 	const addCardToDeck = (card) => {
// 		console.log('Adding searched card to deck:', card);
// 		onAdd(card);
// 		setSelectedCardId(null)
// 	  };

// 	// useEffect(
// 	// 	() => {
// 	// 		console.log('Current Page:', currentPage);
// 	// 		console.log('Total Pages:', totalPages);
// 	// 	},
// 	// 	[ currentPage, totalPages ]
// 	// );

// 	// useEffect(
// 	// 	() => {
// 	// 		console.log('Current Cards:', cards);
// 	// 	},
// 	// 	[ cards ]
// 	// );

// 	// useEffect(
// 	// 	() => {
// 	// 		console.log('Current Searched Card:', searchedCard);
// 	// 	},
// 	// 	[ searchedCard ]
// 	// );

// 	// useEffect(
// 	// 	() => {
// 	// 		console.log('Current Suggested Cards:', suggestedCards);
// 	// 	},
// 	// 	[ suggestedCards ]
// 	// );

// 	// useEffect(
// 	// 	() => {
// 	// 		const cardListStyles = getComputedStyle(document.querySelector('.card-list'));
// 	// 		console.log('card-list Styles:', cardListStyles);
// 	// 	},
// 	// 	[ cards ]
// 	// );

// 	return (
// 		<div className="CardViewer">
// 		  {!hideTitle && <h2>Card Viewer</h2>}
// 		  {/* <input
// 			className='searchBar'
// 			type="text"
// 			placeholder="Search cards..."
// 			value={searchTerm}
// 			onChange={(e) => setSearchTerm(e.target.value)}
// 		  />
// 		  <button className='searchBTN' onClick={searchCard}>Search</button> */}
// 		  <input
// 			className='searchBar'
// 			type="text"
// 			placeholder="Search cards..."
// 			value={searchTerm}
// 			onChange={(e) => setSearchTerm(e.target.value)}
// 		  />
// 		  <button className='searchBTN' onClick={searchCard}>Search</button>
// 		  <SearchSuggestions searchTerm={searchTerm} onSelect={handleSuggestedCardSelect} />
// 		  {error && <p className="error-message">{error}</p>}
// 		  <div className="card-list">
// 			{cards.map((card, index) => (
// 			  <Card
// 				key={card.id}
// 				card={card}
// 				onAdd={onAdd}
// 				onClick={() => handleCardClick(card)}
// 			  />
// 			))}
// 		  </div>
// 		  {selectedCardImages && (
// 			<div className="selected-card-images">
// 			  <img src={selectedCardImages.small} alt="Selected Card" />
// 			  {/* Add other images if needed */}
// 			</div>
// 		  )}
// 		</div>
// 	  );
// 	};

// 	export default CardViewer;

// <----- another version of CardViewer.js ----->

// ----->
// import React, { useState, useEffect } from 'react';
// import { debounce } from 'lodash';
// import Card from './Card.js';
// import './CardViewer.css';
// import SearchSuggestions from '../Shared/SearchSuggestions.js';

// const CardViewer = ({ onAdd, hideTitle }) => {
// 	const [ cards, setCards ] = useState([]);
// 	const [ searchTerm, setSearchTerm ] = useState('');
// 	const [ selectedCardId, setSelectedCardId ] = useState(null);
// 	const [ error, setError ] = useState(null);
// 	const [ suggestedCards, setSuggestedCards ] = useState([]);
// 	const [ searchedCard, setSearchedCard ] = useState(null);
// 	const [ isLoading, setIsLoading ] = useState(false);
// 	const [ currentPage, setCurrentPage ] = useState(null);
// 	const [ totalPages, setTotalPages ] = useState(1);
// 	const [ hasSearched, setHasSearched ] = useState(false);

// 	useEffect(
// 		() => {
// 			if (searchTerm !== '') {
// 				console.log('Updating suggested cards...');
// 				const filteredSuggestions = cards.filter((card) =>
// 					card.name.toLowerCase().includes(searchTerm.toLowerCase())
// 				);
// 				setSuggestedCards(filteredSuggestions);
// 			}
// 		},
// 		[ searchTerm ]
// 	);

// 	// console.log('Rendering component...');

// 	const handleCardClick = (card) => {
// 		console.log('Card clicked: Card Viewer', card);
// 		setSelectedCardId(card.id);
// 		if (typeof onAdd === 'function') {
// 		  addCardToDeck(card);
// 		} else {
// 		  console.error('onAdd is not a function');
// 		}
// 	  };

// 	  const handleSuggestedCardSelect = (selectedCard) => {

// 		console.log('Selected Card:', selectedCard);

// 	  };

// 	useEffect(() => {
// 		setCurrentPage(1);
// 	}, []);

// 	const searchCard = () => {

// 		console.log('searchCard called');
// 		setIsLoading(true);
// 		if (!searchTerm) {
// 			console.log('Search term is empty. Please enter a search term.');
// 			return;
// 		}

// 		const fetchSuggestions = debounce((searchTerm) => {
// 			console.log('fetchSuggestions called with:', searchTerm);

// 			if (!searchTerm) {
// 				setSuggestedCards([]);
// 				return;
// 			}

// 			fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchTerm)}*`)
// 				.then((response) => response.json())
// 				.then((data) => {
// 					console.log('Received data:', data);

// 					if (data.data && Array.isArray(data.data)) {
// 						setSuggestedCards(data.data);
// 					}
// 				})
// 				.catch((error) => {
// 					console.error('Error fetching suggestions:', error);
// 				});
// 		}, 300);
// 		fetchSuggestions(searchTerm);

// 		console.log('Searching for cards...');
// 		fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchTerm)}&page=${currentPage}&pageSize=10`)
// 			.then((response) => response.json())
// 			.then((data) => {
// 				if (data.data && Array.isArray(data.data)) {
// 					setCards(data.data);
// 					setTotalPages(Math.ceil(data.totalCount / 10));

// 					const filteredCards = data.data.filter((card) =>
// 						card.name.toLowerCase().includes(searchTerm.toLowerCase())
// 					);
// 					setSuggestedCards(filteredCards);

// 					if (filteredCards.length > 0) {
// 						setSearchedCard(filteredCards[0]);
// 					}
// 					else {
// 						setSearchedCard(null);
// 						console.log('Card not found.');
// 					}
// 				}
// 				else {
// 					console.error('Error fetching cards: Invalid data format');
// 					setError('Error fetching cards. Please try again later.');
// 				}
// 				setIsLoading(false);
// 			})
// 			.catch((error) => {
// 				console.error('Error fetching card:', error);
// 				setError('Error fetching cards. Please try again later.');
// 				setIsLoading(false);
// 			});
// 	};

// 	const addCardToDeck = (card) => {
// 		console.log('Adding searched card to deck:', card);
// 		onAdd(card);
// 	  };

// 	// useEffect(
// 	// 	() => {
// 	// 		console.log('Current Page:', currentPage);
// 	// 		console.log('Total Pages:', totalPages);
// 	// 	},
// 	// 	[ currentPage, totalPages ]
// 	// );

// 	// useEffect(
// 	// 	() => {
// 	// 		console.log('Current Cards:', cards);
// 	// 	},
// 	// 	[ cards ]
// 	// );

// 	// useEffect(
// 	// 	() => {
// 	// 		console.log('Current Searched Card:', searchedCard);
// 	// 	},
// 	// 	[ searchedCard ]
// 	// );

// 	// useEffect(
// 	// 	() => {
// 	// 		console.log('Current Suggested Cards:', suggestedCards);
// 	// 	},
// 	// 	[ suggestedCards ]
// 	// );

// 	// useEffect(
// 	// 	() => {
// 	// 		const cardListStyles = getComputedStyle(document.querySelector('.card-list'));
// 	// 		console.log('card-list Styles:', cardListStyles);
// 	// 	},
// 	// 	[ cards ]
// 	// );

// 	return (
// 		<div className="CardViewer">
// 		  {!hideTitle && <h2>Card Viewer</h2>}
// 		  <input
// 			className='searchBar'
// 			type="text"
// 			placeholder="Search cards..."
// 			value={searchTerm}
// 			onChange={(e) => setSearchTerm(e.target.value)}
// 		  />
// 		  <button className='searchBTN' onClick={searchCard}>Search</button>
// 		  <SearchSuggestions searchTerm={searchTerm} onSelect={handleSuggestedCardSelect} />
// 		  {error && <p className="error-message">{error}</p>}
// 		  <div className="card-list">
// 			{cards.map((card, index) => (
// 			  <Card
// 				key={card.id}
// 				card={card}
// 				onAdd={onAdd}
// 				onClick={() => handleCardClick(card)}
// 			  />
// 			))}
// 		  </div>
// 		</div>
// 	  );
// 	};

// 	export default CardViewer;

// <-----

// import React, { useState, useEffect } from 'react';
// import { debounce } from 'lodash';
// import Card from './Card.js';
// // import CardDetails from './CardDetail.js';
// import './CardViewer.css';
// import SearchSuggestions from '../Shared/SearchSuggestions.js';

// const CardViewer = () => {
//   const [cards, setCards] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCardId, setSelectedCardId] = useState(null);
//   const [error, setError] = useState(null);
//   const [suggestedCards, setSuggestedCards] = useState([]);
//   const [searchedCard, setSearchedCard] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [hasSearched, setHasSearched] = useState(false);

//   useEffect(() => {
//     console.log('Updating suggested cards...');
//     const filteredSuggestions = cards.filter(card =>
//       card.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setSuggestedCards(filteredSuggestions);
//   }, [searchTerm]);

//   console.log('Rendering component...');

//   const handleCardClick = (cardId) => {
//     setSelectedCardId(cardId);
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, []);

//   const searchCard = () => {
//     console.log('searchCard called');
//     setIsLoading(true);
//     if (!searchTerm) {
//       console.log('Search term is empty. Please enter a search term.');
//       return;
//     }

//     const fetchSuggestions = debounce((searchTerm) => {
//       console.log('fetchSuggestions called with:', searchTerm); // Log when the function is called

//       if (!searchTerm) {
//         setSuggestedCards([]);
//         return;
//       }

//       fetch(`https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}*`)
//         .then(response => response.json())
//         .then(data => {
//           console.log('Received data:', data); // Log the received data

//           if (data.data && Array.isArray(data.data)) {
//             setSuggestedCards(data.data);
//           }
//         })
//         .catch(error => {
//           console.error('Error fetching suggestions:', error);
//         });
//     }, 300);
//     fetchSuggestions(searchTerm);

//     console.log('Searching for cards...');
//     fetch(`https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}&page=${currentPage}&pageSize=10`)
//       .then(response => response.json())
//       .then(data => {
//         if (data.data && Array.isArray(data.data)) {
//           setCards(data.data);
//           setTotalPages(Math.ceil(data.totalCount / 10));

//           const filteredCards = data.data.filter(card =>
//             card.name.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//           setSuggestedCards(filteredCards);

//           if (filteredCards.length > 0) {
//             setSearchedCard(filteredCards[0]);
//           } else {
//             setSearchedCard(null);
//             console.log('Card not found.');
//           }
//         } else {
//           console.error('Error fetching cards: Invalid data format');
//           setError('Error fetching cards. Please try again later.');
//         }
//         setIsLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching card:', error);
//         setError('Error fetching cards. Please try again later.');
//         setIsLoading(false);
//       });
//   };

//   const addSearchedCardToDeck = () => {
//     console.log('Adding searched card to deck:', searchedCard);
//   };

//   const Card = ({ card }) => {
//     return (
//         <div className="card">
//             <img src={card.images.small} alt={card.name} />
//             <div className="card-name">{card.name}</div>
//         </div>
//     );
// };

//   return (
//     <div className="CardViewer">
//       <h2>Card Viewer</h2>
//       <input
//         type="text"
//         placeholder="Search cards..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       <button onClick={searchCard}>Search</button>
//       <SearchSuggestions searchTerm={searchTerm} onSelect={setSearchTerm} />
//       {error && <p className="error-message">{error}</p>}

//       {/* {suggestedCards.length > 0 && (
//         <div className="suggestion-list">
//           {suggestedCards.map((card, index) => (
//             <div key={index} onClick={() => handleCardClick(card.id)}>
//               {card.name}
//             </div>
//           ))}
//         </div>
//       )} */}

//       {/* {searchedCard && (
//         <div className="searched-card">
//           <h3>Search Result:</h3>
//           <Card card={searchedCard} onClick={addSearchedCardToDeck} />
//         </div>
//       )} */}

//       {/* {searchedCard && <CardDetails card={searchedCard} />} */}

//       <div className="card-list">
//         {cards.map((card) => (
//           <Card key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
//         ))}
//       </div>
//       {/* {selectedCardId && <CardDetails cardId={selectedCardId} />} */}
//       <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
//       <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
//     </div>
//   );
// };

// export default CardViewer;

//// >>> fetch cards from API included <<<< ///
// import React, { useState, useEffect } from 'react';
// import Card from './Card.js';
// import CardDetails from './CardDetail.js';
// import './CardViewer.css';

// const CardViewer = () => {
//   const [cards, setCards] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCardId, setSelectedCardId] = useState(null);
//   const [error, setError] = useState(null);
//   const [suggestedCards, setSuggestedCards] = useState([]);
//   const [searchedCard, setSearchedCard] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Update suggested cards based on the search term and the fetched cards
//   useEffect(() => {
//     console.log('Updating suggested cards...');
//     const filteredSuggestions = cards.filter(card =>
//       card.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setSuggestedCards(filteredSuggestions);
//   }, [searchTerm, cards]);

//   console.log('Rendering component...');

//   const handleCardClick = (cardId) => {
//     setSelectedCardId(cardId);
//   };

//   // const fetchCards = () => {
//   //   console.log('Fetching cards...');
//   //   fetch('https://api.pokemontcg.io/v2/cards')
//   //     .then(response => response.json())
//   //     .then(data => {
//   //       console.log('API Response:', data);

//   //       if (data.data && Array.isArray(data.data)) {
//   //         setCards(data.data);
//   //       } else if (Array.isArray(data.cards)) {
//   //         setCards(data.cards);
//   //       } else {
//   //         console.error('Error fetching cards: Invalid data format');
//   //         setError('Error fetching cards. Please try again later.');
//   //       }
//   //     })
//   //     .catch(error => {
//   //       console.error('Error fetching cards:', error);
//   //       setError('Error fetching cards. Please try again later.');
//   //     });
//   // };

//   const searchCard = () => {
//     setIsLoading(true);
//     if (!searchTerm) {
//       console.log('Search term is empty. Please enter a search term.');
//       return;
//     }

//     console.log('Searching for cards...');
//     fetch(`https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}`)
//       .then(response => response.json())
//       .then(data => {
//         if (data.data && data.data.length > 0) {
//           setSearchedCard(data.data[0]);
//         } else {
//           setSearchedCard(null);
//           console.log('Card not found.');
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching card:', error);
//       });
//       setIsLoading(false);
//   };

//   const addSearchedCardToDeck = () => {
//     console.log('Adding searched card to deck:', searchedCard);
//   };

//   return (
//     <div className="CardViewer">
//       <h2>Card Viewer</h2>
//       <input
//         type="text"
//         placeholder="Search cards..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       {/* <button onClick={fetchCards}>Fetch Cards</button> */}
//       <button onClick={searchCard}>Search</button>

//       {error && <p className="error-message">{error}</p>}

//       {suggestedCards.length > 0 && (
//         <div className="suggestion-list">
//           {suggestedCards.map((card, index) => (
//             <div key={index} onClick={() => handleCardClick(card.id)}>
//               {card.name}
//             </div>
//           ))}
//         </div>
//       )}

//       {searchedCard && (
//         <div className="searched-card">
//           <h3>Search Result:</h3>
//           <Card card={searchedCard} onClick={addSearchedCardToDeck} />
//         </div>
//       )}

//       {searchedCard && <CardDetails card={searchedCard} />}

//       <div className="card-list">
//         {cards.map(card => (
//           <Card key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
//         ))}
//       </div>
//       {selectedCardId && <CardDetails cardId={selectedCardId} />}
//       </div>
//   );
// };

// export default CardViewer;

// import React, { useState, useEffect } from 'react';
// import Card from './Card.js';
// import CardDetails from './CardDetail.js';
// import './CardViewer.css';

// const CardViewer = () => {
//   const [cards, setCards] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCardId, setSelectedCardId] = useState(null);
//   const [error, setError] = useState(null);
//   const [suggestedCards, setSuggestedCards] = useState([]);

//   useEffect(() => {
//     fetch('https://api.pokemontcg.io/v2/cards')
//       .then(response => response.json())
//       .then(data => {
//         if (Array.isArray(data.cards)) {
//           setCards(data.cards);
//         } else {
//           console.error('Error fetching cards: Invalid data format');
//           setError('Error fetching cards. Please try again later.');
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching cards:', error);
//         setError('Error fetching cards. Please try again later.');
//       });
//   }, []);

//   useEffect(() => {
//     const filteredSuggestions = cards.filter(card =>
//       card.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setSuggestedCards(filteredSuggestions);
//   }, [searchTerm, cards]);

//   // Define the handleCardClick function
//   const handleCardClick = (cardId) => {
//     setSelectedCardId(cardId);
//   };

//   return (
//     <div className="CardViewer">
//       <h2>Card Viewer</h2>
//       <input
//         type="text"
//         placeholder="Search cards..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       {error && <p className="error-message">{error}</p>}
//       {suggestedCards.length > 0 && (
//         <div className="suggestion-list">
//           {suggestedCards.map((card, index) => (
//             <div key={index} onClick={() => handleCardClick(card.id)}>
//               {card.name}
//             </div>
//           ))}
//         </div>
//       )}
//       <div className="card-list">
//         {cards.map(card => (
//           <Card key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
//         ))}
//       </div>
//       {selectedCardId && <CardDetails cardId={selectedCardId} />}
//     </div>
//   );
// };

// export default CardViewer;

// import React, { useState, useEffect } from 'react';
// import Card from './Card.js';
// import './CardViewer.css'; // You can create this file for styling

// const CardViewer = () => {
//   const [cards, setCards] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch cards from an API or use a local data source
//   useEffect(() => {
//     // Replace this with your actual API endpoint or data fetching logic
//     fetch('https://api.example.com/cards')
//       .then(response => response.json())
//       .then(data => setCards(data))
//       .catch(error => console.error('Error fetching cards:', error));
//   }, []);

//   // Filter cards based on the search term
//   const filteredCards = cards.filter(card =>
//     card.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="CardViewer">
//       <h2>Card Viewer</h2>
//       <input
//         type="text"
//         placeholder="Search cards..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <div className="card-list">
//         {filteredCards.map(card => (
//           <Card key={card.id} card={card} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CardViewer;
