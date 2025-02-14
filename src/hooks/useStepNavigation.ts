import { FormDataParams, HouseType, HeatingType } from "../models/FormTypes";
import { ValidateFormData } from "../validation/FormDataValidation";
import { TFunction } from "i18next";

interface StepNavigationProps {
  currentStep: number;
  formData: FormDataParams;
  updateState: (updates: any) => void;
  t: TFunction;
}

export const useStepNavigation = ({
  currentStep,
  formData,
  updateState,
  t,
}: StepNavigationProps) => {
  const totalSteps = 8;

  const skipFloorHeating = (heatingType: HeatingType): boolean => {
    return heatingType === "ElectricHeating";
  };

  const skipHeatingType = (housetype: HouseType): boolean => {
    return housetype === "Apartmenthouse";
  };

  const calculateProgressBar = (
    currentStep: number,
    totalSteps: number
  ): number => {
    if (currentStep === totalSteps) {
      return 100;
    }
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  // const handleNext = () => {
  //   const validationErrors = ValidateFormData(formData, currentStep, t);
  //   if (validationErrors.length > 0) {
  //     updateState({
  //       validationErrors,
  //       showErrors: true,
  //     });
  //     return;
  //   }

  //   updateState({
  //     validationErrors: [],
  //     showErrors: false,
  //   });

  //   if (
  //     currentStep === 4 &&
  //     skipFloorHeating(formData.heatingType as HeatingType)
  //   ) {
  //     updateState({ currentStep: currentStep + 2 });
  //   } else if (
  //     currentStep === 3 &&
  //     skipHeatingType(formData.houseType as HouseType)
  //   ) {
  //     updateState({ currentStep: currentStep + 2 });
  //   } else {
  //     updateState({ currentStep: currentStep + 1 });
  //   }
  // };

  const handleNext = () => {
    const validationErrors = ValidateFormData(formData, currentStep, t);

    // Add logging to debug validation errors
    console.log("Validation errors:", validationErrors);
    console.log("Current form data:", formData);

    if (validationErrors.length > 0) {
      updateState({
        validationErrors,
        showErrors: true,
      });
      return;
    }

    updateState({
      validationErrors: [],
      showErrors: false,
      currentStep: calculateNextStep(currentStep, formData),
    });
  };

  const calculateNextStep = (
    currentStep: number,
    formData: FormDataParams
  ): number => {
    if (
      currentStep === 4 &&
      skipFloorHeating(formData.heatingType as HeatingType)
    ) {
      return currentStep + 2;
    } else if (
      currentStep === 3 &&
      skipHeatingType(formData.houseType as HouseType)
    ) {
      return currentStep + 2;
    }
    return currentStep + 1;
  };

  const handlePrevious = () => {
    let prevStep = currentStep - 1;

    if (
      currentStep === 6 &&
      skipFloorHeating(formData.heatingType as HeatingType)
    ) {
      prevStep = currentStep - 2;
    } else if (
      currentStep === 5 &&
      skipHeatingType(formData.houseType as HouseType)
    ) {
      prevStep = currentStep - 2;
    }

    updateState({ currentStep: prevStep });
  };

  const progress = calculateProgressBar(currentStep, totalSteps);

  return {
    handleNext,
    handlePrevious,
    progress,
    totalSteps,
  };
};
