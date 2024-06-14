import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CardViewer from './Components/Card/CardViewer';
import CardDetails from './Components/Card/CardDetail';
import DeckBuilder from './Components/DeckBuilder/DeckBuilder';

import Login from './Components/Auth/Login';
import SignUp from './Components/Auth/SignUp';
import Profile from './Components/Auth/Profile';

import Footer from './Footer';
import HomePage from './Components/Shared/HomePage';
import Navbar from './Components/Navbar/Navbar';

import './App.css';
import './Components/Bootstrap/BootstrapImports';

function App () {
	const [ user, setUser ] = useState(null);
	const [ activeView, setActiveView ] = useState('home');

	const handleLogin = async (loggedInUser) => {
		try {
			setUser(loggedInUser);
		} catch (error) {
			console.error('Error logging in:', error);
		}
	};

	const handleSignUp = async (signedUpUser) => {
		try {
			setUser(signedUpUser);
		} catch (error) {
			console.error('Error signing up:', error);
		}
	};

	const handleActiveView = (view) => {
		setActiveView(view);
	};

	return (
		<div className="App">
			<Router>
				<Navbar user={user} setActiveView={handleActiveView} />
				<Routes>
					<Route path="/cards/:cardId" element={<CardDetails />} />
					<Route path="/cards" element={<CardViewer />} />
					<Route path="/deckBuilder" element={<DeckBuilder />} />
					{/* <Route path="/deckImporter" element={<DeckImporter />} /> */}
					<Route path="/signUp" element={<SignUp onSignUp={handleSignUp} />} />
					<Route path="/login" element={<Login onLogin={handleLogin} />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/" element={<HomePage />} />
				</Routes>
				<Footer />
			</Router>
		</div>
	);
}

export default App;

// import React, { useState } from 'react';
// // import { auth } from './Components/Firebase/Firebase';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import CardViewer from './Components/Card/CardViewer';
// import CardDetails from './Components/Card/CardDetail';
// import DeckBuilder from './Components/Deck/DeckBuilder';
// import Login from './Components/Auth/Login';
// import Navbar from './Components/Navbar/Navbar';
// import SignUp from './Components/Auth/SignUp';
// import Profile from './Components/Auth/Profile';
// import Footer from './Footer';

// import './App.css';
// import './Components/Bootstrap/BootstrapImports'

// function App() {
//   const [activeView, setActiveView] = useState('cardViewer');
//   const [user, setUser] = useState(null);
//   const [selectedCard, setSelectedCard] = useState(null);

//   const handleLogin = async (loggedInUser) => {
//     try {
//       setUser(loggedInUser);
//       setActiveView('cardViewer');
//     } catch (error) {
//       console.error('Error logging in:', error);

//     }
//   };

//   const handleSignUp = async (signedUpUser) => {
//     try {
//       setUser(signedUpUser);
//       setActiveView('cardViewer');
//     } catch (error) {
//       console.error('Error signing up:', error);
//       // Handle error, show a message to the user, etc.
//     }
//   };

//   return (
//     <div className="App">
//       <Router>
//       <Navbar setActiveView={setActiveView} user={user} />

//         {activeView === 'cardViewer' && <CardViewer setActiveView={setActiveView} setSelectedCard={setSelectedCard} />}
//         {activeView === 'cardDetails' && <CardDetails card={selectedCard} />}
//         {activeView === 'deckBuilder' && <DeckBuilder />}
//         {activeView === 'login' && <Login onLogin={handleLogin} />}
//         {activeView === 'signUp' && <SignUp onSignUp={handleSignUp} />}
//         {activeView === 'profile' && <Profile />}

//       </Router>
//       <Footer />
//     </div>
//   );
// }

// export default App;
