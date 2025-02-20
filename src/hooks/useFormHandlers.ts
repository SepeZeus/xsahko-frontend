import {
  FormDataParams,
  HouseType,
  WorkShiftType,
  HeatingType,
} from "@/models/FormTypes";
import { ValidateFormData } from "@/validation/FormDataValidation";
import { calculatePriceAndConsumption } from "@/services/FetchDirectiveData";
import { TFunction } from "i18next";

interface FormHandlersProps {
  formData: FormDataParams;
  currentStep: number;
  selectedHouseType: HouseType | null;
  selectedWorkShiftType: WorkShiftType | null;
  selectedHeatingType: HeatingType | null;
  updateState: (updates: any) => void;
  t: TFunction;
}

export const useFormHandlers = ({
  formData,
  currentStep,
  selectedHouseType,
  selectedWorkShiftType,
  selectedHeatingType,
  updateState,
  t,
}: FormHandlersProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
        ? parseFloat(value)
        : value;

    // Validate house type selection
    if (name === "houseType" && selectedHouseType) {
      if (
        ![
          "Apartmenthouse",
          "Terracedhouse",
          "Detachedhouse",
          "Cottage",
        ].includes(value)
      ) {
        return;
      }
    }

    // Validate heating type selection
    if (name === "heatingType" && selectedHeatingType) {
      if (
        ![
          "ElectricHeating",
          "DistrictHeating",
          "GeothermalHeating",
          "OilHeating",
        ].includes(value)
      ) {
        return;
      }
    }

    updateState({
      formData: {
        ...formData,
        [name]: newValue,
      },
    });
  };

  const handleFormChange = (name: string, value: number | string | boolean) => {
    // Validate house type changes
    if (name === "houseType" && typeof value === "string") {
      if (
        ![
          "Apartmenthouse",
          "Terracedhouse",
          "Detachedhouse",
          "Cottage",
        ].includes(value)
      ) {
        return;
      }
    }

    // Validate heating type changes
    if (name === "heatingType" && typeof value === "string") {
      if (
        ![
          "ElectricHeating",
          "DistrictHeating",
          "GeothermalHeating",
          "OilHeating",
        ].includes(value)
      ) {
        return;
      }
    }

    updateState({
      formData: {
        ...formData,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = ValidateFormData(formData, currentStep, t);
    if (validationErrors.length > 0) {
      updateState({
        validationErrors,
        showErrors: true,
      });
      return;
    }

    const shouldCalculate =
      validationErrors.length === 0 &&
      (formData.houseType === "Detachedhouse" ||
      formData.houseType === "Cottage"
        ? currentStep === 8 // For Detached house and Cottage, calculate on step 8
        : currentStep === 7); // For Apartment and Terraced house, calculate on step 7

    if (shouldCalculate) {
      try {
        const data = await calculatePriceAndConsumption(formData);
        updateState({
          result: {
            ...data,
            CheaperOption: data.CheaperOption || "",
          },
          showErrors: false,
          showProgressBar: false,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }

    // Validate house and heating type selections
    if (!selectedHouseType || !selectedHeatingType) {
      updateState({
        validationErrors: [
          ...validationErrors,
          { field: "houseType", message: t("Please select a house type") },
          { field: "heatingType", message: t("Please select a heating type") },
        ],
        showErrors: true,
      });
      return;
    }
    updateState({
      formData: {
        ...formData,
        workShiftType: selectedWorkShiftType
          ? selectedWorkShiftType.toString()
          : "",
      },
    });
  };

  const createToggleHandler = (field: string, countField?: string) => {
    return (value: boolean) => {
      const updates: any = {
        [field]: value,
      };

      if (countField) {
        updates[countField] = value
          ? formData[countField as keyof FormDataParams]
          : 0;
      }

      updateState({
        formData: {
          ...formData,
          ...updates,
        },
      });
    };
  };

  return {
    handleChange,
    handleFormChange,
    handleSubmit,
    handleFloorHeatingChange: createToggleHandler(
      "hasFloorHeating",
      "floorHeatingSquareMeters"
    ),
    handleElectricCarChange: createToggleHandler(
      "hasElectricCar",
      "electricCarCount"
    ),
    handleSaunaChange: createToggleHandler("hasSauna", "saunaHeatingFrequency"),
    handleFirePlaceChange: createToggleHandler(
      "hasFirePlace",
      "firePlaceHeatingFrequency"
    ),
    handleSolarPanelChange: createToggleHandler(
      "hasSolarPanels",
      "solarPanelCount"
    ),
  };
};
