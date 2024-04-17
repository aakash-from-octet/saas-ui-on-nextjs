import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';

// css files 
// import 'antd/dist/antd.css';
import '@/styles/globals.css';
import '@/styles/main.css';
import '@/styles/custom-ant.css';
import '@/styles/navbar.css';
import '@/styles/landing.css';
import '@/styles/me-only-flow.css';
import '@/styles/login.css';
import '@/styles/signature-canvas.css';
import '@/styles/product-notification.css';
import '@/styles/create-document.css';
import '@/styles/settings.css';



import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from "@/redux/store"
import Head from 'next/head';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Elastic Sign</title>
        <meta name="description" content="A pdf signature application." />

      </Head>
      <ConfigProvider theme={theme}>
        <Provider store={store}>
          {/* <PersistGate loading={null} persistor={persistor}> */}
          <Component {...pageProps} />
          {/* </PersistGate> */}
        </Provider>
      </ConfigProvider>
    </>

  );
}
