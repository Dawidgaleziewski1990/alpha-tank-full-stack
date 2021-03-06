// Libs
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import { Global, css, jsx } from "@emotion/core";

// Components
import MainContainer from "./components/MainContainer/MainContainer";
import Tank from "./components/Pages/Tank";
import Login from "./components/Pages/Login";
import TanksHome from "./components/Pages/TanksHome";
import UserProfile from "./components/Pages/UserProfile";
import About from "./components/Pages/About";
// Utils
import {
  getUserToken,
  formatAuthorizationHeader,
  formatBearerToken,
} from "./utils/tokenUtils";
import { pipe } from "./utils/generalUtils";

/** @jsx jsx */
const globalStyles = css`
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  html {
    font-size: 10px;
  }
  body {
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    background-color: #f0f3f8;
    margin: 0;
    padding: 0;
  }
  ul,
  li,
  ol {
    margin: 0;
    padding-inline-start: 0;
  }
`;

function App() {
  const [tokenState, setTokenState] = useState(null);
  const [userAccountInfo, setUserAccountInfo] = useState({});
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const loginOnMount = async (isUserLoggedIn, tokenState) => {
    const token = getUserToken(tokenState);
    if (!isUserLoggedIn && token) {
      const authHeader = pipe(
        formatBearerToken,
        formatAuthorizationHeader
      )(token);
      try {
        const { data } = await axios.get("/users/me", { headers: authHeader });
        setTokenState(token);
        setIsUserLoggedIn(true);
        setUserAccountInfo(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    loginOnMount(isUserLoggedIn, tokenState);
  }, [isUserLoggedIn]);

  return (
    <div className="App">
      <Global styles={globalStyles} />
      <Router>
        <MainContainer
          setIsUserLoggedIn={setIsUserLoggedIn}
          setTokenState={setTokenState}
        >
          <Route
            path="/"
            exact
            render={() => (
              <Login
                isUserLoggedIn={isUserLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn}
                tokenState={tokenState}
                setTokenState={setTokenState}
              />
            )}
          />
          <Route
            path="/tanks"
            exact
            render={() => (
              <TanksHome
                isUserLoggedIn={isUserLoggedIn}
                tokenState={tokenState}
              />
            )}
          />
          <Route
            path="/tanks/:tankID"
            exact
            component={Tank}
            tokenState={tokenState}
          />
          <Route
            path="/me"
            exec
            render={() => (
              <UserProfile
                userAccountInfo={userAccountInfo}
                isUserLoggedIn={isUserLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn}
              />
            )}
          />
          <Route path="/about" exec component={About} />
        </MainContainer>
      </Router>
    </div>
  );
}

export default App;
