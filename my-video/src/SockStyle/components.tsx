import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_SANS } from "./theme";

export const Pinstripes: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(244,240,230,0.03) 0px, rgba(244,240,230,0.03) 1px, transparent 1px, transparent 18px)",
      }}
    />
  );
};

export const Vignette: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 50% 40%, rgba(244,240,230,0.05), transparent 60%), radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)",
      }}
    />
  );
};

export const FrameBorder: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 36,
          border: `1.5px solid rgba(200,164,92,0.55)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 48,
          border: `1px solid rgba(200,164,92,0.2)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Watermark: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT_SANS,
        fontWeight: 500,
        fontSize: 21,
        letterSpacing: "0.45em",
        color: "rgba(244,240,230,0.4)",
      }}
    >
      MDRT MINUTE
    </div>
  );
};

export const SceneShell: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 12, duration - 12, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const FadeUp: React.FC<{
  delay: number;
  dist?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, dist = 46, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 34,
  });
  const opacity = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - progress) * dist}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const GoldRule: React.FC<{ delay: number; width: number }> = ({
  delay,
  width,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 36,
  });
  return (
    <div
      style={{
        width,
        height: 3,
        backgroundColor: COLORS.gold,
        transform: `scaleX(${progress})`,
        transformOrigin: "left center",
      }}
    />
  );
};

export const Diamond: React.FC<{
  size?: number;
  filled?: boolean;
  color?: string;
}> = ({ size = 10, filled = true, color = COLORS.gold }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: filled ? color : "transparent",
        border: filled ? "none" : `1.5px solid ${color}`,
        transform: "rotate(45deg)",
      }}
    />
  );
};

export const OrnamentDivider: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 36,
  });
  const opacity = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity,
      }}
    >
      <div
        style={{
          width: 120,
          height: 1.5,
          backgroundColor: COLORS.goldDim,
          transform: `scaleX(${progress})`,
          transformOrigin: "right center",
        }}
      />
      <Diamond size={9} />
      <div
        style={{
          width: 120,
          height: 1.5,
          backgroundColor: COLORS.goldDim,
          transform: `scaleX(${progress})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};
