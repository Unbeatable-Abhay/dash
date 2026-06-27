import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useDashboardData } from './hooks/useDashboardData';
import { useIsMobile } from './hooks/useIsMobile';
import { useJobToggle } from './hooks/useJobToggle';
import AmbientBackground from './components/AmbientBackground';
import WebShell from './components/WebShell';
import MobileShell from './components/MobileShell';
import DashboardContent from './components/DashboardContent';
import MonitorSection from './components/MonitorSection';
import ProjectDetailPage from './components/ProjectDetailPage';

function DashApp() {
  const { data, isSyncing, syncError, dataVersion, sync, updateJobEnabled } = useDashboardData();
  const { toggleJob, pendingJobId, toggleError } = useJobToggle(updateJobEnabled);
  const isMobile = useIsMobile();
  const [selectedProject, setSelectedProject] = useState(null);

  const Shell = isMobile ? MobileShell : WebShell;

  const dashboardContent = selectedProject ? (
    <ProjectDetailPage project={selectedProject} onBack={() => setSelectedProject(null)} />
  ) : (
    <DashboardContent data={data} versionKey={dataVersion} onSelectProject={setSelectedProject} />
  );

  const monitorContent = (
    <MonitorSection jobs={data.monitor} onToggle={toggleJob} pendingJobId={pendingJobId} />
  );

  return (
    <>
      <AmbientBackground />
      <Shell
        data={data}
        isSyncing={isSyncing}
        syncError={syncError || toggleError}
        onSync={sync}
        dashboardContent={dashboardContent}
        monitorContent={monitorContent}
      />
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
