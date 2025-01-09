import { createContext, useContext, useState, useEffect } from 'react';

const VacationContext = createContext();
const STORAGE_KEY = 'vacation-management-vacations';

export function VacationProvider({ children }) {
  const [vacations, setVacations] = useState(() => {
    const savedVacations = localStorage.getItem(STORAGE_KEY);
    return savedVacations ? JSON.parse(savedVacations) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vacations));
  }, [vacations]);

  const addVacations = (newVacations) => {
    // Check for duplicates
    const uniqueVacations = newVacations.filter(newVacation => {
      return !vacations.some(existingVacation => (
        existingVacation.employeeId === newVacation.employeeId &&
        existingVacation.gregStartDate === newVacation.gregStartDate &&
        existingVacation.gregEndDate === newVacation.gregEndDate &&
        existingVacation.type === newVacation.type
      ));
    });

    if (uniqueVacations.length > 0) {
      setVacations(prev => [...prev, ...uniqueVacations]);
      return {
        success: true,
        message: `تمت إضافة ${uniqueVacations.length} إجازة جديدة`,
        duplicatesSkipped: newVacations.length - uniqueVacations.length
      };
    }

    return {
      success: false,
      message: 'جميع الإجازات موجودة مسبقاً',
      duplicatesSkipped: newVacations.length
    };
  };

  const getAllVacations = () => vacations;

  const getVacationsByDateRange = (startDate, endDate) => {
    return vacations.filter(vacation => {
      const vacationStart = new Date(vacation.gregStartDate);
      const vacationEnd = new Date(vacation.gregEndDate);
      const rangeStart = new Date(startDate);
      const rangeEnd = new Date(endDate);
      
      return (
        (vacationStart >= rangeStart && vacationStart <= rangeEnd) ||
        (vacationEnd >= rangeStart && vacationEnd <= rangeEnd) ||
        (vacationStart <= rangeStart && vacationEnd >= rangeEnd)
      );
    });
  };

  const value = {
    vacations,
    addVacations,
    getAllVacations,
    getVacationsByDateRange
  };

  return (
    <VacationContext.Provider value={value}>
      {children}
    </VacationContext.Provider>
  );
}

export function useVacations() {
  const context = useContext(VacationContext);
  if (!context) {
    throw new Error('useVacations must be used within a VacationProvider');
  }
  return context;
} 