// Autocomplete.js

import React, { useState, useEffect } from 'react';

const Autocomplete = ({ suggestions, onSelect }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setFilteredSuggestions(suggestions);
  }, [suggestions]);

  const handleInputChange = (event) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);

    // Filter the suggestions based on the input value
    const newFilteredSuggestions = suggestions.filter(suggestion =>
      suggestion.name.toLowerCase().includes(newInputValue.toLowerCase())
    );

    setFilteredSuggestions(newFilteredSuggestions);
  };

  const handleSuggestionClick = (selectedSuggestion) => {
    setInputValue(selectedSuggestion.name);
    onSelect(selectedSuggestion);
    setFilteredSuggestions([]);
    console.log(`Selected suggestion: ${selectedSuggestion.name}`);
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search for Pokémon cards..."
        className="search-input"
      />
      {filteredSuggestions.length > 0 && (
        <div className="autocomplete-suggestions">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
