// import React, { useState, useEffect, useRef } from 'react';
// import { debounce } from 'lodash';

// const SearchSuggestions = ({ onSelect }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [suggestedCards, setSuggestedCards] = useState([]);
//     const [error, setError] = useState(null);
//     const [activeSuggestion, setActiveSuggestion] = useState(0);
//     const [showSuggestions, setShowSuggestions] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const latestRequest = useRef(0);
  
//     const fetchSuggestions = debounce((term) => {
//       if (!term) {
//         setSuggestedCards([]);
//         setError(null);
//         setLoading(false);
//         return;
//       }
  
//       const currentRequest = Date.now();
//       const timeout = 10000;
  
//       setLoading(true);
  
//       Promise.race([
//         fetch(`https://api.pokemontcg.io/v2/cards?q=name:${term}*`),
//         new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
//       ])
//         .then((response) => response.json())
//         .then((data) => {
//           if (currentRequest < latestRequest.current) {
//             return;
//           }
  
//           setLoading(false);
  
//           if (data.data && Array.isArray(data.data)) {
//             setSuggestedCards(data.data);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching suggestions:', error);
//           setError('Error fetching suggestions. Please try again.');
//           setLoading(false);
//         });
  
//       latestRequest.current = currentRequest;
//     }, 500);
  
//     const handleInputChange = (event) => {
//       const term = event.target.value;
//       setSearchTerm(term);
//       setShowSuggestions(true);
//     };
  
//     const handleSuggestionClick = (selectedCard) => {
//       setSearchTerm(selectedCard.name);
//       setShowSuggestions(false);
//       onSelect(selectedCard);
//     };
  
//     const handleKeyDown = (event) => {
//       if (event.key === 'Enter' && suggestedCards.length > 0) {
//         setSearchTerm(suggestedCards[0].name);
//         setShowSuggestions(false);
//         onSelect(suggestedCards[0]);
//       } else if (event.key === 'Escape') {
//         setShowSuggestions(false);
//       }
//     };
  
//     const handleClickOutside = (event) => {
//       if (event.target.closest('.SearchSuggestions') === null) {
//         setShowSuggestions(false);
//       }
//     };
  
//     useEffect(() => {
//       document.addEventListener('click', handleClickOutside);
  
//       return () => {
//         document.removeEventListener('click', handleClickOutside);
//       };
//     }, []);
  
//     useEffect(() => {
//       fetchSuggestions(searchTerm);
//     }, [searchTerm]);
  
//     const onKeyDown = (e) => {
//       if (e.keyCode === 13) {
//         onSelect(suggestedCards[activeSuggestion]);
//         setShowSuggestions(false);
//       } else if (e.keyCode === 38) {
//         if (activeSuggestion === 0) {
//           return;
//         }
//         setActiveSuggestion(activeSuggestion - 1);
//       } else if (e.keyCode === 40) {
//         if (activeSuggestion - 1 === suggestedCards.length) {
//           return;
//         }
//         setActiveSuggestion(activeSuggestion + 1);
//       }
//     };
  
//     const renderSuggestionContent = (card) => (
//       <>
//         <div className="suggestion-details">
//           <p className="suggestion-name">{card.name}</p>
//           <p className="suggestion-set">{`${card.set.name} - ${card.set.setNumber}`}</p>
//         </div>
//       </>
//     );
  
//     return (
//       <div className="SearchSuggestions">
//         <div className="search-container">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={handleInputChange}
//             onKeyDown={handleKeyDown}
//             placeholder="Search for Pokémon cards..."
//             className="search-input"
//           />
//           <div className="search-icon">{loading ? 'Loading...' : '🔍'}</div>
//         </div>
//         {showSuggestions && (
//           <div className="suggestions-box">
//             {error && <div className="error-message">{error}</div>}
//             {suggestedCards.length > 0 ? (
//               suggestedCards.map((card, index) => (
//                 <div
//                   key={card.id}
//                   className={`suggestion ${index === activeSuggestion ? 'active' : ''}`}
//                   onClick={() => handleSuggestionClick(card)}
//                 >
//                   {searchTerm === card.name && (
//                     <img src={card.images.small} alt={card.name} className="suggestion-image" />
//                   )}
//                   {renderSuggestionContent(card)}
//                 </div>
//               ))
//             ) : (
//               <div className="no-suggestions">No suggested cards available</div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };
  
