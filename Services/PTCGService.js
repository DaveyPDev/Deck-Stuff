
import PokemonTCG from 'pokemon-tcg-sdk';

export const fetchCards = (options = {}) => {
  return PokemonTCG.Card.all(options);
};


