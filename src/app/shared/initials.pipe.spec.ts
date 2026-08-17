import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
  let pipe: InitialsPipe;

  beforeEach(() => {
    pipe = new InitialsPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for empty or falsy inputs', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as unknown as string)).toBe('');
    expect(pipe.transform(undefined as unknown as string)).toBe('');
  });

  it('should transform full name "Tiger Woods" to "TW"', () => {
    expect(pipe.transform('Tiger Woods')).toBe('TW');
  });

  it('should transform single name "Arnold" to "A"', () => {
    expect(pipe.transform('Arnold')).toBe('A');
  });

  it('should transform three words "Jack William Nicklaus" to "JWN"', () => {
    expect(pipe.transform('Jack William Nicklaus')).toBe('JWN');
  });
});
