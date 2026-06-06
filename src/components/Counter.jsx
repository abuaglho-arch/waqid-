import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function Counter({ value, duration = 1.5, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!isInView) return;

    // Handle ranges (e.g., "20–22M" or "2.0-3.2t" or "80–100M")
    const isRange = value.includes("-") || value.includes("–") || value.includes("—");
    if (isRange) {
      const rangeSeparator = value.includes("–") ? "–" : value.includes("—") ? "—" : "-";
      const parts = value.split(rangeSeparator);
      const lowerStr = parts[0].replace(/[~%tM+]/g, "").trim();
      const upperStr = parts[1].replace(/[~%tM+]/g, "").trim();
      
      const lower = parseFloat(lowerStr);
      const upper = parseFloat(upperStr);
      
      if (isNaN(lower) || isNaN(upper)) {
        setCount(value);
        return;
      }

      const startTime = performance.now();
      const animateRange = (currentTime) => {
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress * (2 - progress);
        
        const currentLower = lower * easeProgress;
        const currentUpper = upper * easeProgress;
        
        const formatNum = (val, original) => {
          if (original.includes(".")) {
            return val.toFixed(1);
          }
          return Math.floor(val).toString();
        };

        const unit = value.replace(/[^%tM+]/g, "");
        setCount(`${formatNum(currentLower, lowerStr)}${rangeSeparator}${formatNum(currentUpper, upperStr)}${unit}`);

        if (progress < 1) {
          requestAnimationFrame(animateRange);
        }
      };

      requestAnimationFrame(animateRange);
      return;
    }

    // Normal single number count up
    const cleanValue = value.replace(/[~%+M \D]/g, (match) => {
      return match === "." ? "." : "";
    });
    
    const target = parseFloat(cleanValue);
    if (isNaN(target)) {
      setCount(value);
      return;
    }

    const startTime = performance.now();
    const animateSingle = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentCount = easeProgress * target;

      if (cleanValue.includes(".")) {
        setCount(currentCount.toFixed(1));
      } else {
        setCount(Math.floor(currentCount));
      }

      if (progress < 1) {
        requestAnimationFrame(animateSingle);
      }
    };

    requestAnimationFrame(animateSingle);
  }, [isInView, value, duration]);

  const displayValue = () => {
    if (!isInView) return "0";
    
    if (typeof count === "string" && (count.includes("-") || count.includes("–") || count.includes("—"))) {
      return count;
    }

    let prefix = value.startsWith("~") ? "~" : "";
    let cleanVal = value.replace(/^~/, "");
    
    if (cleanVal.includes("M+")) {
      return prefix + count + "M+";
    } else if (cleanVal.includes("M")) {
      return prefix + count + "M";
    } else if (cleanVal.includes("%")) {
      return prefix + count + "%";
    } else if (cleanVal.includes("t")) {
      return prefix + count + "t";
    } else if (cleanVal.includes("+")) {
      return prefix + count + "+";
    } else {
      return prefix + count + suffix;
    }
  };

  return (
    <span ref={ref} className="font-serif inline-block">
      {displayValue()}
    </span>
  );
}
