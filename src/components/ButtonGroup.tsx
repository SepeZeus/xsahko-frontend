import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import "@/styles/ButtonGroup.css";

type ButtonGroupProps = {
  activeService: string;
  setActiveService: (service: string) => void;
};

const ButtonGroup = ({ activeService, setActiveService }: ButtonGroupProps) => {
  const { t } = useTranslation();

  return (
    <div className="button-group">
      <Button
        variant={activeService === "fingrid" ? "primary" : "secondary"}
        onClick={() => setActiveService("fingrid")}
        className={`btn-service ${activeService === "fingrid" ? "active" : ""}`}
      >
        {t("uploadFile")}
      </Button>
      <Button
        variant={activeService === "consumption" ? "primary" : "secondary"}
        onClick={() => setActiveService("consumption")}
        className={`btn-service ${
          activeService === "consumption" ? "active" : ""
        }`}
      >
        {t("estimateConsumption")}
      </Button>

      <Button
        variant={activeService === "spot" ? "primary" : "secondary"}
        onClick={() => setActiveService("spot")}
        className={`btn-service ${activeService === "spot" ? "active" : ""}`}
      >
        {t("spotGraph")}
      </Button>
    </div>
  );
};

export default ButtonGroup;
