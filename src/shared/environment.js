// const domainName = 'sensorenregister.amsterdam.nl';
// const apiDomainName = 'api.data.amsterdam.nl';

// const defaultConfig = {
//   API_ROOT: `https://acc.${apiDomainName}/`,
//   MAP_ROOT: 'https://map.data.amsterdam.nl/',
//   ROOT: 'http://localhost:3002/',
//   AUTH_ROOT: 'https://acc.api.data.amsterdam.nl/',
// };

const environmentConfig = () => {
  let environment;

  const hostname = window && window.location && window.location.hostname;
  const port = window && window.location && window.location.port;

  if (process.env.NODE_ENV === 'test') {
    environment = {
      API_ROOT: `https://api/`,
      MAP_ROOT: 'https://maps/',
      ROOT: `https://${hostname}/`
    };
  } else if ([`127.0.0.1`, `0.0.0.0`, `localhost`].includes(hostname)) {
    if (port) {
      // docker compose
      environment = {
        API_ROOT: `http://localhost:8000/api/`,
        MAP_ROOT: 'https://map.data.amsterdam.nl/',
        ROOT: `https://${hostname}/`
      };
    } else {
      // local kubernetes ingress
      environment = {
        API_ROOT: `http://localhost/api/`,
        MAP_ROOT: 'https://map.data.amsterdam.nl/',
        ROOT: `https://${hostname}/`
      };
    }
  } else {
    environment = {
      API_ROOT: `https://${hostname}/api/`,
      MAP_ROOT: 'https://map.data.amsterdam.nl/',
      ROOT: `https://${hostname}/`
    };
  }
  return environment;
};

const CONFIGURATION = {
  // the configuration based on the domain
  ...environmentConfig(),
};

export default CONFIGURATION;
