import { Navbar } from './components/Navbar';

import './App.scss';
import { Outlet, useLocation } from 'react-router-dom';

export const App = () => {
  const { pathname, search } = useLocation();

  return (
    <div data-cy="app">
      <div>
        <p className="title is-5 has-text-info">{pathname}</p>
      </div>
      {''}
      <div>
        <p className="title is-6">{search && search.replace('&', ' &')}</p>
      </div>
      <Navbar />

      <div className="section">
        <div className="container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
