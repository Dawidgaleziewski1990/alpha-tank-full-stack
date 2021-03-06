import React, { Fragment } from "react";
import { css, jsx } from "@emotion/core";
import Header from "../Header/Header";

/** @jsx jsx */
const mainContainerStyle = css`
  max-width: 1170px;
  margin-left: auto;
  margin-right: auto;
`;

const MainContainer = ({ setIsUserLoggedIn, children, setTokenState }) => {
  return (
    <Fragment>
      <Header
        setIsUserLoggedIn={setIsUserLoggedIn}
        setTokenState={setTokenState}
      />
      <main css={mainContainerStyle}>{children}</main>
    </Fragment>
  );
};

export default MainContainer;
