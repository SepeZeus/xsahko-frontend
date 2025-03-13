import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend,
} from "chart.js";
import "@/styles/DirectiveCalculation.css";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useFormState } from "@/hooks/useFormState";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { useMonthNavigation } from "@/hooks/useMonthNavigation";
import { useFormHandlers } from "@/hooks/useFormHandlers";
import { useTypeSelectors } from "@/hooks/useTypeSelectors";
import { ProgressBar } from "./ProgressBar";
import {
  InitialInformationStep,
  HouseTypeStep,
  HeatingTypeStep,
  WorkshiftTypeStep,
  FloorHeatingStep,
  ElectricCarStep,
  SaunaStep,
  SolarPanelStep,
} from "./FormSteps";
import { ResultDisplay } from "./ResultDisplay";

import { Form, Container } from "react-bootstrap";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "@/styles/IconStyles.css";
import { useTranslation } from "react-i18next";
import "react-circular-progressbar/dist/styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartJSTooltip,
  Legend,
  ChartDataLabels
);

const ElectricityPriceForm = () => {
  const { state, updateState, resetState } = useFormState();
  const {
    formData,
    result,
    currentStep,
    validationErrors,
    showErrors,
    selectedHouseType,
    selectedWorkShiftType,
    selectedHeatingType,
    showSpotPrice,
    showFixedPrice,
    showConsumption,
    showProgressBar,
  } = state;
  const { t } = useTranslation();
  const { isMobile, maxItems } = useDeviceDetection();

  const {
    currentMonthIndex,
    handlePrevMonthPeriod,
    handleNextMonthPeriod,
    getVisibleMonths,
  } = useMonthNavigation({
    result,
    maxItems,
    isMobile,
  });

  const { handleNext, handlePrevious, progress } = useStepNavigation({
    currentStep: state.currentStep,
    formData: state.formData,
    updateState,
    t,
  });

  const {
    handleChange,
    handleFormChange,
    handleSubmit,
    handleFloorHeatingChange,
    handleElectricCarChange,
    handleSaunaChange,
    handleFirePlaceChange,
    handleSolarPanelChange,
  } = useFormHandlers({
    formData,
    currentStep,
    selectedHouseType,
    selectedWorkShiftType,
    selectedHeatingType,
    updateState,
    t,
  });

  const {
    handleHouseTypeSelect,
    handleWorkshiftTypeSelect,
    handleHeatingTypeSelect,
  } = useTypeSelectors({
    formData,
    selectedHouseType,
    selectedWorkShiftType,
    selectedHeatingType,
    updateState,
  });

  const handleReset = () => {
    resetState();
  };

  const renderStep = (): React.ReactNode => {
    if (result !== null) {
      return null;
    }

    switch (currentStep) {
      case 1:
        return (
          <InitialInformationStep
            year={formData.year}
            directiveFixedPrice={formData.directiveFixedPrice}
            onChange={handleFormChange}
            onNext={handleNext}
            validationErrors={validationErrors}
          />
        );
      case 2:
        return (
          <HouseTypeStep
            selectedHouseType={selectedHouseType}
            onHouseTypeSelect={handleHouseTypeSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            validationErrors={validationErrors}
          />
        );
      case 3:
        return (
          <WorkshiftTypeStep
            squareMeters={formData.squareMeters}
            numberOfResidents={formData.numberOfResidents}
            workShiftType={formData.workShiftType}
            onInputChange={handleChange}
            onWorkshiftTypeSelect={handleWorkshiftTypeSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            validationErrors={validationErrors}
            showErrors={showErrors}
          />
        );
      case 4:
        return (
          <HeatingTypeStep
            selectedHeatingType={selectedHeatingType}
            onHeatingTypeSelect={handleHeatingTypeSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            validationErrors={validationErrors}
          />
        );
      case 5:
        return (
          <FloorHeatingStep
            hasFloorHeating={formData.hasFloorHeating}
            floorHeatingSquareMeters={formData.floorHeatingSquareMeters}
            onInputChange={handleChange}
            onFloorHeatingChange={handleFloorHeatingChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            validationErrors={validationErrors}
          />
        );
      case 6:
        return (
          <ElectricCarStep
            hasElectricCar={formData.hasElectricCar}
            electricCarCount={formData.electricCarCount}
            electricCarKwhUsagePerYear={formData.electricCarKwhUsagePerYear}
            onInputChange={handleChange}
            onElectricCarChange={handleElectricCarChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            validationErrors={validationErrors}
            showErrors={showErrors}
          />
        );
      case 7:
        return (
          <SaunaStep
            hasSauna={formData.hasSauna}
            saunaHeatingFrequency={formData.saunaHeatingFrequency}
            hasFirePlace={formData.hasFirePlace}
            firePlaceHeatingFrequency={formData.firePlaceHeatingFrequency}
            houseType={formData.houseType}
            onInputChange={handleChange}
            onSaunaChange={handleSaunaChange}
            onFirePlaceChange={handleFirePlaceChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={() => handleSubmit(new Event("submit") as any)}
            validationErrors={validationErrors}
          />
        );
      case 8:
        if (
          formData.houseType === "Detachedhouse" ||
          formData.houseType === "Cottage"
        ) {
          return (
            <SolarPanelStep
              hasSolarPanels={formData.hasSolarPanels}
              solarPanelCount={formData.solarPanelCount}
              onSolarPanelChange={handleSolarPanelChange}
              onInputChange={handleChange}
              onPrevious={handlePrevious}
              onSubmit={() => handleSubmit(new Event("submit") as any)}
              validationErrors={validationErrors}
            />
          );
        } else {
          updateState({ currentStep: currentStep + 1 });
          return null;
        }
      default:
        return null;
    }
  };

  return (
    <Container className="form-container">
      <h1 style={{ textAlign: "center", fontFamily: "Montserrat, sans-serif" }}>
        {t("MainHeader")}
      </h1>
      <br />
      <Form onSubmit={handleSubmit}>
        {renderStep()}
        <br />
        {showProgressBar && <ProgressBar progress={progress} />}
      </Form>
      {result && (
        <ResultDisplay
          result={result}
          showSpotPrice={showSpotPrice}
          showFixedPrice={showFixedPrice}
          showConsumption={showConsumption}
          setShowSpotPrice={(show) => updateState({ showSpotPrice: show })}
          setShowFixedPrice={(show) => updateState({ showFixedPrice: show })}
          setShowConsumption={(show) => updateState({ showConsumption: show })}
          isMobile={isMobile}
          currentMonthIndex={currentMonthIndex}
          handlePrevMonthPeriod={handlePrevMonthPeriod}
          handleNextMonthPeriod={handleNextMonthPeriod}
          onReset={handleReset}
          visibleMonths={getVisibleMonths() || []}
        />
      )}
    </Container>
  );
};

export default ElectricityPriceForm;
