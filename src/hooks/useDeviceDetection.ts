import { useState, useEffect } from "react";

interface DeviceInfo {
  isMobile: boolean;
  maxItems: number;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    maxItems: 15,
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobileUserAgents = [
        "android",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "windows phone",
      ];

      const isMobileDevice = mobileUserAgents.some((mobileAgent) =>
        userAgent.toLowerCase().includes(mobileAgent)
      );
      const isMobileScreen = window.innerWidth <= 768;
      const isMobile = isMobileDevice || isMobileScreen;

      setDeviceInfo({
        isMobile,
        maxItems: isMobile ? 6 : 15,
      });
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return deviceInfo;
};
