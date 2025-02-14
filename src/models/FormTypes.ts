// // src/types/formTypes.ts

// export type HouseType =
//   | "Apartmenthouse"
//   | "Terracedhouse"
//   | "Detachedhouse"
//   | "Cottage";
// export type WorkShiftType = "DayWorker" | "ShiftWorker" | "RemoteWorker";
// export type HeatingType =
//   | "ElectricHeating"
//   | "DistrictHeating"
//   | "GeothermalHeating"
//   | "OilHeating";

// export interface FormDataParams {
//   year: number;
//   directiveFixedPrice: number;
//   houseType: string;
//   squareMeters: number;
//   workShiftType: string;
//   hasFloorHeating: boolean;
//   floorHeatingSquareMeters: number;
//   heatingType: string;
//   hasElectricCar: boolean;
//   electricCarCount: number;
//   electricCarKwhUsagePerYear: number;
//   hasSauna: boolean;
//   saunaHeatingFrequency: number;
//   hasFirePlace: boolean;
//   firePlaceHeatingFrequency: number;
//   numberOfResidents: number;
//   hasSolarPanels: boolean;
//   solarPanelCount: number;
// }

// export interface CalculationResult {
//   CalculationYears: number;
//   CheaperOption: string;
//   CostDifference: number;
//   EstimatedMinConsumption: number;
//   EstimatedMaxConsumption: number;
//   MinSpotPriceCost: number;
//   MaxSpotPriceCost: number;
//   MinFixedPriceCost: number;
//   MaxFixedPriceCost: number;
//   AverageHourlySpotPrice: number;
//   MonthlyData: Array<{
//     Month: number;
//     Consumption: number;
//     SpotPriceTotal: number;
//     FixedPriceTotal: number;
//   }>;
// }

// export const initialFormData: FormDataParams = {
//   year: new Date().getFullYear(),
//   directiveFixedPrice: 1,
//   houseType: "",
//   squareMeters: 1,
//   workShiftType: "",
//   hasFloorHeating: false,
//   floorHeatingSquareMeters: 0,
//   heatingType: "",
//   hasElectricCar: false,
//   electricCarCount: 0,
//   electricCarKwhUsagePerYear: 0,
//   hasSauna: false,
//   saunaHeatingFrequency: 0,
//   hasFirePlace: false,
//   firePlaceHeatingFrequency: 0,
//   numberOfResidents: 1,
//   hasSolarPanels: false,
//   solarPanelCount: 1,
// };

export type HouseType =
  | "Apartmenthouse"
  | "Terracedhouse"
  | "Detachedhouse"
  | "Cottage";
export type WorkShiftType = "DayWorker" | "ShiftWorker" | "RemoteWorker";
export type HeatingType =
  | "ElectricHeating"
  | "DistrictHeating"
  | "GeothermalHeating"
  | "OilHeating";

export interface FormDataParams {
  year: number;
  directiveFixedPrice: number;
  houseType: string;
  squareMeters: number;
  workShiftType: string;
  hasFloorHeating: boolean;
  floorHeatingSquareMeters: number;
  heatingType: string;
  hasElectricCar: boolean;
  electricCarCount: number;
  electricCarKwhUsagePerYear: number;
  hasSauna: boolean;
  saunaHeatingFrequency: number;
  hasFirePlace: boolean;
  firePlaceHeatingFrequency: number;
  numberOfResidents: number;
  hasSolarPanels: boolean;
  solarPanelCount: number;
}

export interface CalculationResult {
  CalculationYears: number;
  CheaperOption: string;
  CostDifference: number;
  EstimatedMinConsumption: number;
  EstimatedMaxConsumption: number;
  MinSpotPriceCost: number;
  MaxSpotPriceCost: number;
  MinFixedPriceCost: number;
  MaxFixedPriceCost: number;
  AverageHourlySpotPrice: number;
  MonthlyData: Array<{
    Month: number;
    Consumption: number;
    SpotPriceTotal: number;
    FixedPriceTotal: number;
  }>;
}
