import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useVacations } from '../context/VacationContext';

const VACATION_TYPES = {
  عادية: { color: 'bg-blue-100', text: 'ع' },
  مرضية: { color: 'bg-red-100', text: 'م' },
  تعويضية: { color: 'bg-green-100', text: 'ت' }
};

const MONTHS = [
  { value: 0, label: 'يناير' },
  { value: 1, label: 'فبراير' },
  { value: 2, label: 'مارس' },
  { value: 3, label: 'أبريل' },
  { value: 4, label: 'مايو' },
  { value: 5, label: 'يونيو' },
  { value: 6, label: 'يوليو' },
  { value: 7, label: 'أغسطس' },
  { value: 8, label: 'سبتمبر' },
  { value: 9, label: 'أكتوبر' },
  { value: 10, label: 'نوفمبر' },
  { value: 11, label: 'ديسمبر' },
];

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { vacations } = useVacations();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Filter vacations for current month
  const currentMonthVacations = vacations.filter(vacation => {
    const startDate = new Date(vacation.gregStartDate);
    const endDate = new Date(vacation.gregEndDate);
    return (
      isSameMonth(startDate, currentDate) ||
      isSameMonth(endDate, currentDate) ||
      (startDate <= monthStart && endDate >= monthEnd)
    );
  });

  // Group vacations by employee, but only for employees with vacations in current month
  const vacationsByEmployee = currentMonthVacations.reduce((acc, vacation) => {
    if (!acc[vacation.employeeId]) {
      acc[vacation.employeeId] = {
        name: vacation.name,
        vacations: []
      };
    }
    acc[vacation.employeeId].vacations.push(vacation);
    return acc;
  }, {});

  const getVacationForDay = (employeeId, day) => {
    const employeeVacations = vacationsByEmployee[employeeId]?.vacations || [];
    return employeeVacations.find(vacation => {
      const startDate = new Date(vacation.gregStartDate);
      const endDate = new Date(vacation.gregEndDate);
      const currentDay = new Date(day);
      return currentDay >= startDate && currentDay <= endDate;
    });
  };

  const handleMonthChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-full">
      <div className="flex gap-4 items-center mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">السنة</label>
          <select
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={currentDate.getFullYear()}
            onChange={(e) => {
              const newDate = new Date(currentDate);
              newDate.setFullYear(parseInt(e.target.value));
              setCurrentDate(newDate);
            }}
          >
            {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الشهر</label>
          <select
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={currentDate.getMonth()}
            onChange={handleMonthChange}
          >
            {MONTHS.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 border border-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 bg-gray-50 text-right text-xs font-medium text-gray-500 w-48 border-b border-r border-gray-200">
                الموظف
              </th>
              {days.map((day) => (
                <th
                  key={day.toString()}
                  className={`px-1 py-2 bg-gray-50 text-center text-xs font-medium text-gray-500 w-8 border-b border-r border-gray-200 ${
                    [5, 6].includes(day.getDay()) ? 'bg-gray-100' : ''
                  }`}
                >
                  {format(day, 'd')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(vacationsByEmployee).map(([employeeId, { name }]) => (
              <tr key={employeeId}>
                <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                  {name}
                </td>
                {days.map((day) => {
                  const vacation = getVacationForDay(employeeId, day);
                  const isWeekend = [5, 6].includes(day.getDay());
                  return (
                    <td
                      key={day.toString()}
                      className={`relative px-1 py-2 text-center text-xs ${
                        vacation ? VACATION_TYPES[vacation.type].color : isWeekend ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="absolute inset-0 border-r border-b border-gray-200" style={{ pointerEvents: 'none' }}></div>
                      {vacation && VACATION_TYPES[vacation.type].text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CalendarView; 