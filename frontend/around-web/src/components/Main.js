import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router";

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";

function Main(props) {
    const{ handleLoggedIn, isLoggedIn } = props;
    // login
    // case1: already logged in => Home
    // case2: hasn't logged in => Login
    const showLogin = () => {
        return isLoggedIn
            ?
            <Redirect to="/home" />
            :
            <Login handleLoggedIn={handleLoggedIn}></Login>
    }

    // login
    // case1: already logged in => Home
    // case2: hasn't logged in => Login
    const showHome = () => {
        return isLoggedIn
            ?
            <Home />
            :
            <Redirect to={"/login"} />
    }

    return (
        <div className="main">
            <Switch>
                <Route exact path="/" render={showLogin} />
                <Route path="/login" render={showLogin} />
                <Route path="/register" component={Register} />
                <Route path="/home" render={showHome} />
            </Switch>
        </div>
    );
}

export default Main;