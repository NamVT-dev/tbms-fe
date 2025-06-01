import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import TourDetailPage from "./pages/TourDetailPage";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tour-detail" element={<TourDetailPage />} />
            {/* other routes here*/}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
