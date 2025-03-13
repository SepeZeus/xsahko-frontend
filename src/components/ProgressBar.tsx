import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type ProgressBarProps = {
  progress: number;
  pathColor?: string;
  textColor?: string;
  trailColor?: string;
  textSize?: string;
  strokeWidth?: number;
};

export const ProgressBar = ({
  progress,
  pathColor = "#808080",
  textColor = "black",
  trailColor = "#FFFFFF",
  textSize = "20px",
  strokeWidth = 15,
}: ProgressBarProps) => {
  return (
    <div className="progress-bar-container">
      <CircularProgressbar
        value={progress}
        text={`${Math.round(progress)}%`}
        styles={buildStyles({
          pathColor,
          textColor,
          trailColor,
          textSize,
          pathTransitionDuration: 0.5,
        })}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};
