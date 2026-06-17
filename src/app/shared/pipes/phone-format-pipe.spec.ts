import { PhoneFormatPipe } from './phone-format-pipe';

describe('PhoneFormatPipe', () => {
  let pipe: PhoneFormatPipe;

  beforeEach(() => {
    pipe = new PhoneFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string if value is null or undefined', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should format a valid phone number with country code', () => {
    const result = pipe.transform('+1 1234567890');
    expect(result).toBe('+1 (123) 456-7890');
  });

  it('should format another valid phone number with country code', () => {
    const result = pipe.transform('+91 9876543210');
    expect(result).toBe('+91 (987) 654-3210');
  });
});
