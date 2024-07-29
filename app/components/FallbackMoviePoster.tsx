import { memo } from "react";
import tinycolor from "tinycolor2";

export const stringToColour = (str: string) => {
  let hash = 0;

  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });

  let colour = "#";

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }

  return colour;
};

const generatePosition = (seed: number, max: number) => {
  const hashValue = Math.abs(Math.sin(seed) * 10000) % 1;
  return hashValue * max;
};

const generateRadius = (seed: number) => {
  const hashValue = Math.abs(Math.cos(seed) * 10000) % 1;
  return 50 + hashValue * 100;
};

const generateElements = (
  value: string,
  count: number,
  colors: string[],
  width: number,
  height: number
) => {
  let seed = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Array.from({ length: count }, (_, i) => {
    seed = Math.abs(Math.sin(seed) * 10000);

    return {
      x1: generatePosition(seed * 4, width),
      y1: generatePosition(seed * 5, height),
      x2: generatePosition(seed * 6, width),
      y2: generatePosition(seed * 7, height),
      r: generateRadius(seed),
      color: colors[i],
      opacity: ((seed % 50) + 10) / 100,
    };
  });
};

const getTextWrapGroups = (
  text: string,
  maxWidth: number,
  fontSize: number
) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = testLine.length * (fontSize * 0.6);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);

      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

interface FallbackMoviePosterProps {
  value: string;
  width?: number;
  height?: number;
}

const FallbackMoviePoster = memo(
  ({ value, width = 500, height = 750 }: FallbackMoviePosterProps) => {
    const baseColor = stringToColour(value);

    const circleColors = tinycolor(baseColor)
      .monochromatic(5)
      .map((c) => c.complement().toHexString());
    const lineColors = tinycolor(baseColor)
      .monochromatic(3)
      .map((c) => c.spin(20).toHexString());

    const circles = generateElements(value, 5, circleColors, width, height);
    const lines = generateElements(value, 3, lineColors, width, height);

    const textPadding = 20;
    const maxTextWidth = width - 2 * textPadding;

    const fontSize = 24;
    const lineHeight = fontSize * 1.2;
    const wrappedText = getTextWrapGroups(value, maxTextWidth, fontSize);

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <filter id="drop-shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={width} height={height} fill={baseColor} />
        {circles.map((circle, index) => (
          <circle
            key={`circle-${index}`}
            cx={circle.x1}
            cy={circle.y2}
            r={circle.r}
            fill={circle.color}
            opacity={circle.opacity}
          />
        ))}
        {lines.map((line, index) => (
          <line
            key={`line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth="3"
            opacity={line.opacity}
          />
        ))}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#fff"
          fontSize={fontSize}
          fontWeight="bold"
          filter="url(#drop-shadow)"
        >
          {wrappedText.map((line, index) => (
            <tspan
              key={index}
              x="50%"
              dy={
                index === 0
                  ? (-(wrappedText.length - 1) * lineHeight) / 2
                  : lineHeight
              }
            >
              {line}
            </tspan>
          ))}
        </text>
      </svg>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.width === nextProps.width &&
      prevProps.height === nextProps.height
    );
  }
);

FallbackMoviePoster.displayName = "FallbackMoviePoster";

export default FallbackMoviePoster;
