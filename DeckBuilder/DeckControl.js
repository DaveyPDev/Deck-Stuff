import React from 'react';

const DeckControl = ({ card, onAdd, onRemove, onDelete, selectedCardId }) => {
  const isCardSelected = selectedCardId === card.id;

  return (
    <div className={`deck-controls${isCardSelected ? ' selected' : ''}`} onClick={() => onAdd(card)}>
      <button onClick={(e) => { e.stopPropagation(); onRemove(card.id); }}>-</button>
      <span>{card.quantity}</span>
      <button onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}>X</button>
    </div>
  );
};

export default DeckControl;


// import React from 'react';

// const DeckControl = ({ card, onRemove, onAdd, onDelete }) => {
//     return (
//         <div className="deck-controls" onClick={() => onAdd(card)}>
//             <button onClick={(e) => {e.stopPropagation(); onRemove(card.id);}}>-</button>
//             <span>{card.quantity}</span>
//             <button onClick={(e) => {e.stopPropagation(); onDelete(card.id);}}>X</button>
//         </div>
//     );
// };

// export default DeckControl;