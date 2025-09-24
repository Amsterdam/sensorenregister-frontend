import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import moxios from 'moxios';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@amsterdam/asc-ui';
import SensorenRegister from './containers/App/index';
import sensors from './classes/__mockData__/sensors.json';
import { vi } from 'vitest';

vi.mock('./containers/MapContainer/PointClusterLayer', () => ({
  __esModule: true,
  default: () => <></>,
}));

vi.mock('./containers/MapContainer/CenterMap', () => ({
  __esModule: true,
  default: () => <></>,
}));

vi.mock('./containers/HeaderContainer/index', () => {
  return {
    __esModule: true,
    default: () => <></>,
  };
});

const mockData = sensors.map((s) => s.feature.properties.originalData);

const emptyResponse = {
  features: [],
};

const TestRegister = () => {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <SensorenRegister />
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('SensorenRegister', () => {
  beforeEach(() => {
    moxios.install(axios);

    // Mock map data endpoints
    const mapUrls = [
      '/open_geodata/geojson_lnglat.php?KAARTLAAG=VIS&THEMA=vis',
      '/open_geodata/geojson_lnglat.php?KAARTLAAG=PRIVACY_BRUGSLUIS&THEMA=privacy',
      '/open_geodata/geojson_lnglat.php?KAARTLAAG=CROWDSENSOREN&THEMA=cmsa',
      '/open_geodata/geojson_lnglat.php?KAARTLAAG=PRIVACY_AISMASTEN&THEMA=privacy',
      '/open_geodata/geojson_lnglat.php?KAARTLAAG=PRIVACY_OVERIG&THEMA=privacy',
      '/open_geodata/geojson_lnglat.php?KAARTLAAG=VIS_BFA&THEMA=vis',
    ];

    mapUrls.forEach((url) => {
      moxios.stubRequest(`https://maps.amsterdam.nl${url}`, {
        status: 200,
        response: emptyResponse,
      });
    });

    // Mock devices API call
    moxios.stubRequest('https://api/devices/?page=1&page_size=1000', {
      status: 200,
      response: {
        count: mockData.length,
        results: mockData,
        _links: { next: { href: null } },
      },
    });
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  describe('Basics', () => {
    it('should render without errors', async () => {
      render(<TestRegister />);

      await screen.findByText('Sensortype');

      expect(screen.getByText('Eigenaar')).toBeInTheDocument();

      expect(screen.getByText('Gemeente Amsterdam (1)')).toBeInTheDocument();
      expect(screen.getByText('Andere (7)')).toBeInTheDocument();
      expect(screen.getByText('Veiligheid: bewakings- en/of beveiligingscamera (5)')).toBeInTheDocument();
    });

    it('should filter results when selecting a filter', async () => {
      render(<TestRegister />);

      await screen.findByText('Sensortype');

      expect(screen.getByText('Positie- of verplaatsingsensor (1)')).toBeInTheDocument();

      userEvent.click(screen.getByText('Gemeente Amsterdam (1)'));

      await screen.findByText('Positie- of verplaatsingsensor (0)');

      expect(screen.getByText('Mobiliteit: railverkeer (1)')).toBeInTheDocument();
      expect(screen.getByText('Mobiliteit: fiets (1)')).toBeInTheDocument();
    });

    it('should be possible to search for sensors', async () => {
      render(<TestRegister />);

      await screen.findByText('Sensortype');

      expect(screen.getByText('Positie- of verplaatsingsensor (1)')).toBeInTheDocument();

      expect(screen.queryByText('Verantwoordelijke voor de sensor')).not.toBeInTheDocument();

      userEvent.type(screen.getByPlaceholderText('Zoeken...'), 'AMSTD002');

      await screen.findByRole('link', { name: /amstd002/i }, { timeout: 5000 });
    });
  });
});
