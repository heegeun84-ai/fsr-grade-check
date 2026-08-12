import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DroneScene, DRONE_DURATION } from "./Building";
import { OfficeScene, OFFICE_DURATION } from "./Office";
import { COLORS, FONT_SANS, FONT_SERIF } from "./theme";

// 15s @ 30fps = 450 frames, 1080x1920 (9:16 Shorts)
const OUTRO_DURATION = 90;
export const TOTAL_DURATION = DRONE_DURATION + OFFICE_DURATION + OUTRO_DURATION; // 450

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 } });

  const s1 = pop(0);
  const s2 = pop(8);
  const s3 = pop(16);
  const s4 = pop(26);

  const pulse = 1 + Math.sin(frame / 7) * 0.02;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.navy,
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          opacity: s1,
          transform: `translateY(${(1 - s1) * 30}px)`,
          fontFamily: FONT_SANS,
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: 8,
          color: COLORS.goldBright,
        }}
      >
        송파 · 경찰병원역 4번 출구 앞 2F
      </div>

      <div
        style={{
          opacity: s2,
          transform: `translateY(${(1 - s2) * 30}px)`,
          fontFamily: FONT_SERIF,
          fontSize: 108,
          fontWeight: 900,
          color: COLORS.ivory,
          letterSpacing: 6,
        }}
      >
        해솔세무회계
      </div>

      <div
        style={{
          opacity: s2,
          fontFamily: FONT_SANS,
          fontSize: 40,
          fontWeight: 700,
          color: COLORS.body,
          letterSpacing: 4,
        }}
      >
        세무사 최봉호
      </div>

      <div
        style={{
          opacity: s3,
          transform: `translateY(${(1 - s3) * 30}px) scale(${pulse})`,
          marginTop: 26,
          fontFamily: FONT_SANS,
          fontSize: 66,
          fontWeight: 700,
          color: COLORS.navyDeep,
          backgroundColor: COLORS.greenBright,
          padding: "26px 64px",
          borderRadius: 999,
          letterSpacing: 3,
        }}
      >
        ☎ 02-582-8205
      </div>

      <div
        style={{
          opacity: s4,
          transform: `translateY(${(1 - s4) * 30}px)`,
          fontFamily: FONT_SANS,
          fontSize: 32,
          fontWeight: 500,
          color: COLORS.muted,
        }}
      >
        상담 예약은 전화 한 통이면 충분합니다
      </div>
    </AbsoluteFill>
  );
};

export const ChoiAccountant: React.FC = () => {
  const frame = useCurrentFrame();

  // white "through the glass" flash around the drone → office cut
  const flash = interpolate(
    frame,
    [DRONE_DURATION - 18, DRONE_DURATION - 2, DRONE_DURATION + 14],
    [0, 1, 0],
    {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <Sequence durationInFrames={DRONE_DURATION}>
        <DroneScene />
      </Sequence>

      <Sequence from={DRONE_DURATION} durationInFrames={OFFICE_DURATION}>
        <OfficeScene />
      </Sequence>

      <Sequence from={DRONE_DURATION + OFFICE_DURATION} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>

      {flash > 0 && (
        <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: flash }} />
      )}
    </AbsoluteFill>
  );
};
