import * as chrono from '#🪕/chrono';
import { describe, expect, it } from 'vitest';

describe('chrono (module)', () => {
  it('creation functions', () => {
    let chron: chrono.Chrono = chrono.from('0 milliseconds');
    expect(`${chron}`).toBe('0 milliseconds');
    expect(+chron).toBe(0);

    chron = chrono.milliseconds(123456);
    expect(`${chron}`).toBe('123456 milliseconds');
    expect(+chron).toBe(123456);

    chron = chrono.seconds(234567);
    expect(`${chron}`).toBe('234567 seconds');
    expect(+chron).toBe(234567);

    chron = chrono.minutes(345678);
    expect(`${chron}`).toBe('345678 minutes');
    expect(+chron).toBe(345678);

    chron = chrono.hours(456789);
    expect(`${chron}`).toBe('456789 hours');
    expect(+chron).toBe(456789);

    chron = chrono.days(567890);
    expect(`${chron}`).toBe('567890 days');
    expect(+chron).toBe(567890);
  });

  it('instance conversion functions', () => {
    // NOTE: upwards conversions (eg milliseconds -> days) can lose precision due to floating point arithmetic
    let chron: chrono.Chrono = chrono.from('123456 milliseconds');
    expect(`${chron}`).toBe('123456 milliseconds');
    expect(+chron).toBe(123456);

    chron = chron.as('seconds');
    expect(`${chron}`).toBe('123.456 seconds');
    expect(+chron).toBe(123.456);

    chron = chron.as('minutes');
    expect(`${chron}`).toBe('2.0576 minutes');
    expect(+chron).toBe(2.0576);

    chron = chron.as('hours');
    expect(`${chron}`).toBe('0.03429333333333333 hours');
    expect(+chron).toBe(0.03429333333333333);

    chron = chron.as('days');
    expect(`${chron}`).toBe('0.0014288888888888886 days');
    expect(+chron).toBe(0.0014288888888888886);

    chron = chron.as('milliseconds');
    expect(`${chron}`).toBe('123455.99999999997 milliseconds');
    expect(+chron).toBe(123455.99999999997);
  });
});
