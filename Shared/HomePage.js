import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
	return (
		<div>
			<h1>Welcome to the Homepage!</h1>
			<p>Get started with creating an account</p>
			<ul>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/signup">Create Profile</Link>
				</li>
				<li>
					<Link to="/cards">Card Viewer</Link>
				</li>
				<li>
					<Link to="/deckbuilder">Deck Builder</Link>
				</li>
				<li>
					<Link to="/deckImporter">Deck Importer</Link>
				</li>
				<li>
					<Link to="/contact">Contact</Link>
				</li>
				
			</ul>
		</div>
	);
};

export default HomePage;
