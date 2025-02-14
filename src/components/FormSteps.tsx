import React from "react";
import { Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  ApartmentRounded,
  HolidayVillageRounded,
  HomeRounded,
  CabinRounded,
  ElectricBolt,
  Waves,
  FilterHdr,
  OilBarrel,
  GridViewRounded,
  People,
  ElectricCar,
  ChargingStation,
  Help,
  BathroomRounded,
  FireplaceRounded,
  SolarPowerRounded,
} from "@mui/icons-material";
import { IoCalendarSharp } from "react-icons/io5";
import { FaCentSign } from "react-icons/fa6";
import { HouseType, HeatingType, WorkShiftType } from "../models/FormTypes";
import { ValidationError } from "../validation/FormDataValidation";
import { BaseFormStep } from "./BaseFormStep";

interface InitialInformationStepProps {
  year: number;
  directiveFixedPrice: number;
  onChange: (name: string, value: number) => void;
  onNext: () => void;
  validationErrors: ValidationError[];
}

export const InitialInformationStep: React.FC<InitialInformationStepProps> = ({
  year,
  directiveFixedPrice,
  onChange,
  onNext,
  validationErrors,
}) => {
  const { t } = useTranslation();

  return (
    <BaseFormStep
      title={t("startingInformation")}
      onNext={onNext}
      showPrevious={false}
    >
      <div className="form-group">
        <label className="year-label">{t("Year")}</label>
        <div className="input-with-calendar">
          <IoCalendarSharp style={{ height: "45px", width: "45px" }} />
          <input
            type="number"
            name="year"
            value={year}
            onChange={(e) => onChange("year", parseInt(e.target.value))}
            required
            min={2015}
          />
        </div>
        <div>
          <span className="error-message">
            {validationErrors.find((error) => error.field === "year")?.message}
          </span>
        </div>
      </div>
      <div className="form-group">
        <label className="fixprice-label">{t("fixedPrice")}</label>
        <div className="input-with-price">
          <FaCentSign style={{ height: "45px", width: "45px" }} />
          <input
            type="number"
            name="directiveFixedPrice"
            value={directiveFixedPrice}
            onChange={(e) =>
              onChange("directiveFixedPrice", parseFloat(e.target.value))
            }
            required
            min={1}
            step={0.1}
          />
        </div>
        <div>
          <span className="error-message">
            {
              validationErrors.find(
                (error) => error.field === "directiveFixedPrice"
              )?.message
            }
          </span>
        </div>
      </div>
    </BaseFormStep>
  );
};

interface HouseTypeStepProps {
  selectedHouseType: HouseType | null;
  onHouseTypeSelect: (houseType: HouseType) => void;
  onNext: () => void;
  onPrevious: () => void;
  validationErrors: ValidationError[];
}

export const HouseTypeStep: React.FC<HouseTypeStepProps> = ({
  selectedHouseType,
  onHouseTypeSelect,
  onNext,
  onPrevious,
  validationErrors,
}) => {
  const { t } = useTranslation();

  const houseTypes = [
    { type: "Apartmenthouse", icon: ApartmentRounded, label: "ApartmentHouse" },
    {
      type: "Terracedhouse",
      icon: HolidayVillageRounded,
      label: "TerracedHouse",
    },
    { type: "Detachedhouse", icon: HomeRounded, label: "DetachedHouse" },
    { type: "Cottage", icon: CabinRounded, label: "Cottage" },
  ] as const;

  return (
    <BaseFormStep
      title={t("houseType")}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <div className="form-group">
        <div className="house-type-buttons">
          {houseTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              className={`house-type-button ${
                selectedHouseType === type ? "selected" : ""
              }`}
              onClick={() => onHouseTypeSelect(type as HouseType)}
            >
              <Icon style={{ height: "60px", width: "60px" }} />
              <p className="houseIconNames">{t(label)}</p>
            </button>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <span className="error-message">
          {
            validationErrors.find((error) => error.field === "houseType")
              ?.message
          }
        </span>
      </div>
    </BaseFormStep>
  );
};

interface HeatingTypeStepProps {
  selectedHeatingType: HeatingType | null;
  onHeatingTypeSelect: (heatingType: HeatingType) => void;
  onNext: () => void;
  onPrevious: () => void;
  validationErrors: ValidationError[];
}

export const HeatingTypeStep: React.FC<HeatingTypeStepProps> = ({
  selectedHeatingType,
  onHeatingTypeSelect,
  onNext,
  onPrevious,
  validationErrors,
}) => {
  const { t } = useTranslation();

  const heatingTypes = [
    { type: "ElectricHeating", icon: ElectricBolt, label: "ElectricHeating" },
    { type: "DistrictHeating", icon: Waves, label: "DistrictHeating" },
    { type: "GeothermalHeating", icon: FilterHdr, label: "GeothermalHeating" },
    { type: "OilHeating", icon: OilBarrel, label: "OilHeating" },
  ] as const;

  return (
    <BaseFormStep
      title={t("HeatingTypeInfo")}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <div className="form-group">
        <div className="house-type-buttons">
          {heatingTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              className={`house-type-button ${
                selectedHeatingType === type ? "selected" : ""
              }`}
              onClick={() => onHeatingTypeSelect(type as HeatingType)}
            >
              <Icon style={{ height: "60px", width: "60px" }} />
              <p className="heatingTypeIcons">{t(label)}</p>
            </button>
          ))}
        </div>
      </div>
      <br />
      <div style={{ textAlign: "center" }}>
        <span className="error-message">
          {
            validationErrors.find((error) => error.field === "heatingType")
              ?.message
          }
        </span>
      </div>
    </BaseFormStep>
  );
};