//   export default SearchSuggestions;
  
// //# <---- START Original Code ---->
// import React, { useState, useEffect, useRef } from 'react';
// import { debounce } from 'lodash';

// const SearchSuggestions = ({ searchTerm, onSelect }) => {
//     const [suggestedCards, setSuggestedCards] = useState([]);
//     const [error, setError] = useState(null); // New state variable for error
//     const latestRequest = useRef(0);

//     const fetchSuggestions = debounce((searchTerm) => {
//         if (!searchTerm) {
//             setSuggestedCards([]);
//             setError(null); // Reset the error state when searchTerm is empty
//             return;
//         }

//         const currentRequest = Date.now();
//         const timeout = 10000;

//         Promise.race([
//             fetch(`https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}*`),
//             new Promise((_, reject) =>
//                 setTimeout(() => reject(new Error('Timeout')), timeout)
//             ),
//         ])
//             .then(response => response.json())
//             .then(data => {
//                 if (currentRequest < latestRequest.current) {
//                     return;
//                 }

//                 if (data.data && Array.isArray(data.data)) {
//                     setSuggestedCards(data.data);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching suggestions:', error);
//                 setError('Error fetching suggestions. Please try again.'); // Set the error state when an error occurs
//             });

//         latestRequest.current = currentRequest;
//     }, 500);

//     useEffect(() => {
//         fetchSuggestions(searchTerm);
//     }, [searchTerm]);

//     return (
//         <div className="SearchSuggestions">
//             {error && <div>{error}</div>}
//             {suggestedCards.length > 0 ? (
//                 suggestedCards.map((card) => (
//                     <div key={card.id} className="card" onClick={() => onSelect(card.name)}>
//                         <img src={card.images.small} alt={card.name} />
//                         {/* <div>{card.name}</div> */}
//                     </div>
//                 ))
//             ) : (
//                 <div>No suggested cards available</div>
//             )}
//         </div>
//     );
// }

// export default SearchSuggestions;

// //# <---- END Original Code ---->

import React, { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

const SearchSuggestions = ({ searchTerm, onSelect }) => {
    const [suggestedCards, setSuggestedCards] = useState([]);
    const [error, setError] = useState(null); // New state variable for error
    const latestRequest = useRef(0);
    console.log('Rendering SearchSuggestions');

    const fetchSuggestions = debounce((searchTerm) => {
        console.log('Search term:', searchTerm); 
        if (!searchTerm) {
            setSuggestedCards([]);
            setError(null); // Reset the error state when searchTerm is empty
            return;
        }

        const currentRequest = Date.now();
        const timeout = 10000;

        Promise.race([
            fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(searchTerm)}"`),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), timeout)
            ),
        ])
            .then(response => {
                console.log('Response data:', response);
                return response.json();
            })
            .then(data => {
                if (currentRequest < latestRequest.current) {
                    return;
                }

                if (data.data && Array.isArray(data.data)) {
                    console.log('Suggested cards:', data.data); // Add this line
                    setSuggestedCards(data.data);
                }
            })
            .catch(error => {
                console.error('Error fetching suggestions:', error);
                setError('Error fetching suggestions. Please try again.'); // Set the error state when an error occurs
            });

        latestRequest.current = currentRequest;
    }, 500);

    useEffect(() => {
        fetchSuggestions(searchTerm);
    }, [searchTerm]);

    return (
         <div className="SearchSuggestions">
             {error && <div>{error}</div>}
             {suggestedCards.length > 0 ? (
                 suggestedCards.map((card) => (
                     <div key={card.id} className="card" onClick={() => onSelect(card.name)}>
                         <img src={card.images.small} alt={card.name} />
                         {/* <div>{card.name}</div> */}
                     </div>
                 ))
             ) : (
                 <div>No suggested cards available</div>
             )}
         </div>
     );
 }

export default SearchSuggestions;