import { User } from './user.model';

describe('User Model', () => {
  const futureDate = new Date(Date.now() + 3600 * 1000);
  const pastDate = new Date(Date.now() - 3600 * 1000);

  it('should initialize user properties correctly', () => {
    const user = new User(
      1,
      'golfer1',
      'golfer@example.com',
      'John Golfer',
      false,
      true,
      true,
      false,
      false,
      'valid-token',
      futureDate,
    );

    expect(user.id).toBe(1);
    expect(user.username).toBe('golfer1');
    expect(user.email).toBe('golfer@example.com');
    expect(user.name).toBe('John Golfer');
    expect(user.disabled).toBeFalse();
    expect(user.is_admin).toBeTrue();
    expect(user.edit_flights).toBeTrue();
    expect(user.edit_tournaments).toBeFalse();
    expect(user.edit_payments).toBeFalse();
  });

  it('should return token when expiration date is in the future', () => {
    const user = new User(
      1,
      'golfer1',
      'golfer@example.com',
      'John Golfer',
      false,
      false,
      false,
      false,
      false,
      'secret-token-123',
      futureDate,
    );

    expect(user.token).toBe('secret-token-123');
  });

  it('should return null when token is expired', () => {
    const user = new User(
      1,
      'golfer1',
      'golfer@example.com',
      'John Golfer',
      false,
      false,
      false,
      false,
      false,
      'secret-token-123',
      pastDate,
    );

    expect(user.token).toBeNull();
  });

  it('should return null when expiration date is null or invalid', () => {
    const user = new User(
      1,
      'golfer1',
      'golfer@example.com',
      'John Golfer',
      false,
      false,
      false,
      false,
      false,
      'secret-token-123',
      null as any,
    );

    expect(user.token).toBeNull();
  });
});
