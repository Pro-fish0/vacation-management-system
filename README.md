# نظام إدارة الإجازات | Vacation Management System

نظام إدارة الإجازات هو تطبيق ويب يساعد في تنظيم وتتبع إجازات الموظفين.

## المميزات | Features

- عرض تقويمي للإجازات
- إضافة إجازات عن طريق CSV
- تقارير وإحصائيات
- واجهة مستخدم عربية
- تصميم متجاوب

## المتطلبات | Requirements

- Node.js (v14 أو أحدث)
- npm (v6 أو أحدث)

## التثبيت | Installation

1. استنسخ المستودع | Clone the repository
```bash
git clone [repository-url]
cd vacation-management-system
```

2. ثبت المتطلبات | Install dependencies
```bash
npm install
```

3. شغل التطبيق | Run the application
```bash
npm run dev
```

## الاستخدام | Usage

### عرض التقويم | Calendar View
- عرض شهري للإجازات
- تصفية حسب الموظف أو القسم
- تمييز أنواع الإجازات بألوان مختلفة

### إضافة إجازات | Add Vacations
- لصق بيانات CSV
- تنسيق البيانات المطلوب:
```
Type,EmployeeID,Name,StartDate,EndDate
مرضية,100112,مها معيض عواض الزهراني,1446/07/03,1446/07/03
عادية,100001,أحمد محمد أحمد العماري,1446/07/06,1446/07/06
```

### التقارير | Reports
- إحصائيات سنوية
- توزيع أنواع الإجازات
- تقارير الموظفين

## المساهمة | Contributing

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:
1. انشئ fork للمشروع
2. أنشئ فرع للميزة الجديدة
3. قم بعمل commit للتغييرات
4. ادفع التغييرات إلى الفرع
5. افتح طلب سحب

## الترخيص | License

[MIT License](LICENSE)