import React from 'react';
import { Link } from 'react-router-dom'; 
import { auth } from '../Firebase/Firebase';
import './Navbar.css';

const Navbar = ({ user }) => { 
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg justify-content-between">
      <div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/cards">Card Viewer</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/deckBuilder">Deck Builder</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/deckImporter">Deck Importer</Link>
          </li>
          {user ? (
            <li className="nav-item" onClick={handleLogout}>
              <a className="nav-link" href="#">Logout</a>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/signUp">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;

// import React from 'react';
// import { auth } from '../Firebase/Firebase';
// import './Navbar.css';

// const Navbar = ({ setActiveView, user }) => {
//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <nav className="navbar navbar-expand-lg justify-content-between">
//       <div>
//         <ul className="navbar-nav">
//           <li className="nav-item" onClick={() => setActiveView('home')}>
//             <a className="nav-link" href="#">Home</a>
//           </li>
//         </ul>
//       </div>
//       <div>
//         <ul className="navbar-nav ml-auto">
//           <li className="nav-item" onClick={() => setActiveView('cardViewer')}>
//             <a className="nav-link" href="#">Card Viewer</a>
//           </li>
//           <li className="nav-item" onClick={() => setActiveView('deckBuilder')}>
//             <a className="nav-link" href="#">Deck Builder</a>
//           </li>
//           {user ? (
//             <li className="nav-item" onClick={handleLogout}>
//               <a className="nav-link" href="#">Logout</a>
//             </li>
//           ) : (
//             <>
//               <li className="nav-item" onClick={() => setActiveView('login')}>
//                 <a className="nav-link" href="#">Login</a>
//               </li>
//               <li className="nav-item" onClick={() => setActiveView('signUp')}>
//                 <a className="nav-link" href="#">Sign Up</a>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;