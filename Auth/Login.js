import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';

const Login = ({ onLogin }) => {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');

	const handleLogin = async () => {
		try {
			const userCredential = await auth.signInWithEmailAndPassword(email, password);
			const user = userCredential.user;
			onLogin(user);
		} catch (error) {
			console.error('Error logging in:', error);
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<label>Email:</label>
			<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<label>Password:</label>
			<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<button onClick={handleLogin}>Login</button>
		</div>
	);
};

export default Login;
