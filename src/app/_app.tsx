import '../styles/globals.css';
import type { AppProps } from 'next/app';


// For Next.js, we can include this in the _app.tsx or in a head component
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { faLink, faFont, faHeading, faFilter } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}




config.autoAddCss = false;
library.add(faLink, faFont, faHeading, faFilter);

export default MyApp;