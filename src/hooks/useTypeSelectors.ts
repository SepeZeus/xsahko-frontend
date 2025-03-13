import { HouseType, WorkShiftType, HeatingType } from "@/models/FormTypes";

interface TypeSelectorsProps {
  formData: any;
  selectedHouseType: HouseType | null;
  selectedWorkShiftType: WorkShiftType | null;
  selectedHeatingType: HeatingType | null;
  updateState: (updates: any) => void;
}

export const useTypeSelectors = ({
  formData,
  selectedHouseType,
  selectedWorkShiftType,
  selectedHeatingType,
  updateState,
}: TypeSelectorsProps) => {
  const handleHouseTypeSelect = (houseType: HouseType) => {
    const newHouseType = selectedHouseType === houseType ? null : houseType;

    updateState({
      selectedHouseType: newHouseType,
      showErrors: false, // Reset errors when selecting/deselecting
      formData: {
        ...formData,
        houseType: newHouseType ? houseType : "", // Empty string when deselecting
      },
      validationErrors: [], // Clear validation errors on selection change
    });
  };

  const handleWorkshiftTypeSelect = (workShiftType: WorkShiftType) => {
    if (
      workShiftType === "DayWorker" ||
      workShiftType === "ShiftWorker" ||
      workShiftType === "RemoteWorker"
    ) {
      const newWorkShiftType =
        selectedWorkShiftType === workShiftType ? null : workShiftType;

      updateState({
        selectedWorkShiftType: newWorkShiftType,
        showErrors: false,
        formData: {
          ...formData,
          workShiftType: newWorkShiftType ? workShiftType.toString() : "",
        },
      });
    }
  };

  const handleHeatingTypeSelect = (heatingType: HeatingType) => {
    if (
      heatingType === "ElectricHeating" ||
      heatingType === "DistrictHeating" ||
      heatingType === "GeothermalHeating" ||
      heatingType === "OilHeating"
    ) {
      const newHeatingType =
        selectedHeatingType === heatingType ? null : heatingType;

      updateState({
        selectedHeatingType: newHeatingType,
        showErrors: false,
        formData: {
          ...formData,
          heatingType: newHeatingType ? heatingType.toString() : "",
        },
      });
    }
  };

  return {
    handleHouseTypeSelect,
    handleWorkshiftTypeSelect,
    handleHeatingTypeSelect,
  };
};
