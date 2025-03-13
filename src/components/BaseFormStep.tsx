import React from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type BaseFormStepProps = {
  title: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  showSubmit?: boolean;
};

export const BaseFormStep = ({
  title,
  children,
  onNext,
  onPrevious,
  onSubmit,
  showPrevious = true,
  showNext = true,
  showSubmit = false,
}: BaseFormStepProps) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <br />
      {children}
      <div className="nextPrevButtons">
        {showPrevious && onPrevious && (
          <Button
            className="prevButton"
            variant="secondary"
            onClick={onPrevious}
          >
            {t("PreviousButton")}
          </Button>
        )}
        {showNext && onNext && (
          <Button className="nextButton" variant="primary" onClick={onNext}>
            {t("NextButton")}
          </Button>
        )}
        {showSubmit && onSubmit && (
          <Button
            variant="primary"
            className="calcResultBtn"
            onClick={onSubmit}
          >
            {t("CalculateResultsButton")}
          </Button>
        )}
      </div>
    </>
  );
};
