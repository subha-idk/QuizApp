// import React, { createContext, useState, useContext } from 'react';

// const RoleContext = createContext();

// export const useRole = () => useContext(RoleContext);

// export const RoleProvider = ({ children }) => {
//     const [role, setRole] = useState('user'); // Default role is 'user'

//     const toggleRole = () => {
//         setRole(prevRole => (prevRole === 'user' ? 'admin' : 'user'));
//     };

//     const value = { role, toggleRole };

//     return (
//         <RoleContext.Provider value={value}>
//             {children}
//         </RoleContext.Provider>
//     );
// };
