import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { HeaderContainer } from './index';

describe('<HeaderContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      userName: 'user',
      onLogin: vi.fn(),
      onLogout: vi.fn(),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render correctly when authenticated', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HeaderContainer {...props} />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
