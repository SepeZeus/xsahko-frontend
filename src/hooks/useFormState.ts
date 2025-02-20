import { useState, useEffect } from "react";
import {
  FormDataParams,
  CalculationResult,
  HouseType,
  WorkShiftType,
  HeatingType,
} from "@/models/FormTypes";
import { ValidationError } from "@/validation/wompwomp";

interface FormState {
  formData: FormDataParams;
  result: CalculationResult | null;
  currentStep: number;
  validationErrors: ValidationError[];
  showErrors: boolean;
  selectedHouseType: HouseType | null;
  selectedWorkShiftType: WorkShiftType | null;
  selectedHeatingType: HeatingType | null;
  showSpotPrice: boolean;
  showFixedPrice: boolean;
  showConsumption: boolean;
  showProgressBar: boolean;
  currentMonthIndex: number;
}

const initialFormData: FormDataParams = {
  year: new Date().getFullYear(),
  directiveFixedPrice: 1,
  houseType: "",
  squareMeters: 1,
  workShiftType: "",
  hasFloorHeating: false,
  floorHeatingSquareMeters: 0,
  heatingType: "",
  hasElectricCar: false,
  electricCarCount: 0,
  electricCarKwhUsagePerYear: 0,
  hasSauna: false,
  saunaHeatingFrequency: 0,
  hasFirePlace: false,
  firePlaceHeatingFrequency: 0,
  numberOfResidents: 1,
  hasSolarPanels: false,
  solarPanelCount: 1,
};

export const useFormState = () => {
  const [state, setState] = useState<FormState>({
    formData: initialFormData,
    result: null,
    currentStep: 1,
    validationErrors: [],
    showErrors: false,
    selectedHouseType: null,
    selectedWorkShiftType: null,
    selectedHeatingType: null,
    showSpotPrice: true,
    showFixedPrice: true,
    showConsumption: false,
    showProgressBar: true,
    currentMonthIndex: 0,
  });

  useEffect(() => {
    const savedState = localStorage.getItem("electricityPriceFormState");
    if (savedState) {
      setState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("electricityPriceFormState", JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<FormState>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const resetState = () => {
    setState({
      formData: initialFormData,
      result: null,
      currentStep: 1,
      validationErrors: [],
      showErrors: false,
      selectedHouseType: null,
      selectedWorkShiftType: null,
      selectedHeatingType: null,
      showSpotPrice: true,
      showFixedPrice: true,
      showConsumption: false,
      showProgressBar: true,
      currentMonthIndex: 0,
    });
  };

  return {
    state,
    updateState,
    resetState,
  };
};
