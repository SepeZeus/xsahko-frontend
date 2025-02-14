import React from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { Form, Button } from "react-bootstrap";
import { CalculationResult } from "../models/FormTypes";

interface ConsumptionChartProps {
  result: CalculationResult;
  showSpotPrice: boolean;
  showFixedPrice: boolean;
  showConsumption: boolean;
  setShowSpotPrice: (show: boolean) => void;
  setShowFixedPrice: (show: boolean) => void;
  setShowConsumption: (show: boolean) => void;
  isMobile: boolean;
  months: any[];
  currentMonthIndex: number;
  handlePrevMonthPeriod: () => void;
  handleNextMonthPeriod: () => void;
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({
  result,
  showSpotPrice,
  showFixedPrice,
  showConsumption,
  setShowSpotPrice,
  setShowFixedPrice,
  setShowConsumption,
  isMobile,
  currentMonthIndex,
  handlePrevMonthPeriod,
  handleNextMonthPeriod,
}) => {
  const { t, i18n } = useTranslation();

  if (
    !result ||
    !Array.isArray(result.MonthlyData) ||
    result.MonthlyData.length === 0
  ) {
    return <p>Ei kuukausidataa saatavilla.</p>;
  }

  const maxItems = isMobile ? 6 : 12;
  const startIndex = isMobile ? currentMonthIndex : 0;
  const endIndex = startIndex + maxItems;
  const filteredData = result.MonthlyData.slice(startIndex, endIndex);

  const labels = filteredData.map((month) => {
    const monthName = new Date(0, month.Month - 1).toLocaleString(
      i18n.language === "en" ? "en-US" : "fi-FI",
      { month: "long" }
    );
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  });

  const chartData = {
    labels,
    datasets: [
      ...(showSpotPrice
        ? [
            {
              label: t("showSpotPrice"),
              backgroundColor: "#4682B4",
              data: filteredData.map((month) => month.SpotPriceTotal),
            },
          ]
        : []),
      ...(showFixedPrice
        ? [
            {
              label: t("showFixedPrice"),
              backgroundColor: "#DC143C",
              data: filteredData.map((month) => month.FixedPriceTotal),
            },
          ]
        : []),
      ...(showConsumption
        ? [
            {
              label: t("showConsumption"),
              backgroundColor: "#32CD32",
              data: filteredData.map((month) => month.Consumption),
              datalabels: { color: "#333" },
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <div className="graph-options">
        <Form.Check
          type="checkbox"
          label={t("showSpotPrice")}
          checked={showSpotPrice}
          onChange={() => setShowSpotPrice(!showSpotPrice)}
          className="form-check"
        />
        <Form.Check
          type="checkbox"
          label={t("showFixedPrice")}
          checked={showFixedPrice}
          onChange={() => setShowFixedPrice(!showFixedPrice)}
          className="form-check"
        />
        <Form.Check
          type="checkbox"
          label={t("showConsumption")}
          checked={showConsumption}
          onChange={() => setShowConsumption(!showConsumption)}
          className="form-check"
        />
      </div>
      <div className="chart-controls">
        {isMobile && (
          <div className="month-period-controls">
            <Button
              onClick={handlePrevMonthPeriod}
              disabled={currentMonthIndex === 0}
            >
              {t("previous")}
            </Button>
            <Button
              onClick={handleNextMonthPeriod}
              disabled={
                currentMonthIndex + maxItems >= result.MonthlyData.length
              }
            >
              {t("next")}
            </Button>
          </div>
        )}
      </div>
      <div className="chart-container">
        <h2 style={{ textAlign: "center" }}>{t("MonthlyResults")}</h2>
        <Bar
          data={chartData}
          options={{
            plugins: {
              legend: { position: "top" as const },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || "";
                    const value = context.raw;
                    return `${label}: ${value}${
                      context.dataset.label === "Kulutus" ? " kWh" : " €"
                    }`;
                  },
                },
              },
              datalabels: { display: false },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: { display: true },
                grid: { display: false },
              },
              y: {
                title: {
                  display: true,
                  text: "Hinta (€ ) / Kulutus kWh",
                  font: { size: 14, weight: "bold" },
                },
                grid: { color: "#ddd" },
              },
            },
          }}
        />
      </div>
    </>
  );
};

export default ConsumptionChart;
