import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';

import styles from './SignUp.css';

const SignUp = ({ onSignUp }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [termsAndConditions, setTermsAndConditions] = useState(false);
  
	const handleSignUp = async () => {
	  if (password !== confirmPassword) {
		console.error('Passwords do not match');
		return;
	  }
	  if (!termsAndConditions) {
		console.error('You must agree to the terms and conditions');
		return;
	  }
	  try {
		const userCredential = await auth.createUserWithEmailAndPassword(email, password);
		const user = userCredential.user;
		onSignUp(user);
	  } catch (error) {
		console.error('Error signing up:', error);
	  }
	};
  
	const handleSubmit = (e) => {
	  e.preventDefault();
	  handleSignUp();
	};

		return (
		  <div className='signup-form'>
			<h2>Sign Up</h2>
			<form onSubmit={handleSubmit}>
			  <label>First Name:</label>
			  <input 
				type="text" 
				value={firstName} 
				onChange={(e) => setFirstName(e.target.value)} 
				autoComplete="given-name" 
			  />
			  <label>Last Name:</label>
			  <input 
				type="text" 
				value={lastName} 
				onChange={(e) => setLastName(e.target.value)} 
				autoComplete="family-name" 
			  />
			  <label>Username:</label>
			  <input 
				type="text" 
				value={username} 
				onChange={(e) => setUsername(e.target.value)} 
				autoComplete="username" 
			  />
			  <label>Email:</label>
			  <input 
				type="email" 
				value={email} 
				onChange={(e) => setEmail(e.target.value)} 
				autoComplete="email" 
			  />
			  <label>Password:</label>
			  <input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				autoComplete="new-password"
			  />
			  <label>Confirm Password:</label>
			  <input
				type="password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				autoComplete="new-password"
			  />
			  <label>
				I agree to the terms and conditions
				<input
				  type="checkbox"
				  checked={termsAndConditions}
				  onChange={(e) => setTermsAndConditions(e.target.checked)}
				/>
			  </label>
			  <button type="submit">Sign Up</button> 
			</form>
		  </div>
		);
	  };
	  
	 

export default SignUp;


// import React, { useState } from 'react';
// import { auth } from '../Firebase/Firebase';

// const SignUp = ({ onSignUp }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [username, setUsername] = useState('');
//     const [termsAndConditions, setTermsAndConditions] = useState(false);

//     const handleSignUp = async (event) => {
//         event.preventDefault(); // Prevent default form submission

//         if (password !== confirmPassword) {
//             console.error('Passwords do not match');
//             return;
//         }
//         if (!termsAndConditions) {
//             console.error('You must agree to the terms and conditions');
//             return;
//         }
//         try {
//             const userCredential = await auth.createUserWithEmailAndPassword(email, password);
//             const user = userCredential.user;
//             onSignUp(user);
//         } catch (error) {
//             console.error('Error signing up:', error);
//         }
//     };

//     return (
//         <div className='signup-form'>
//             <h2>Sign Up</h2>
//             <form onSubmit={handleSignUp}> {/* Handle form submission */}
//                 <label>First Name:</label>
//                 <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//                 <label>Last Name:</label>
//                 <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
//                 <label>Username:</label>
//                 <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//                 <label>Email:</label>
//                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//                 <label>Password:</label>
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
//                 <label>Confirm Password:</label>
//                 <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
//                 <label>
//                     I agree to the terms and conditions
//                     <input
//                         type="checkbox"
//                         checked={termsAndConditions}
//                         onChange={(e) => setTermsAndConditions(e.target.checked)}
//                     />
//                 </label>
//                 <button type="submit">Sign Up</button> {/* Specify type as submit */}
//             </form> 
//         </div>
//     );
// }

// export default SignUp;



// import React, { useState } from 'react';
// import { auth } from '../Firebase/Firebase';

// import styles from './SignUp.css';

// const SignUp = ({ onSignUp }) => {
// 	const [ email, setEmail ] = useState('');
// 	const [ password, setPassword ] = useState('');
// 	const [ confirmPassword, setConfirmPassword ] = useState('');
// 	const [ firstName, setFirstName ] = useState('');
// 	const [ lastName, setLastName ] = useState('');
// 	const [ username, setUsername ] = useState('');
// 	const [ termsAndConditions, setTermsAndConditions ] = useState(false);

// 	const handleSignUp = async () => {
// 		if (password !== confirmPassword) {
// 			console.error('Passwords do not match');
// 			return;
// 		}
// 		if (!termsAndConditions) {
// 			console.error('You must agree to the terms and conditions');
// 			return;
// 		}
// 		try {
// 			const userCredential = await auth.createUserWithEmailAndPassword(email, password);
// 			const user = userCredential.user;
// 			onSignUp(user);
// 		} catch (error) {
// 			console.error('Error signing up:', error);
// 		}
// 	};

	
// 	return (
// 		<div className='signup-form'>
// 			<h2>Sign Up</h2>
// 			<form>
// 			<label>First Name:</label>
// 			<input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
// 			<label>Last Name:</label>
// 			<input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
// 			<label>Username:</label>
// 			<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
// 			<label>Email:</label>
// 			<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
// 			<label>Password:</label>
// 			<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
// 			<label>Confirm Password:</label>
// 			<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
// 			<label>
// 				I agree to the terms and conditions
// 				<input
// 					type="checkbox"
// 					checked={termsAndConditions}
// 					onChange={(e) => setTermsAndConditions(e.target.checked)}
// 				/>
// 			</label>
// 			<button onClick={handleSignUp}>Sign Up</button>
// 		</form>
// 		</div>
// 	);
// }


// export default SignUp;
