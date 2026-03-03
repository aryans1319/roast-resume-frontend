import { useRef, useCallback } from "react";
import html2canvas from "html2canvas";

const useShareCard = () => {
  const cardRef = useRef(null);

  const downloadCard = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // High resolution for retina displays
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = "roast-my-resume-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to generate share card:", error);
    }
  }, []);

  return { cardRef, downloadCard };
};

export default useShareCard;