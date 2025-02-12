import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getPriceData } from "../services/FetchPriceData";
import { Day } from "../models/PriceDataParams";

import "../styles/ButtonGroup.css"; // Import the CSS file
import { isAfter } from "date-fns";

type TimePeriod = "day" | "currentWeek" | "month";

const PriceChart: React.FC = () => {
  const [priceData, setPriceData] = useState<Day[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("day");
  const { t, i18n } = useTranslation(); //change date names to Finnish or English based on the language selected
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDateRange = (
    period: TimePeriod,
    date: Date
  ): { startDate: Date; endDate: Date } => {
    const startDate = new Date(date);
    const endDate = new Date(date);

    switch (period) {
      case "day":
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);

        endDate.setHours(23, 59, 59, 999);
        break;
      case "currentWeek":
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        endDate.setHours(23, 59, 59, 999);
        break;
      case "month":
        startDate.setMonth(endDate.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);

        endDate.setMonth(endDate.getMonth());
        endDate.setHours(23, 59, 59, 999);

        break;
    }
    return { startDate, endDate };
  };

  const calculateAveragePrice = (data: Day[]): string => {
    if (!data.length) return "N/A";
    const sum = data.reduce((acc, day) => acc + day.value, 0);
    return Number((sum / data.length).toFixed(2)).toString();
  };

  const getCurrentPrice = (): string => {
    if (!priceData.length) return "N/A";
    const currentHour = new Date().getHours();
    const todayData = priceData.find((day) => {
      const dayHour = new Date(day.date).getHours();
      const currentDay = new Date().getDate();
      console.log(
        currentHour,
        dayHour,
        currentDay,
        new Date(day.date).getDate()
      );
      return (
        dayHour === currentHour && currentDay === new Date(day.date).getDate()
      );
    });
    return todayData ? Number(todayData.value.toFixed(2)).toString() : "N/A";
  };

  const getPriceInfo = (): { label: string; value: string } => {
    switch (selectedPeriod) {
      case "day":
        return { label: t("CurDayPriceSpot"), value: getCurrentPrice() };
      case "currentWeek":
      case "month":
        return {
          label: t("AvgPriceSpot"),
          value: calculateAveragePrice(priceData),
        };
    }
  };

  //format the date and time for the x-axis and tooltip -- default is hard to read and won't fit
  const formatDateTime = (dateString: string, isTooltip: boolean): string => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    //find the earliest time for the day
    const currentDay = date.getDate();
    const currentYear = date.getFullYear(); //without this, the year could be last year
    const earliestTimeForDay = priceData.find(
      (item) =>
        new Date(item.date).getDate() === currentDay &&
        new Date(item.date).getFullYear() === currentYear
    );

    const firstDate = priceData[0].date;
    //tooltip needs to show different format than x-axis
    if (isTooltip) {
      return `${day}.${month} ${hours}:${minutes}`;
    }

    //if the date is the earliest for the day, show the month and day
    if (earliestTimeForDay?.date === dateString) {
      //for small screens, only show the date for every 6th day
      if (
        screenWidth < 1366 &&
        selectedPeriod === "month" &&
        Number(day) % 6 !== 0 &&
        dateString !== firstDate
      ) {
        return "";
      }
      return `${date.toLocaleString(i18n.language, { month: "short" })} ${day}`;
    }

    //if the selected period is not month and the time interval is 6 hours, show the time
    if (selectedPeriod !== "month" && Number(hours) % 6 === 0) {
      //even small screens can handle displaying the time for day
      if (screenWidth > 768 || selectedPeriod === "day") {
        if (screenWidth <= 1024 && Number(hours) % 12 !== 0) {
          return "";
        }
        return `${hours}:${minutes}`;
      }
    }
    return "";
  };

  const fetchPriceData = async (period: TimePeriod, date: Date) => {
    try {
      const { startDate, endDate } = getDateRange(period, date);
      const data = await getPriceData(startDate, endDate);
      if (data) {
        console.log(data);
        setPriceData(data);
      }
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  useEffect(() => {
    fetchPriceData(selectedPeriod, currentDate);
  }, [selectedPeriod, currentDate]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (selectedPeriod) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "currentWeek":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (selectedPeriod) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "currentWeek":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const priceInfo = getPriceInfo();

  // Calculate the minimum and maximum values from the data
  const minValue = Math.min(...priceData.map((d) => d.value));
  const maxValue = Math.max(...priceData.map((d) => d.value));

  return (
    <Container className="form-container">
      <div className="flex flex-col gap-4">
        <div className="button-group button">
          <button
            className={`btn-service btn ${
              selectedPeriod === "day" ? "btn-dark" : "btn-secondary"
            }`}
            onClick={() => setSelectedPeriod("day")}
          >
            {t("DayOptionSpot")}
          </button>
          <button
            className={`btn-service  btn ${
              selectedPeriod === "currentWeek" ? "btn-dark" : "btn-secondary"
            }`}
            onClick={() => setSelectedPeriod("currentWeek")}
          >
            {t("WeekOptionSpot")}
          </button>
          <button
            className={`btn-service btn ${
              selectedPeriod === "month" ? "btn-dark" : "btn-secondary"
            }`}
            onClick={() => setSelectedPeriod("month")}
          >
            {t("MonthOptionSpot")}
          </button>
        </div>

        <div className="bg-gray-100 p-3 rounded shadow text-center button-margin">
          <p style={{ fontSize: "1.3rem", margin: "auto" }}>
            {priceInfo.label}:{" "}
            <span className="font-bold">{priceInfo.value} c/kWh</span>
          </p>
        </div>

        <div className="button-group button-margin">
          <button
            className="btn-service btn btn-secondary"
            onClick={handlePrevious}
          >
            {t("PreviousSpot")}
          </button>
          {!isToday(currentDate) && !isAfter(currentDate, new Date()) && (
            <button
              className="btn-service btn btn-secondary"
              onClick={handleNext}
            >
              {t("NextSpot")}
            </button>
          )}
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={priceData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={(dateString) => formatDateTime(dateString, false)}
              angle={-45}
              textAnchor="end"
              tickLine={false}
              interval={0}
            />
            <YAxis domain={[Math.floor(minValue), Math.ceil(maxValue)]} />
            <Tooltip
              labelFormatter={(dateString) => formatDateTime(dateString, true)}
            />
            <Bar dataKey="value" name={t("ToolTipPrice")}>
              {priceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value >= 12 ? "#ff0000" : "#00ff00"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default PriceChart;
