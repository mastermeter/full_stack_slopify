import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ApolloProvider } from '@apollo/client';
import client from "./graphql/apollo.js";

const theme = createTheme({
  palette: { 
    primary: { 
      main: "#4001f5", 
    }, 
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </ThemeProvider>
    </CssBaseline>
  </StrictMode>,
)
