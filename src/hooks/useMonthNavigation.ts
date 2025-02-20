import { useState } from "react";
import { CalculationResult } from "@/models/FormTypes";

interface MonthNavigationProps {
  result: CalculationResult | null;
  maxItems: number;
  isMobile: boolean;
}

export const useMonthNavigation = ({
  result,
  maxItems,
  isMobile,
}: MonthNavigationProps) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const handlePrevMonthPeriod = () => {
    const step = maxItems;
    if (result?.MonthlyData && currentMonthIndex - step >= 0) {
      setCurrentMonthIndex(currentMonthIndex - step);
    }
  };

  const handleNextMonthPeriod = () => {
    const step = maxItems;
    if (
      result?.MonthlyData &&
      currentMonthIndex + step < result.MonthlyData.length
    ) {
      setCurrentMonthIndex(currentMonthIndex + step);
    }
  };

  const getVisibleMonths = () => {
    let months = result?.MonthlyData?.filter((data) =>
      isMobile ? true : data.Month === currentMonthIndex
    );

    if (isMobile) {
      months = months?.slice(currentMonthIndex, currentMonthIndex + maxItems);
    } else {
      months = months?.slice(0, maxItems);
    }

    return months;
  };

  return {
    currentMonthIndex,
    handlePrevMonthPeriod,
    handleNextMonthPeriod,
    getVisibleMonths,
  };
};
