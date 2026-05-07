import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DreamLifeProvider } from './context/DreamLifeContext';

function App() {
  return (
    <DreamLifeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="calculator" element={<CalculatorPage />} />
            <Route path="scenarios" element={<ScenariosPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DreamLifeProvider>
  );
}

export default App;