interface WorkshiftTypeStepProps {
  squareMeters: number;
  numberOfResidents: number;
  workShiftType: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWorkshiftTypeSelect: (workShiftType: WorkShiftType) => void;
  onNext: () => void;
  onPrevious: () => void;
  validationErrors: ValidationError[];
  showErrors: boolean;
}

export const WorkshiftTypeStep: React.FC<WorkshiftTypeStepProps> = ({
  squareMeters,
  numberOfResidents,
  workShiftType,
  onInputChange,
  onWorkshiftTypeSelect,
  onNext,
  onPrevious,
  validationErrors,
  showErrors,
}) => {
  const { t } = useTranslation();

  const workShiftTypes = [
    { type: "DayWorker", label: "DayWorker" },
    { type: "ShiftWorker", label: "ShiftWorker" },
    { type: "RemoteWorker", label: "RemoteWorker" },
  ] as const;

  return (
    <BaseFormStep
      title={t("ApartmentInformation")}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <div className="form-group">
        <label className="sqrt-label">{t("SquareMeters")}</label>
        <div className="input-with-sqrt">
          <GridViewRounded style={{ height: "45px", width: "45px" }} />
          <input
            type="number"
            name="squareMeters"
            value={squareMeters}
            onChange={onInputChange}
            required
          />
        </div>
        <span className="error-message">
          {
            validationErrors.find((error) => error.field === "squareMeters")
              ?.message
          }
        </span>
      </div>

      <div className="form-group">
        <label className="resident-label">{t("NumberOfResidents")}</label>
        <div className="input-with-resident">
          <People style={{ height: "45px", width: "45px" }} />
          <input
            type="number"
            name="numberOfResidents"
            value={numberOfResidents}
            onChange={onInputChange}
            required
          />
        </div>
        {showErrors &&
          validationErrors.some(
            (error) => error.field === "numberOfResidents"
          ) && (
            <span className="error-message">
              {
                validationErrors.find(
                  (error) => error.field === "numberOfResidents"
                )?.message
              }
            </span>
          )}
      </div>

      <div className="form-group">
        <label className="workshift-label">{t("WorkShiftType")}</label>
        <div className="work-shift-buttons">
          {workShiftTypes.map(({ type, label }) => (
            <button
              key={type}
              className={`work-shift-button ${
                workShiftType === type ? "selected" : ""
              }`}
              onClick={() => onWorkshiftTypeSelect(type as WorkShiftType)}
            >
              <p className="workShiftText">{t(label)}</p>
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <span className="error-message">
            {
              validationErrors.find((error) => error.field === "workShiftType")
                ?.message
            }
          </span>
        </div>
      </div>
    </BaseFormStep>
  );
};

interface FloorHeatingStepProps {
  hasFloorHeating: boolean;
  floorHeatingSquareMeters: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorHeatingChange: (value: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  validationErrors: ValidationError[];
}

export const FloorHeatingStep: React.FC<FloorHeatingStepProps> = ({
  hasFloorHeating,
  floorHeatingSquareMeters,
  onInputChange,
  onFloorHeatingChange,
  onNext,
  onPrevious,
  validationErrors,
}) => {
  const { t } = useTranslation();

  return (
    <BaseFormStep title={t("FloorHeating")}>
      <div className="form-group text-center">
        <label>{t("HasFloorHeating")}</label>
        <br />
        <br />
        <Form.Check
          inline
          label={t("Yes")}
          type="radio"
          id="floorHeatingYes"
          name="hasFloorHeating"
          checked={hasFloorHeating}
          onChange={() => onFloorHeatingChange(true)}
        />
        <Form.Check
          inline
          label={t("NoI")}
          type="radio"
          id="floorHeatingNo"
          name="hasFloorHeating"
          checked={!hasFloorHeating}
          onChange={() => onFloorHeatingChange(false)}
        />
      </div>
      {hasFloorHeating && (
        <div className="form-group">
          <label className="sqrt-label">{t("HeatedArea")}</label>
          <div className="input-with-sqrt">
            <GridViewRounded style={{ height: "45px", width: "45px" }} />
            <input
              type="number"
              name="floorHeatingSquareMeters"
              value={floorHeatingSquareMeters}
              onChange={onInputChange}
            />
          </div>
          <span className="error-message">
            {
              validationErrors.find(
                (error) => error.field === "floorHeatingSquareMeters"
              )?.message
            }
          </span>
        </div>
      )}
      <div className="nextPrevButtons">
        <Button className="prevButton" variant="secondary" onClick={onPrevious}>
          {t("PreviousButton")}
        </Button>
        <Button className="nextButton" variant="primary" onClick={onNext}>
          {t("NextButton")}
        </Button>
      </div>
    </BaseFormStep>
  );
};

interface ElectricCarStepProps {
  hasElectricCar: boolean;
  electricCarCount: number;
  electricCarKwhUsagePerYear: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onElectricCarChange: (value: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  validationErrors: ValidationError[];
  showErrors: boolean;
}

export const ElectricCarStep: React.FC<ElectricCarStepProps> = ({
  hasElectricCar,
  electricCarCount,
  electricCarKwhUsagePerYear,
  onInputChange,
  onElectricCarChange,
  onNext,
  onPrevious,
  validationErrors,
  showErrors,
}) => {
  const { t } = useTranslation();

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {t("carInfo")}
    </Tooltip>
  );

  return (
    <BaseFormStep
      title={t("ElectricCar")}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <div className="form-group text-center">
        <label>{t("ElectricCarInfo")}</label>
        <br />
        <br />
        <Form.Check
          inline
          label={t("Yes")}
          type="radio"
          id="electricCarYes"
          name="hasElectricCar"
          checked={hasElectricCar}
          onChange={() => onElectricCarChange(true)}
        />
        <Form.Check
          inline
          label={t("No")}
          type="radio"
          id="electricCarNo"
          name="hasElectricCar"
          checked={!hasElectricCar}
          onChange={() => onElectricCarChange(false)}
        />
      </div>
      {hasElectricCar && (
        <>
          <div className="form-group">
            <label className="cars-label">{t("NumberOfElectricCars")}</label>
            <div className="input-with-cars">
              <ElectricCar style={{ height: "45px", width: "45px" }} />
              <input
                type="number"
                name="electricCarCount"
                value={electricCarCount}
                onChange={onInputChange}
              />
            </div>
            <span className="error-message">
              {
                validationErrors.find(
                  (error) => error.field === "electricCarCount"
                )?.message
              }
            </span>
          </div>
          <div className="form-group">
            <label className="kwh-label">{t("ElectricCarUsage")}</label>
            <div className="input-with-kwh">
              <ChargingStation style={{ height: "45px", width: "45px" }} />
              <input
                type="number"
                name="electricCarKwhUsagePerYear"
                value={electricCarKwhUsagePerYear}
                onChange={onInputChange}
              />
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <Help style={{ height: "35px", width: "35px" }} />
              </OverlayTrigger>
            </div>
            {showErrors &&
              validationErrors.some(
                (error) => error.field === "electricCarKwhUsagePerYear"
              ) && (
                <span className="error-message">
                  {
                    validationErrors.find(
                      (error) => error.field === "electricCarKwhUsagePerYear"
                    )?.message
                  }
                </span>
              )}
          </div>
        </>
      )}
    </BaseFormStep>
  );
};

interface SaunaStepProps {
  hasSauna: boolean;
  saunaHeatingFrequency: number;
  hasFirePlace: boolean;
  firePlaceHeatingFrequency: number;
  houseType: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaunaChange: (value: boolean) => void;
  onFirePlaceChange: (value: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  validationErrors: ValidationError[];
}

export const SaunaStep: React.FC<SaunaStepProps> = ({
  hasSauna,
  saunaHeatingFrequency,
  hasFirePlace,
  firePlaceHeatingFrequency,
  houseType,
  onInputChange,
  onSaunaChange,
  onFirePlaceChange,
  onNext,
  onPrevious,
  onSubmit,
  validationErrors,
}) => {
  const { t } = useTranslation();
  const isApartmentOrTerraced =
    houseType === "Apartmenthouse" || houseType === "Terracedhouse";
  const isDetachedOrCottage =
    houseType === "Detachedhouse" || houseType === "Cottage";

  return (
    <BaseFormStep title={t("OtherExpenses")}>
      <div className="form-group text-center">
        <label>{t("ElectricSauna")}</label>
        <br />
        <br />
        <Form.Check
          inline
          label={t("Yes")}
          type="radio"
          id="saunaYes"
          name="hasSauna"
          checked={hasSauna}
          onChange={() => onSaunaChange(true)}
        />
        <Form.Check
          inline
          label={t("NoI")}
          type="radio"
          id="saunaNo"
          name="hasSauna"
          checked={!hasSauna}
          onChange={() => onSaunaChange(false)}
        />
      </div>

      {hasSauna && (
        <div className="form-group">
          <label className="sauna-label">{t("ElectricSaunaUsage")}</label>
          <div className="input-with-sauna">
            <BathroomRounded style={{ height: "45px", width: "45px" }} />
            <input
              type="number"
              name="saunaHeatingFrequency"
              value={saunaHeatingFrequency}
              onChange={onInputChange}
            />
          </div>
          <span className="error-message">
            {
              validationErrors.find(
                (error) => error.field === "saunaHeatingFrequency"
              )?.message
            }
          </span>
        </div>
      )}

      {isDetachedOrCottage && (
        <>
          <div className="form-group text-center">
            <label>{t("HasFirePlace")}</label>
            <br />
            <br />
            <Form.Check
              inline
              label={t("Yes")}
              type="radio"
              id="fireplaceYes"
              name="hasFirePlace"
              checked={hasFirePlace}
              onChange={() => onFirePlaceChange(true)}
            />
            <Form.Check
              inline
              label={t("NoI")}
              type="radio"
              id="fireplaceNo"
              name="hasFirePlace"
              checked={!hasFirePlace}
              onChange={() => onFirePlaceChange(false)}
            />
          </div>

          {hasFirePlace && (
            <div className="form-group">
              <label className="fireplace-label">{t("FirePlaceUsage")}</label>
              <div className="input-with-fireplace">
                <FireplaceRounded style={{ height: "45px", width: "45px" }} />
                <input
                  type="number"
                  name="firePlaceHeatingFrequency"
                  value={firePlaceHeatingFrequency}
                  onChange={onInputChange}
                />
              </div>
              <span className="error-message">
                {
                  validationErrors.find(
                    (error) => error.field === "firePlaceHeatingFrequency"
                  )?.message
                }
              </span>
            </div>
          )}
        </>
      )}

      <div className="nextPrevButtons">
        <Button className="prevButton" variant="secondary" onClick={onPrevious}>
          {t("PreviousButton")}
        </Button>
        {isApartmentOrTerraced ? (
          <Button
            variant="primary"
            className="calcResultBtn"
            onClick={onSubmit}
          >
            {t("CalculateResultsButton")}
          </Button>
        ) : (
          <Button className="nextButton" variant="primary" onClick={onNext}>
            {t("NextButton")}
          </Button>
        )}
      </div>
    </BaseFormStep>
  );
};
interface SolarPanelStepProps {
  hasSolarPanels: boolean;
  solarPanelCount: number;
  onSolarPanelChange: (value: boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  validationErrors: ValidationError[];
}

export const SolarPanelStep: React.FC<SolarPanelStepProps> = ({
  hasSolarPanels,
  solarPanelCount,
  onSolarPanelChange,
  onInputChange,
  onPrevious,
  onSubmit,
  validationErrors,
}) => {
  const { t } = useTranslation();

  return (
    <BaseFormStep title={t("SolarPanelHeader")}>
      <div className="form-group text-center">
        <label>{t("SolarPanels")}</label>
        <br />
        <br />
        <Form.Check
          inline
          label={t("Yes")}
          type="radio"
          id="solapanelYes"
          name="hasSolarPanels"
          checked={hasSolarPanels}
          onChange={() => onSolarPanelChange(true)}
        />
        <Form.Check
          inline
          label={t("NoI")}
          type="radio"
          id="solarpanelNo"
          name="hasSolarPanels"
          checked={!hasSolarPanels}
          onChange={() => onSolarPanelChange(false)}
        />
      </div>
      {hasSolarPanels && (
        <div className="form-group">
          <label className="solarpanel-label">{t("SolarPanelCount")}</label>
          <div className="input-with-solarpanel">
            <SolarPowerRounded style={{ height: "45px", width: "45px" }} />
            <input
              type="number"
              name="solarPanelCount"
              value={solarPanelCount}
              onChange={onInputChange}
            />
          </div>
          <div>
            <span className="error-message">
              {
                validationErrors.find(
                  (error) => error.field === "solarPanelCount"
                )?.message
              }
            </span>
          </div>
        </div>
      )}
      <div className="nextPrevButtons">
        <Button className="prevButton" variant="secondary" onClick={onPrevious}>
          {t("PreviousButton")}
        </Button>
        <Button variant="primary" className="calcResultBtn" onClick={onSubmit}>
          {t("CalculateResultsButton")}
        </Button>
      </div>
    </BaseFormStep>
  );
};
