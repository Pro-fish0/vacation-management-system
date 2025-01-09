class VacationData {
  constructor(data) {
    const [
      type,
      employeeId,
      name,
      hijriStartDate,
      gregStartDate,
      hijriEndDate,
      gregEndDate
    ] = data;

    this.type = this.normalizeVacationType(type.trim());
    this.employeeId = employeeId.trim();
    this.name = name.trim();
    this.hijriStartDate = hijriStartDate.trim();
    this.gregStartDate = this.formatDate(gregStartDate.trim());
    this.hijriEndDate = hijriEndDate.trim();
    this.gregEndDate = this.formatDate(gregEndDate.trim());
  }

  normalizeVacationType(type) {
    // Map alternative names to standard types
    const typeMap = {
      'عادية': 'عادية',
      'عادية عن ايام غياب': 'عادية',
      'مرضية': 'مرضية',
      'مرافقة': 'مرضية',
      'مرافق': 'مرضية',
      'تعويضية': 'تعويضية'
    };
    return typeMap[type] || type;
  }

  formatDate(date) {
    // If date is in YYYY/MM/DD format, convert to MM/DD/YYYY
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(date)) {
      const [year, month, day] = date.split('/');
      return `${month}/${day}/${year}`;
    }
    return date;
  }

  static validateFields(fields) {
    if (fields.length !== 7) {
      return 'عدد الحقول غير صحيح';
    }

    const [type, employeeId, name, hijriStartDate, gregStartDate, hijriEndDate, gregEndDate] = fields.map(f => f.trim());

    // Validate vacation type with alternative names
    const validTypes = [
      'عادية',
      'عادية عن ايام غياب',
      'مرضية',
      'مرافقة',
      'مرافق',
      'تعويضية'
    ];

    if (!validTypes.includes(type)) {
      return 'نوع الإجازة غير صحيح';
    }

    // Validate employee ID
    if (!/^\d+$/.test(employeeId)) {
      return 'رقم الموظف غير صحيح';
    }

    // Validate dates format
    const hijriDateRegex = /^144\d\/\d{2}\/\d{2}$/;
    const gregDateRegex = /^(\d{4}\/\d{2}\/\d{2}|\d{1,2}\/\d{1,2}\/\d{4})$/;

    if (!hijriDateRegex.test(hijriStartDate) || !hijriDateRegex.test(hijriEndDate)) {
      return 'صيغة التاريخ الهجري غير صحيحة';
    }

    if (!gregDateRegex.test(gregStartDate) || !gregDateRegex.test(gregEndDate)) {
      return 'صيغة لتاريخ الميلادي غير صحيحة';
    }

    return null;
  }

  static parseInput(input) {
    // Remove any BOM characters and trim
    input = input.replace(/^\ufeff/, '').trim();
    
    // Split input into lines and filter out empty lines
    const lines = input.split(/\r?\n/).filter(line => line.trim());
    
    const errors = [];
    const validData = [];
    
    // Check if input is CSV format (all data in one line separated by commas)
    const isCSV = lines.some(line => line.includes(','));
    
    if (isCSV) {
      // Process as CSV
      lines.forEach((line, index) => {
        const fields = line.split(',');
        const error = this.validateFields(fields);
        
        if (error) {
          errors.push(`سطر ${index + 1}: ${error}`);
        } else {
          validData.push(new VacationData(fields));
        }
      });
    } else {
      // Process as line-by-line format (7 lines per record)
      for (let i = 0; i < lines.length; i += 7) {
        if (i + 6 >= lines.length) {
          errors.push(`بيانات غير مكتملة عند السطر ${i + 1}`);
          break;
        }

        const fields = lines.slice(i, i + 7);
        const error = this.validateFields(fields);

        if (error) {
          errors.push(`مجموعة البيانات رقم ${Math.floor(i / 7) + 1}: ${error}`);
        } else {
          validData.push(new VacationData(fields));
        }
      }
    }

    return {
      errors,
      data: validData
    };
  }
}

export default VacationData; 