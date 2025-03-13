import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { CalculationResult } from "@/models/FormTypes";
import ConsumptionChart from "./ConsumptionChart";

type ResultDisplayProps = {
  result: CalculationResult;
  showSpotPrice: boolean;
  showFixedPrice: boolean;
  showConsumption: boolean;
  setShowSpotPrice: (show: boolean) => void;
  setShowFixedPrice: (show: boolean) => void;
  setShowConsumption: (show: boolean) => void;
  isMobile: boolean;
  currentMonthIndex: number;
  handlePrevMonthPeriod: () => void;
  handleNextMonthPeriod: () => void;
  visibleMonths: any[];
  onReset: () => void;
};
export const ResultDisplay = ({
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
  visibleMonths,
  onReset,
}: ResultDisplayProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="result-data-container">
        <h2>{t("calculationResults")}</h2>
        <div className="result-summary">
          <p>
            {t("calculationYears")}: {result.CalculationYears}
          </p>
          <p>
            {t("cheaperOption")}: {result.CheaperOption}
          </p>
          <p>
            {t("costDifference")}: {result.CostDifference.toFixed(2)} €
          </p>
          <p>
            {t("estimatedConsumption")}: {result.EstimatedMinConsumption} -{" "}
            {result.EstimatedMaxConsumption} kWh
          </p>
          <p>
            {t("spotPriceCost")}: {result.MinSpotPriceCost.toFixed(2)} -{" "}
            {result.MaxSpotPriceCost.toFixed(2)} €
          </p>
          <p>
            {t("fixedPriceCost")}: {result.MinFixedPriceCost.toFixed(2)} -{" "}
            {result.MaxFixedPriceCost.toFixed(2)} €
          </p>
          <p>
            {t("averageSpotPrice")}: {result.AverageHourlySpotPrice.toFixed(2)}{" "}
            snt/kWh
          </p>
        </div>
      </div>
      <ConsumptionChart
        result={result}
        showSpotPrice={showSpotPrice}
        showFixedPrice={showFixedPrice}
        showConsumption={showConsumption}
        setShowSpotPrice={setShowSpotPrice}
        setShowFixedPrice={setShowFixedPrice}
        setShowConsumption={setShowConsumption}
        isMobile={isMobile}
        currentMonthIndex={currentMonthIndex}
        handlePrevMonthPeriod={handlePrevMonthPeriod}
        handleNextMonthPeriod={handleNextMonthPeriod}
        months={visibleMonths}
      />
      <div className="calculate-again">
        <Button className="calcAgain" variant="primary" onClick={onReset}>
          {t("calculateAgain")}
        </Button>
      </div>
    </>
  );
};
