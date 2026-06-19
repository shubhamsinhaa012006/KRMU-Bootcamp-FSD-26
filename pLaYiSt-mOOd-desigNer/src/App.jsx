import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlaylistProvider } from './hooks/usePlaylists';
import { TopNavBar } from './components/navigation/TopNavBar';
import { DashboardPage } from './pages/DashboardPage';
import { AllPlaylistsPage } from './pages/AllPlaylistsPage';
import { PlaylistDetailsPage } from './pages/PlaylistDetailsPage';

function App() {
  return (
    <PlaylistProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
          {/* Ambient background glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-focus/10 blur-[120px] pointer-events-none" />

          <TopNavBar />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/playlists" element={<AllPlaylistsPage />} />
              <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </PlaylistProvider>
  );
}

export default App;
