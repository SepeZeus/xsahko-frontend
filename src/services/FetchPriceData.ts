import axios, { AxiosResponse } from "axios";
import { Day } from "@/models/PriceDataParams";

const CACHE_KEY = "priceData";
const CACHE_TIMESTAMP_KEY = "priceDataTimestamp";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const FETCH_PERIOD = 90; // Days to fetch

function getCachedDateRange(
  data: Day[]
): { earliest: Date; latest: Date } | null {
  if (!data || data.length === 0) return null;

  const dates = data.map((day) => new Date(day.date));
  return {
    earliest: new Date(Math.min(...dates.map((d) => d.getTime()))),
    latest: new Date(Math.max(...dates.map((d) => d.getTime()))),
  };
}

async function fetchData<T>(
  endpoint: string,
  params?: Record<string, unknown>
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.get(endpoint, {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "An error occurred");
    }
    throw new Error("Unexpected error fetching data");
  }
}

function getCachedData(): { data: Day[] | null; timestamp: number } {
  const cachedData = localStorage.getItem(CACHE_KEY);
  const timestamp = Number(localStorage.getItem(CACHE_TIMESTAMP_KEY)) || 0;
  return {
    data: cachedData ? JSON.parse(cachedData) : null,
    timestamp,
  };
}

function setCachedData(data: Day[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
}

async function fetchFreshData(): Promise<Day[]> {
  const endDate = new Date();
  const startDate = new Date();

  endDate.setUTCHours(24, 0, 0, 0);
  startDate.setDate(startDate.getDate() - FETCH_PERIOD);
  startDate.setUTCHours(0, 0, 0, 0);

  const params = {
    startDate,
    endDate,
  };

  console.log("Fetching fresh data for range:", { startDate, endDate });

  const priceData = await fetchData<Day[]>(
    import.meta.env.VITE_REACT_APP_BACKEND_API_BASE_URL + "GetPricesForPeriod",
    params
  );

  console.log(priceData);
  if (!priceData || priceData.length === 0) {
    throw new Error("No price data received from API");
  }

  setCachedData(priceData);
  return priceData;
}

function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startDay = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const endDay = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  return dateDay >= startDay && dateDay <= endDay;
}

// Update aggregateByDay function to use date instead of EndDate
function aggregateByDay(data: Day[]): Day[] {
  const dailyGroups = data.reduce((groups: { [key: string]: Day[] }, item) => {
    const date = new Date(item.date);
    const dayKey = date.toISOString().split("T")[0];

    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(item);
    return groups;
  }, {});

  return Object.entries(dailyGroups).map(([dateStr, dayItems]) => {
    const avgValue =
      dayItems.reduce((sum, item) => sum + item.value, 0) / dayItems.length;
    const midDay = new Date(dateStr);
    midDay.setHours(12, 0, 0, 0); // Set to noon for consistent display

    return {
      date: midDay.toISOString(),
      value: Number(avgValue.toFixed(2)),
      EndDate: dayItems[dayItems.length - 1].EndDate,
      Id: dayItems[0].Id,
      CreatedAt: dayItems[0].CreatedAt,
      UpdatedAt: dayItems[0].UpdatedAt,
    };
  });
}

// Update aggregateByWeek function
function aggregateByWeek(data: Day[]): Day[] {
  const weekGroups = data.reduce((groups: { [key: string]: Day[] }, item) => {
    const date = new Date(item.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!groups[weekKey]) {
      groups[weekKey] = [];
    }
    groups[weekKey].push(item);
    return groups;
  }, {});

  return Object.entries(weekGroups).map(([dateStr, weekItems]) => {
    const avgValue =
      weekItems.reduce((sum, item) => sum + item.value, 0) / weekItems.length;
    const weekStart = new Date(dateStr);
    weekStart.setHours(12, 0, 0, 0); // Set to noon for consistent display

    return {
      date: weekStart.toISOString(),
      value: Number(avgValue.toFixed(2)),
      EndDate: weekItems[weekItems.length - 1].EndDate,
      Id: weekItems[0].Id,
      CreatedAt: weekItems[0].CreatedAt,
      UpdatedAt: weekItems[0].UpdatedAt,
    };
  });
}

// Update getPriceData function to handle partial day data
async function getPriceData(
  startDate: Date,
  endDate: Date,
  period: "day" | "currentWeek" | "month" = "day"
): Promise<Day[]> {
  try {
    const { data: cachedData, timestamp } = getCachedData();
    const now = Date.now();

    let data: Day[];

    console.log(startDate, endDate);
    if (!cachedData || now - timestamp > CACHE_DURATION) {
      console.log("No cache or cache expired, fetching fresh data");
      data = await fetchFreshData();
      console.log(data);
    } else {
      const cachedRange = getCachedDateRange(cachedData);
      if (!cachedRange) {
        console.log("Invalid cached data, fetching fresh data");
        data = await fetchFreshData();
      } else {
        // Adjust endDate to the latest available data time if needed
        const latestDataTime = new Date(cachedRange.latest);
        const adjustedEndDate =
          endDate > latestDataTime ? latestDataTime : endDate;

        const requestedStartInCache = isDateInRange(
          startDate,
          cachedRange.earliest,
          cachedRange.latest
        );
        const requestedEndInCache = isDateInRange(
          adjustedEndDate,
          cachedRange.earliest,
          cachedRange.latest
        );

        if (!requestedStartInCache || !requestedEndInCache) {
          console.log("Requested date range not in cache, fetching fresh data");
          data = await fetchFreshData();
        } else {
          console.log("Using cached data");
          data = cachedData;
        }
      }
    }

    // Filter data to requested range, using adjusted endDate if necessary
    const filteredData = filterPriceDataByRange(data, startDate, endDate);

    // Aggregate data based on period
    switch (period) {
      case "currentWeek":
        return aggregateByDay(filteredData);
      case "month":
        return aggregateByWeek(filteredData);
      default:
        return filteredData;
    }
  } catch (error) {
    console.error("Error in getPriceData:", error);
    throw error;
  }
}

function filterPriceDataByRange(
  data: Day[],
  startDate: Date,
  endDate: Date
): Day[] {
  return data.filter((day: Day) => {
    const dayDate = new Date(day.date);
    return dayDate >= startDate && dayDate <= endDate;
  });
}

// Keep this for backward compatibility
async function filterPriceData(priceData: Day[], filter: Date): Promise<Day[]> {
  try {
    return priceData.filter((day: Day) => new Date(day.date) >= filter);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { fetchData, filterPriceData, getPriceData };
