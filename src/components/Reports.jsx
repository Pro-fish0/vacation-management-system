import { useState } from 'react';
import { useVacations } from '../context/VacationContext';
import { format, differenceInDays } from 'date-fns';
import { ar } from 'date-fns/locale';

const VACATION_TYPES = {
  عادية: { color: 'bg-blue-100', textColor: 'text-blue-800', letter: 'R' },
  مرضية: { color: 'bg-red-100', textColor: 'text-red-800', letter: 'S' },
  تعويضية: { color: 'bg-green-100', textColor: 'text-green-800', letter: 'C' },
  مرافق: { color: 'bg-yellow-100', textColor: 'text-yellow-800', letter: 'A' },
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

const MONTHLY_WORKING_HOURS = 192;

function Reports() {
  const { vacations } = useVacations();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Get unique years from vacations
  const years = [...new Set(vacations.map(v => new Date(v.gregStartDate).getFullYear()))].sort();
  
  // Calculate statistics
  const stats = {
    total: 0,
    byType: {},
  };

  const filteredVacations = vacations.filter(vacation => {
    const vacationStartDate = new Date(vacation.gregStartDate);
    const vacationEndDate = new Date(vacation.gregEndDate);
    const yearMatch = (vacationStartDate.getFullYear() === selectedYear || vacationEndDate.getFullYear() === selectedYear);
    
    const monthMatch = selectedMonth === 'all' || (
      // Check if any day of the vacation falls within the selected month and year
      (vacationStartDate.getFullYear() === selectedYear && vacationStartDate.getMonth() === parseInt(selectedMonth)) ||
      (vacationEndDate.getFullYear() === selectedYear && vacationEndDate.getMonth() === parseInt(selectedMonth)) ||
      // Check if vacation spans over the selected month
      (vacationStartDate <= new Date(selectedYear, parseInt(selectedMonth), 1) && 
       vacationEndDate >= new Date(selectedYear, parseInt(selectedMonth) + 1, 0))
    );
    
    const typeMatch = selectedType === 'all' || vacation.type === selectedType;
    return yearMatch && monthMatch && typeMatch;
  });

  filteredVacations.forEach(vacation => {
    stats.byType[vacation.type] = (stats.byType[vacation.type] || 0) + 1;
    stats.total += 1;
  });

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return differenceInDays(end, start) + 1;
  };

  const calculateVacationHours = (days) => {
    return days * 8;
  };

  const calculateRemainingHours = (vacationHours) => {
    return MONTHLY_WORKING_HOURS - vacationHours;
  };

  const calculateOverdueHours = (days) => {
    return days * 2;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedVacations = () => {
    const sortedVacations = [...filteredVacations];
    if (sortConfig.key) {
      sortedVacations.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'duration') {
          aValue = calculateDuration(a.gregStartDate, a.gregEndDate);
          bValue = calculateDuration(b.gregStartDate, b.gregEndDate);
        } else if (sortConfig.key === 'vacationHours') {
          aValue = calculateVacationHours(calculateDuration(a.gregStartDate, a.gregEndDate));
          bValue = calculateVacationHours(calculateDuration(b.gregStartDate, b.gregEndDate));
        } else if (sortConfig.key === 'remainingHours') {
          const aVacHours = calculateVacationHours(calculateDuration(a.gregStartDate, a.gregEndDate));
          const bVacHours = calculateVacationHours(calculateDuration(b.gregStartDate, b.gregEndDate));
          aValue = calculateRemainingHours(aVacHours);
          bValue = calculateRemainingHours(bVacHours);
        } else if (sortConfig.key === 'overdueHours') {
          aValue = calculateOverdueHours(calculateDuration(a.gregStartDate, a.gregEndDate));
          bValue = calculateOverdueHours(calculateDuration(b.gregStartDate, b.gregEndDate));
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortedVacations;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="space-y-6 max-w-[98vw] mx-auto">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">السنة</label>
          <select
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الشهر</label>
          <select
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">الكل</option>
            {MONTHS.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع الإجازة</label>
          <select
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">الكل</option>
            {Object.keys(VACATION_TYPES).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">إجمالي الإجازات</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        {Object.entries(VACATION_TYPES).map(([type, { color, textColor }]) => (
          <div key={type} className={`${color} rounded-lg shadow p-4`}>
            <h3 className="text-lg font-semibold mb-2">{type}</h3>
            <p className={`text-3xl font-bold ${textColor}`}>{stats.byType[type] || 0}</p>
          </div>
        ))}
      </div>

      {/* Detailed Vacation List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">تفاصيل الإجازات</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  الموظف {getSortIcon('name')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('type')}
                >
                  نوع الإجازة {getSortIcon('type')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gregStartDate')}
                >
                  تاريخ البداية {getSortIcon('gregStartDate')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gregEndDate')}
                >
                  تاريخ النهاية {getSortIcon('gregEndDate')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('duration')}
                >
                  المدة {getSortIcon('duration')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('vacationHours')}
                >
                  ساعات الإجازة {getSortIcon('vacationHours')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('remainingHours')}
                >
                  الساعات المتبقية {getSortIcon('remainingHours')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('overdueHours')}
                >
                  ساعات التعويض {getSortIcon('overdueHours')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getSortedVacations().map((vacation, index) => {
                const duration = calculateDuration(vacation.gregStartDate, vacation.gregEndDate);
                const vacationHours = calculateVacationHours(duration);
                const remainingHours = calculateRemainingHours(vacationHours);
                const overdueHours = calculateOverdueHours(duration);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                      {vacation.name}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span className={`${VACATION_TYPES[vacation.type].color} ${VACATION_TYPES[vacation.type].textColor} px-2 py-1 rounded-full`}>
                        {VACATION_TYPES[vacation.type].letter}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {vacation.gregStartDate}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {vacation.gregEndDate}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {duration} يوم
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {vacationHours} ساعة
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {remainingHours} ساعة
                    </td>
                    <td className={`px-6 py-2 whitespace-nowrap text-sm ${overdueHours >= 6 ? 'text-red-500 font-semibold' : 'text-green-500'}`}>
                      {overdueHours} ساعة
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports; 