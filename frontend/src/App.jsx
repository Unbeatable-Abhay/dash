import { ThemeProvider } from './context/ThemeContext';
import { useDashboardData } from './hooks/useDashboardData';
import { useIsMobile } from './hooks/useIsMobile';
import AmbientBackground from './components/AmbientBackground';
import WebShell from './components/WebShell';
import MobileShell from './components/MobileShell';
import DashboardContent from './components/DashboardContent';

function DashApp() {
  const { data, isSyncing, syncError, dataVersion, sync } = useDashboardData();
  const isMobile = useIsMobile();

  const Shell = isMobile ? MobileShell : WebShell;

  return (
    <>
      <AmbientBackground />
      <Shell data={data} isSyncing={isSyncing} syncError={syncError} onSync={sync}>
        <DashboardContent data={data} versionKey={dataVersion} />
      </Shell>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashApp />
    </ThemeProvider>
  );
}
