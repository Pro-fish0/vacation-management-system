import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VacationData from '../models/VacationData';
import { useVacations } from '../context/VacationContext';

function AddVacations() {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validData, setValidData] = useState([]);
  const { addVacations } = useVacations();
  const navigate = useNavigate();

  const handleDataPaste = (e) => {
    const data = e.target.value;
    const { errors, data: parsedData } = VacationData.parseInput(data);
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
      setSuccessMessage('');
      setValidData([]);
    } else {
      setError('');
      setSuccessMessage(`تم التحقق من ${parsedData.length} إجازة بنجاح`);
      setValidData(parsedData);
    }
  };

  const handleSave = () => {
    if (validData.length > 0) {
      const result = addVacations(validData);
      if (result.success) {
        setSuccessMessage(result.message + (result.duplicatesSkipped > 0 ? ` (تم تخطي ${result.duplicatesSkipped} إجازات مكررة)` : ''));
        // Clear the form
        setValidData([]);
        document.getElementById('vacationData').value = '';
        
        // Navigate to calendar view after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">إضافة إجازات</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vacationData">
          الصق بيانات الإجازات هنا
        </label>
        <div className="text-sm text-gray-600 mb-2">
          يمكنك إضافة البيانات بإحدى الطريقتين:
          <ol className="list-decimal list-inside mt-1 mr-4">
            <li>كل إجازة في سطر واحد مفصولة بفواصل (CSV)</li>
            <li>كل حقل في سطر منفصل (7 أسطر لكل إجازة)</li>
          </ol>
        </div>
        <textarea
          id="vacationData"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="10"
          onChange={handleDataPaste}
          dir="rtl"
          placeholder={`مثال الطريقة الأولى (CSV):
نوع الإجازة,رقم الموظف,اسم الموظف,تاريخ البداية هجري,تاريخ البداية ميلادي,تاريخ النهاية هجري,تاريخ النهاية ميلادي

مثال الطريقة الثانية (7 أسطر):
نوع الإجازة
رقم الموظف
اسم الموظف
تاريخ البداية هجري
تاريخ البداية ميلادي
تاريخ النهاية هجري
تاريخ النهاية ميلادي`}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">أخطاء في البيانات:</strong>
          <pre className="mt-2 text-sm whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {validData.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">ملخص الإجازات</h3>
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">نوع الإجازة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">رقم الموظف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">اسم الموظف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">تاريخ البداية</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">تاريخ النهاية</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validData.map((vacation, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vacation.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vacation.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vacation.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vacation.gregStartDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vacation.gregEndDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleSave}
          disabled={validData.length === 0}
        >
          حفظ الإجازات
        </button>
      </div>
    </div>
  );
}

export default AddVacations; 