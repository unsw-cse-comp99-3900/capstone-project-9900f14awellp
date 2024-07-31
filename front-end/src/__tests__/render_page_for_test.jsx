import React from "react";
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const render_page = (Page, url) => {
  return render(
    <MemoryRouter initialEntries={[`/${url}`]}>
        <Page />
    </MemoryRouter>
  );
}