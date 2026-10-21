// ====================================================================
// RIOEXPRESS MASTER CONFIGURATION ENGINE
// Developed & Powered by: Bataan Creation
// Developer & Owner: Reynold P. Rio (09365810610 / bataancreation@gmail.com)
// ====================================================================

const RIO_CONFIG = {
  // 1. SUPABASE DATABASE CONNECTION CREDENTIALS
  SUPABASE_URL: 'https://bpnbsnionphreomxrkca.supabase.co',
  
  // I-copy ang buong 'Publishable key' mula sa iyong Supabase popup screenshot at i-paste dito:
  SUPABASE_ANON_KEY: 'sb_publishable_tW5I8J41sV3BzVAx...', 

  // 2. OFFICIAL GCASH PAYMENT WALLET
  OFFICIAL_GCASH: '09365810610',
  OFFICIAL_GCASH_NAME: 'Reynold P. / Bataan Creation',

  // 3. MORONG BATAAN GPS CENTROIDS & GEOFENCING
  MORONG_BARANGAYS: {
    'Poblacion': { lat: 14.6811, lng: 120.2588 },
    'Binaritan': { lat: 14.6730, lng: 120.2450 },
    'Sabang': { lat: 14.6850, lng: 120.2310 },
    'Nagbalayong': { lat: 14.6980, lng: 120.2180 },
    'Mabayo': { lat: 14.7200, lng: 120.2000 }
  },

  // 4. DYNAMIC FARE MATRIX CONFIG
  GAS_PRICE_PER_LITER: 72.00,
  KM_PER_LITER: 35.0,
  BASE_FARE_FLOOR: 40.00,
  RIDER_PROFIT_MARGIN: 2.5
};

// Freeze configuration object to prevent runtime tampering
Object.freeze(RIO_CONFIG);