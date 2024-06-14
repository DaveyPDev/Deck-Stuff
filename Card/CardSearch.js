import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

const CardSearch = ({ setCards, setTotalPages, setSuggestedCards, setSearchedCard, setError, setIsLoading }) => {
	const [ searchTerm, setSearchTerm ] = useState('');

	const searchCard = async (searchTerm) => {
		let allCards = [];
		let hasMore = true;
		let page = 1;

		let query;

		// Check if the search term starts with 'name:'
		if (searchTerm.startsWith('name:')) {
			// Remove 'name:' from the start of the search term
			const name = searchTerm.slice(5);

			// Check if the name ends with '*'
			if (name.endsWith('*')) {
				// Remove '*' from the end of the name
				const start = name.slice(0, -1);

				// Create a query for names that start with the given string
				query = `name:${encodeURIComponent(start)}*`;
			}
			else {
				// Create a query for names that exactly match the given string
				query = `name:${encodeURIComponent(name)}`;
			}
		}
		else if (searchTerm.startsWith('!name:')) {
			// Remove '!name:' from the start of the search term
			const exactName = searchTerm.slice(6);

			// Create a query for names that exactly match the given string
			query = `!name:${encodeURIComponent(exactName)}`;
		}
		else {
			// If the search term doesn't start with 'name:' or '!name:', treat it as a normal search term
			query = encodeURIComponent(searchTerm);
		}

		while (hasMore) {
			try {
				const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${searchTerm}"`);
				const data = await response.json();

				console.log('Data from API:', data); // Log the data from the API

				if (data.data && Array.isArray(data.data)) {
					allCards = allCards.concat(data.data);
				}

				hasMore = data.hasMore;
				page++;
			} catch (error) {
				console.error('Error fetching cards:', error);
				setError('Error fetching cards. Please try again.');
				setIsLoading(false);
				return;
			}
		}

		setCards(allCards);
		setIsLoading(false);
	};

	const debouncedSearch = debounce((searchTerm) => searchCard(searchTerm), 300);

	const [ lastSearchTerm, setLastSearchTerm ] = useState('');

	const handleSearchTermChange = (e) => {
		setSearchTerm(e.target.value);
		if (e.target.value.length >= 3) {
			debouncedSearch(e.target.value);
		}
		else {
			debouncedSearch.cancel();
		}
	};
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			searchCard(searchTerm);
		}
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Search cards..."
				value={searchTerm}
				onChange={handleSearchTermChange}
				onKeyPress={handleKeyPress}
			/>

			<button onClick={() => searchCard(searchTerm)}>Search</button>
		</div>
	);
};

export default CardSearch;

// //! <!-- Second attempt WORKING --->
// import React, { useState } from 'react';
// import { debounce } from 'lodash';

// const CardSearch = ({ setCards, setTotalPages, setSuggestedCards, setSearchedCard, setError, setIsLoading }) => {
//     const [searchTerm, setSearchTerm] = useState('');

//     // Debounce the search function
//     const debouncedSearch = debounce(searchCard, 300);

//     const searchCard = () => {
//         console.log('searchCard called');
//         setIsLoading(true);
//         if (!searchTerm) {
//             console.log('Search term is empty. Please enter a search term.');
//             return;
//         }

//         // fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchTerm)}`)
//         fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchTerm)}*`)
//             .then(response => response.json())
//             .then(data => {
//                 if (data.data && Array.isArray(data.data)) {
//                     setCards(data.data);
//                     setIsLoading(false);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching cards:', error);
//                 setError('Error fetching cards. Please try again.');
//                 setIsLoading(false);
//             });
//     };

//     // Handle search term changes with debouncing
//     const handleSearchTermChange = (e) => {
//         setSearchTerm(e.target.value);
//         debouncedSearch();
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Search cards..."
//                 value={searchTerm}
//                 onChange={handleSearchTermChange}
//             />
//             <button onClick={searchCard}>
//                 Search
//             </button>
//         </div>
//     );
// };

// export default CardSearch;
// //! <!-- Second Attempt WORKING --->

// import React, { useState } from 'react';
// import { debounce } from 'lodash';

// const CardSearch = ({ setCards, setTotalPages, setSuggestedCards, setSearchedCard, setError, setIsLoading }) => {
//     const [searchTerm, setSearchTerm] = useState('');

//     const searchCard = () => {
//         console.log('searchCard called');
//         setIsLoading(true);
//         if (!searchTerm) {
//             console.log('Search term is empty. Please enter a search term.');
//             return;
//         }

//         fetch(`https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchTerm.replace(/ /g, '+'))}`)

//             .then(response => response.json())
//             .then(data => {
//                 if (data.data && Array.isArray(data.data)) {
//                     setCards(data.data);
//                     setIsLoading(false);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching cards:', error);
//                 setError('Error fetching cards. Please try again.');
//                 setIsLoading(false);
//             });
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Search cards..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button onClick={searchCard}>
//                 Search
//             </button>
//         </div>
//     );
// };

// export default CardSearch;
