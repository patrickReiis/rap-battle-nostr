import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage } from '@/pages/HomePage';
import { PracticePage } from '@/pages/PracticePage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { BeatsPage } from '@/pages/BeatsPage';
import NotFound from "./pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/beats" element={<BeatsPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;