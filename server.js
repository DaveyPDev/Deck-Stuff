// const express = require('express');
// const bodyParser = require('body-parser');
// const { createCanvas, loadImage } = require('canvas');
// const path = require('path');
// const app = express();
// const port = 3001;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// function parseDeckList(deckText) {
//     const deckLines = deckText.split('\n');
//     const deck = [];
    
//     deckLines.forEach(line => {
//         const [quantity, ...cardNameParts] = line.split(' ');
//         const cardName = cardNameParts.join(' ');
//         deck.push({ quantity: parseInt(quantity, 10), cardName });
//     });

//     return deck;
// }

// async function generateDeckImage(deck) {
//     const canvas = createCanvas(800, 600);
//     const ctx = canvas.getContext('2d');
//     const cardWidth = 100;
//     const cardHeight = 140;

//     let x = 0, y = 0;

//     for (const card of deck) {
//         try {
//             const cardImage = await loadImage(path.join(__dirname, `path/to/card/images/${card.cardName}.png`));
//             for (let i = 0; i < card.quantity; i++) {
//                 ctx.drawImage(cardImage, x, y, cardWidth, cardHeight);
//                 x += cardWidth;
//                 if (x + cardWidth > canvas.width) {
//                     x = 0;
//                     y += cardHeight;
//                 }
//             }
//         } catch (error) {
//             console.error(`Error loading image for ${card.cardName}:`, error);
//         }
//     }

//     return canvas.toDataURL();
// }

// function exportDeckToTCGLive(deck) {
//     const exportedDeck = deck.map(card => ({
//         name: card.cardName,
//         count: card.quantity
//     }));

//     return JSON.stringify(exportedDeck, null, 2);
// }

// app.post('/import-deck', async (req, res) => {
//     const deckText = req.body.deckText;
//     const deck = parseDeckList(deckText);
//     const deckImage = await generateDeckImage(deck);
//     const exportedDeck = exportDeckToTCGLive(deck);
//     res.send({ deck, deckImage, exportedDeck });
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });
