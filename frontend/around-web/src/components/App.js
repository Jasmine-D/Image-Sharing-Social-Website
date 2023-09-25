import React, { useState }from "react";
import TopBar from "./TopBar";
import Main from "./Main";
import { TOKEN_KEY } from "../constants";

function App() {
    // localStorage token
    // true => case1: already logged in
    // false => case2: not logged in
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem(TOKEN_KEY) ? true : false)

    const logout = () => {
        console.log("log out");
        // setIsLoggedIn -> false
        // delete token from localStorage
        setIsLoggedIn(false);
        localStorage.removeItem(TOKEN_KEY)
    }

    const loggedIn = (token) => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);// -> persistent login
            setIsLoggedIn(true); // -> display logout button
        }
    };

    return (
        <div className="App">
            <TopBar isLoggedIn={isLoggedIn} handleLogout={logout}/>
            <Main isLoggedIn={isLoggedIn} handleLoggedIn={loggedIn}/>
        </div>
    );
}

export default App;
