const ENV = process.env.NODE_ENV || 'development';

// Always check for NEXT_PUBLIC_API_URL first (highest priority)
const API_URL = process.env.NEXT_PUBLIC_API_URL || `http://127.0.0.1:8000/`;

const local = {
  ENV,
  APP_URL: `http://localhost:3000/`,
  API_URL,
  RAZORPAY_ID: `rzp_test_oh38vXeImszCBC`,
  RAZORPAY_SECRET: `q3tr1pWtMHgd9F1Beles5Nwx`,
};

const development = {
  ...local,
};

const production = {
  ENV,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || `https://batteryswap.vercel.app/`,
  API_URL, // Use environment variable even in production
  RAZORPAY_ID: `rzp_test_oh38vXeImszCBC`,
  RAZORPAY_SECRET: `q3tr1pWtMHgd9F1Beles5Nwx`,
};

const configs = { local, development, production };
const currentConfig = configs[ENV] || configs.development;

export const config = {
  ENV: currentConfig.ENV,
  APP_URL: currentConfig.APP_URL,
  API_URL: currentConfig.API_URL,
};
