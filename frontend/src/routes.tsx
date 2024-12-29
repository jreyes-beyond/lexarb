import { Route, RootRoute } from '@tanstack/react-router';
import Shell from './components/layout/Shell';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';

export const rootRoute = new RootRoute({
  component: Shell,
});

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

export const casesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/cases',
  component: Cases,
});

export const routes = [
  rootRoute,
  indexRoute,
  casesRoute,
];