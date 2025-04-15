import CONFIGURATION from '../shared/environment';

const APP_ROUTES = {
  HOME: '/',
  CATEGORIES: '/categories',
  ABOUT_FAQ: '/about/faq',
  ABOUT: '/about',
  ADDSENSOR: CONFIGURATION.API_ROOT + 'sensor_entries/',
  MIGRATION: '/slimmeapparaten',
};

export default APP_ROUTES;
