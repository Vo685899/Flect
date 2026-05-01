import '../styles/globals.css';
import Head from 'next/head';
import { AuthProvider } from '../lib/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <Component {...pageProps}/>
    </AuthProvider>
  );
}
