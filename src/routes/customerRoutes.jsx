import { lazy } from 'react';

const MainLayout = lazy(() => import('../layouts/MainLayout'));
const HomePage = lazy(() => import('../pages/HomePage'));

const customerRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { index: true, element: <HomePage /> },
    // thêm các route khác ở đây
  ],
};

export default customerRoutes;
