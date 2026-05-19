import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DashboardProvider } from './context/DashboardContext'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import StageDetail from './pages/StageDetail'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ManualKeyIn from './pages/ManualKeyIn'

// Detail Mockups
import OEEDetails from './pages/details/OEEDetails'
import TaktCycleDetails from './pages/details/TaktCycleDetails'
import WIPDetails from './pages/details/WIPDetails'
import MTTRDetails from './pages/details/MTTRDetails'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'stage/:stageId', element: <StageDetail /> },
      { path: 'alerts',   element: <Alerts /> },
      { path: 'reports',  element: <Reports /> },
      { path: 'settings', element: <Settings /> },
      { path: 'manual-key-in', element: <ManualKeyIn /> },
      
      { path: 'oee', element: <OEEDetails /> },
      { path: 'takt-cycle', element: <TaktCycleDetails /> },
      { path: 'wip', element: <WIPDetails /> },
      { path: 'mttr', element: <MTTRDetails /> },
    ],
  },
])

export default function App() {
  return (
    <DashboardProvider>
      <RouterProvider router={router} />
    </DashboardProvider>
  )
}
