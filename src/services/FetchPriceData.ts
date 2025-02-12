import axios, { AxiosResponse } from "axios";
import { Day } from "../models/PriceDataParams";

async function fetchData<T>(
  endpoint: string,
  params?: Record<string, unknown>
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.get(endpoint, {
      params,
    });
    // console.log(response.data);
    return response.data; // Now this will work correctly
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "An error occurred");
    }
    throw new Error("Unexpected error fetching data");
  }
}

//filter price data based on the start/end date -- mainly used for the spot price graph to filter out straggler data, whose date and startDate do NOT match
async function filterPriceData(priceData: Day[], filter: Date) {
  try {
    const filteredPriceData = priceData.filter((day: Day) => {
      console.log(day.date, filter);
      if (new Date(day.date) >= filter) {
        return day;
      }
    });

    return filteredPriceData;
  } catch (error) {
    console.error(error);
  }
}

async function getPriceData(startDate: Date, endDate: Date) {
  try {
    const params = {
      startDate: startDate,
      endDate: endDate,
    };

    const priceData = await fetchData<Day[]>(
      process.env.REACT_APP_BACKEND_API_BASE_URL + "GetPricesForPeriod",
      params
    );

    const filteredPriceData = await filterPriceData(priceData, startDate);
    return filteredPriceData;
  } catch (error) {
    console.error(error);
  }
}

export { fetchData, filterPriceData, getPriceData };
