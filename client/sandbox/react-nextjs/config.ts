const isProd =
  typeof window !== 'undefined'
    ? Boolean(localStorage.getItem('prodBackend'))
    : false;

const config = {
  apiURI: isProd ? 'https://instantdb.backend.medmatic.ai' : 'http://instantdb.backend.medmatic.ai',
  websocketURI: isProd
    ? 'wss://instantdb.backend.medmatic.ai/runtime/session'
    : 'ws://instantdb.backend.medmatic.ai/runtime/session',

  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  devtool: true,
};

export default config;
