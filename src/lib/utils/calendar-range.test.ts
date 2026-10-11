import { describe, expect, it } from "vitest";
import { getCalendarRangeWindow, parseCalendarRange } from "./calendar-range";

describe("calendar range", () => {
  const reference = new Date("2026-10-14T15:30:00Z");

  it("defaults unknown values to the current day", () => {
    // Arrange / Act / Assert
    expect(parseCalendarRange(null)).toBe("day");
    expect(parseCalendarRange("unknown")).toBe("day");
  });

  it("accepts week and month values", () => {
    // Arrange / Act / Assert
    expect(parseCalendarRange("week")).toBe("week");
    expect(parseCalendarRange("month")).toBe("month");
  });

  it("returns the current day window", () => {
    // Arrange / Act
    const window = getCalendarRangeWindow("day", reference);

    // Assert
    expect(window).toEqual({ timeMin: "2026-10-14T00:00:00.000Z", timeMax: "2026-10-15T00:00:00.000Z" });
  });

  it("returns a Monday-to-Monday week window", () => {
    // Arrange / Act
    const window = getCalendarRangeWindow("week", reference);

    // Assert
    expect(window).toEqual({ timeMin: "2026-10-12T00:00:00.000Z", timeMax: "2026-10-19T00:00:00.000Z" });
  });

  it("returns the first day of the month through the next month", () => {
    // Arrange / Act
    const window = getCalendarRangeWindow("month", reference);

    // Assert
    expect(window).toEqual({ timeMin: "2026-10-01T00:00:00.000Z", timeMax: "2026-11-01T00:00:00.000Z" });
  });
});
