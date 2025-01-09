import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import CalendarView from './components/CalendarView';
import AddVacations from './components/AddVacations';
import Reports from './components/Reports';
import { VacationProvider } from './context/VacationContext';

function App() {
  return (
    <VacationProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 text-gray-900" dir="rtl">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex h-16">
                <div className="flex gap-12 mr-4">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `inline-flex items-center px-3 pt-1 border-b-2 text-base font-medium transition-colors duration-200 ${
                        isActive
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`
                    }
                  >
                    التقويم
                  </NavLink>
                  <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                      `inline-flex items-center px-3 pt-1 border-b-2 text-base font-medium transition-colors duration-200 ${
                        isActive
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`
                    }
                  >
                    التقارير
                  </NavLink>
                  <NavLink
                    to="/add"
                    className={({ isActive }) =>
                      `inline-flex items-center px-3 pt-1 border-b-2 text-base font-medium transition-colors duration-200 ${
                        isActive
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`
                    }
                  >
                    إضافة إجازات
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<CalendarView />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/add" element={<AddVacations />} />
            </Routes>
          </main>
        </div>
      </Router>
    </VacationProvider>
  );
}

export default App; 