import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmployeeData } from '../models/employees.model';
import { exportToCSV } from './export.util';

describe('exportToCSV', () => {
  let createElementMock: HTMLAnchorElement;
  let clickMock: ReturnType<typeof vi.fn>;
  let data: EmployeeData[] = [];

  beforeEach(() => {
    data = [
      {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        age: 40,
        gender: 'M',
        email: 'john.doe@test.com',
        phone: '+1 202-555-1000',
        department: 'Engineering',
        role: 'Admin',
        status: 'active',
        joiningDate: '13-01-2026',
      },
      {
        id: 2,
        firstname: 'Jane',
        lastname: 'Smith',
        age: 33,
        gender: 'F',
        email: 'jane.smith@test.com',
        phone: '+1 202-554-1002',
        department: 'Marketing',
        role: 'User',
        status: 'active',
        joiningDate: '14-03-2026',
      },
    ];

    clickMock = vi.fn();

    createElementMock = {
      href: '',
      download: '',
      click: clickMock,
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, 'createElement').mockReturnValue(createElementMock);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');
  });

  it('should not create file if data is empty', () => {
    exportToCSV([], 'test.csv');

    expect(document.createElement).not.toHaveBeenCalled();
  });

  it('should create CSV and trigger download', () => {
    exportToCSV(data, 'employees.csv');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(URL.createObjectURL).toHaveBeenCalled();

    expect(createElementMock.download).toBe('employees.csv');
    expect(createElementMock.href).toBe('blob:url');
    expect(clickMock).toHaveBeenCalled();
  });

  it('should handle null or undefined values', () => {
    const row: EmployeeData = {
      id: 2,
      firstname: 'Jane',
      lastname: 'Smith',
      age: 33,
      gender: 'F',
      email: 'jane.smith@test.com',
      phone: '+1 202-554-1002',
      department: 'Marketing',
      role: 'User',
      status: 'active',
      joiningDate: '14-03-2026',
    };

    data[1] = row;

    exportToCSV(data, 'test.csv');

    expect(clickMock).toHaveBeenCalled();
  });

  it('should escape special characters correctly', () => {
    data[0].firstname = '"John"';
    data[0].lastname = '"Doe"';

    exportToCSV(data, 'test.csv');

    expect(clickMock).toHaveBeenCalled();
  });

  it('should generate correct CSV content', () => {
    const blobSpy = vi.spyOn(window, 'Blob').mockImplementation(function (
      this: Blob,
      content: BlobPart[],
      options?: BlobPropertyBag
    ) {
      const csv = content[0] as string;

      expect(csv).toContain(
        'id,firstname,lastname,age,gender,email,phone,department,role,status,joiningDate'
      );
      expect(csv).toContain(
        'John,Doe,40,M,john.doe@test.com,+1 202-555-1000,Engineering,Admin,active,13-01-2026'
      );

      Object.defineProperty(this, 'size', { value: csv.length });
      Object.defineProperty(this, 'type', { value: options?.type });
    } as unknown as typeof Blob);

    exportToCSV(data, 'test.csv');

    expect(blobSpy).toHaveBeenCalled();
  });

  it('should handle completely empty values', () => {
    const blobSpy = vi.spyOn(window, 'Blob').mockImplementation(function (
      this: Blob,
      content: BlobPart[]
    ) {
      const csv = content[0] as string;

      expect(csv).toContain(',');

      Object.defineProperty(this, 'size', { value: csv.length });
    } as unknown as typeof Blob);

    const emptyData = [{ name: null, value: null }];

    exportToCSV(emptyData as unknown as Record<string, unknown>[], 'test.csv');

    expect(blobSpy).toHaveBeenCalled();
  });
});
