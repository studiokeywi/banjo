/**
 * A helper format to make it easier to translate different resolutions of time (such as milliseconds, minutes, and days) across `banjo` functions
 *
 * @module chrono
 * @author studioKeywi */

/**
 * Internal object that contains conversion factors
 *
 * @internal */
const conversions = {
  /** Factors for converting milliseconds to other resolutions */
  milliseconds: {
    /** To convert milliseconds to milliseconds, multiply by this */
    milliseconds: 1,
    /** To convert milliseconds to seconds, multiply by this */
    seconds: 0.001,
    /** To convert milliseconds to minutes, multiply by this */
    minutes: 0.000_016_666_666_666_666_667,
    /** To convert milliseconds to hours, multiply by this */
    hours: 2.777_777_777_777_777_6e-7,
    /** To convert milliseconds to days, multiply by this */
    days: 1.157_407_407_407_407_4e-8,
  },
  /** Factors for converting seconds to other resolutions */
  seconds: {
    /** To convert seconds to milliseconds, multiply by this */
    milliseconds: 1000,
    /** To convert seconds to seconds, multiply by this */
    seconds: 1,
    /** To convert seconds to minutes, multiply by this */
    minutes: 0.016_666_666_666_666_666,
    /** To convert seconds to hours, multiply by this */
    hours: 0.000_277_777_777_777_777_8,
    /** To convert seconds to days, multiply by this */
    days: 0.000_011_574_074_074_074_073,
  },
  /** Factors for converting minutes to other resolutions */
  minutes: {
    /** To convert minutes to milliseconds, multiply by this */
    milliseconds: 60_000,
    /** To convert minutes to seconds, multiply by this */
    seconds: 60,
    /** To convert minutes to minutes, multiply by this */
    minutes: 1,
    /** To convert minutes to hours, multiply by this */
    hours: 0.016_666_666_666_666_666,
    /** To convert minutes to days, multiply by this */
    days: 0.000_694_444_444_444_444_5,
  },
  /** Factors for converting hours to other resolutions */
  hours: {
    /** To convert hours to milliseconds, multiply by this */
    milliseconds: 3_600_000,
    /** To convert hours to seconds, multiply by this */
    seconds: 3_600,
    /** To convert hours to minutes, multiply by this */
    minutes: 60,
    /** To convert hours to hours, multiply by this */
    hours: 1,
    /** To convert hours to days, multiply by this */
    days: 0.041_666_666_666_666_664,
  },
  /** Factors for converting days to other resolutions */
  days: {
    /** To convert days to milliseconds, multiply by this */
    milliseconds: 86_400_000,
    /** To convert days to seconds, multiply by this */
    seconds: 86_400,
    /** To convert days to minutes, multiply by this */
    minutes: 1_440,
    /** To convert days to hours, multiply by this */
    hours: 24,
    /** To convert days to days, multiply by this */
    days: 1,
  },
} as const;

/**
 * Creates a new {@link Chrono} from a human-friendly string
 *
 * @template {number} Value
 * @template {Units} Unit
 * @param {`${Value} ${Unit}`} chronoStr
 * @returns {NewChron<Unit, Value>} */
export const from = <const Value extends number, const Unit extends Units>(chronoStr: `${Value} ${Unit}`): Chrono<Unit, Value> => {
  const split = chronoStr.split(' ');
  const value = +split[0] as Value;
  const unit = split[1] as Unit;
  const { milliseconds, seconds, minutes, hours, days } = conversions[unit];
  const chrono = Object.defineProperties({} as Chrono<Unit, Value>, {
    milliseconds: { enumerable: true, value: value * milliseconds },
    seconds: { enumerable: true, value: value * seconds },
    minutes: { enumerable: true, value: value * minutes },
    hours: { enumerable: true, value: value * hours },
    days: { enumerable: true, value: value * days },
    as: { enumerable: true, value: (as: Units) => from(`${chrono[as]} ${as}`) },
    toString: { enumerable: true, value: () => chronoStr },
    valueOf: { enumerable: true, value: () => value },
  });
  return chrono;
};

/**
 * Creates a new {@link Chrono} with millisecond resolution
 *
 * @template {number} Value
 * @param {Value} value
 * @returns {NewChron<'milliseconds', Value>} */
export const milliseconds = <const Value extends number>(value: Value): Chrono<'milliseconds', Value> => from<Value, 'milliseconds'>(`${value} milliseconds`);

/**
 * Creates a new {@link Chrono} with second resolution
 *
 * @template {number} Value
 * @param {Value} value
 * @returns {NewChron<'seconds', Value>} */
export const seconds = <const Value extends number>(value: Value): Chrono<'seconds', Value> => from<Value, 'seconds'>(`${value} seconds`);

/**
 * Creates a new {@link Chrono} with minute resolution
 *
 * @template {number} Value
 * @param {Value} value
 * @returns {NewChron<'minutes', Value>} */
export const minutes = <const Value extends number>(value: Value): Chrono<'minutes', Value> => from<Value, 'minutes'>(`${value} minutes`);

/**
 * Creates a new {@link Chrono} with hour resolution
 *
 * @template {number} Value
 * @param {Value} value
 * @returns {NewChron<'hours', Value>} */
export const hours = <const Value extends number>(value: Value): Chrono<'hours', Value> => from<Value, 'hours'>(`${value} hours`);

/**
 * Creates a new {@link Chrono} with day resolution
 *
 * @template {number} Value
 * @param {Value} value
 * @returns {NewChron<'days', Value>} */
export const days = <const Value extends number>(value: Value): Chrono<'days', Value> => from<Value, 'days'>(`${value} days`);

/**
 * A Chrono object blends human-friendly strings with known values and pre-calculated conversions to make working with multi-resolution durations easier
 */
export interface Chrono<Unit extends Units = Units, Value extends number = number> {
  /**
   * The equivalent duration of this Chrono object in milliseconds
   */
  readonly milliseconds: Unit extends 'milliseconds' ? Value : number;
  /**
   * The equivalent duration of this Chrono object in seconds
   */
  readonly seconds: Unit extends 'seconds' ? Value : number;
  /**
   * The equivalent duration of this Chrono object in minutes
   */
  readonly minutes: Unit extends 'minutes' ? Value : number;
  /**
   * The equivalent duration of this Chrono object in hours
   */
  readonly hours: Unit extends 'hours' ? Value : number;
  /**
   * The equivalent duration of this Chrono object in days
   */
  readonly days: Unit extends 'days' ? Value : number;
  /** Casts this Chrono object into a new base unit. Note that downwards conversions (eg hours -> seconds) can lose precision from
   * floating point errors. Additionally, for TypeScript, conversions lose the `Value` type specificity.
   *
   * @template {Units} As
   * @param {As} as
   * @returns {Chrono<As>} */
  as<As extends Units>(as: As): Chrono<As>;
  /**
   * Human friendly time string
   *
   * @returns {`${Value} ${Unit}`} */
  toString(): `${Value} ${Unit}`;
  /**
   * Numeric value
   *
   * @returns {Value} */
  valueOf(): Value;
}
/**
 * Valid time resolutions
 */
export type Units = 'days' | 'hours' | 'minutes' | 'milliseconds' | 'seconds';
