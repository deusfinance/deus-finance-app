import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    font-size: 1rem;
    color: #ffffff;
    font-family: 'Rubik';
    font-weight: 400;
    background: radial-gradient(49.81% 49.81% at 50% 49.81%, rgb(39, 39, 39) 0%, rgb(0, 0, 0) 100%);
  }

  button {
    all: unset;
    cursor: pointer;
    padding: 0px;
  }

  html {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }

  /* SCROLLBAR */
  /* hide scrollbar but allow scrolling */
  * {
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    overflow-y: scroll;
  }

  *::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  /* END OF SCROLLBAR */
`

export default GlobalStyle
