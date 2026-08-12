import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { FONT_SANS, FONT_SERIF } from "./theme";

// 1080x1920 illustrated exterior of the building (해솔세무회계, 송파).
// The camera starts as a wide drone shot, hovers, then pushes in fast
// toward the 2F office sign before the cut into the interior.

const GlassTower: React.FC = () => {
  const mullions = [];
  for (let i = 0; i <= 8; i++) {
    mullions.push(
      <rect
        key={`v${i}`}
        x={302 + i * 60}
        y={330}
        width={i % 4 === 0 ? 7 : 3}
        height={790}
        fill="#E6EFF4"
        opacity={0.55}
      />,
    );
  }
  const floors = [];
  for (let i = 1; i <= 6; i++) {
    floors.push(
      <rect
        key={`h${i}`}
        x={300}
        y={330 + i * 112}
        width={480}
        height={2.5}
        fill="#DAE6EC"
        opacity={0.45}
      />,
    );
  }
  return (
    <>
      {/* dark outer frame */}
      <rect x={258} y={175} width={564} height={1478} rx={10} fill="#262D35" />
      {/* rooftop signage band */}
      <rect x={278} y={195} width={524} height={120} rx={6} fill="#1B2127" />
      <text
        x={540}
        y={268}
        textAnchor="middle"
        fill="#C9D4DC"
        fontFamily={FONT_SANS}
        fontSize={40}
        fontWeight={700}
        letterSpacing={14}
      >
        LOND KOREA
      </text>
      {/* main glass curtain wall */}
      <rect x={300} y={330} width={480} height={790} fill="url(#glass)" />
      {mullions}
      {floors}
      {/* cloud reflections on the glass */}
      <ellipse cx={430} cy={520} rx={150} ry={46} fill="#FFFFFF" opacity={0.28} />
      <ellipse cx={650} cy={760} rx={180} ry={54} fill="#FFFFFF" opacity={0.2} />
      {/* concrete ledge above the sign floors */}
      <rect x={280} y={1120} width={520} height={34} rx={6} fill="#C7CCD2" />
      {/* 4F psychology-center strip sign */}
      <rect x={300} y={1158} width={480} height={46} rx={4} fill="#22272D" />
      <text
        x={540}
        y={1191}
        textAnchor="middle"
        fill="#CDE86A"
        fontFamily={FONT_SANS}
        fontSize={27}
        fontWeight={500}
      >
        드림 아동·성인 심리상담센터 407-8088 4F
      </text>
      {/* 2F office window with the 해솔세무회계 sign — the zoom target */}
      <rect x={300} y={1208} width={480} height={168} fill="url(#darkGlass)" />
      <rect x={300} y={1208} width={480} height={168} fill="none" stroke="#3A424B" strokeWidth={4} />
      <text
        x={540}
        y={1288}
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily={FONT_SERIF}
        fontSize={62}
        fontWeight={900}
        letterSpacing={16}
      >
        해솔세무회계
      </text>
      <text
        x={540}
        y={1344}
        textAnchor="middle"
        fill="#D8DEE5"
        fontFamily={FONT_SANS}
        fontSize={30}
        fontWeight={500}
        letterSpacing={4}
      >
        세무사 최봉호 · 02-582-8205
      </text>
      {/* NongHyup band */}
      <rect x={280} y={1382} width={520} height={60} fill="#F4F6F7" />
      <text
        x={430}
        y={1424}
        textAnchor="middle"
        fill="#0B6E3F"
        fontFamily={FONT_SANS}
        fontSize={34}
        fontWeight={700}
        letterSpacing={2}
      >
        NH NongHyup
      </text>
      <text
        x={660}
        y={1424}
        textAnchor="middle"
        fill="#F5A800"
        fontFamily={FONT_SANS}
        fontSize={30}
        fontWeight={700}
      >
        송파농협
      </text>
      {/* ground-floor storefront */}
      <rect x={290} y={1442} width={500} height={211} fill="#254458" />
      <rect x={470} y={1470} width={140} height={183} rx={4} fill="#183042" stroke="#7FA6BC" strokeWidth={4} />
      <rect x={320} y={1470} width={120} height={120} rx={4} fill="#2E5E7A" opacity={0.8} />
      <rect x={640} y={1470} width={120} height={120} rx={4} fill="#2E5E7A" opacity={0.8} />
      <text
        x={380}
        y={1545}
        textAnchor="middle"
        fill="#BFE0F0"
        fontFamily={FONT_SANS}
        fontSize={26}
        fontWeight={700}
      >
        365
      </text>
      <text
        x={700}
        y={1545}
        textAnchor="middle"
        fill="#BFE0F0"
        fontFamily={FONT_SANS}
        fontSize={22}
        fontWeight={500}
      >
        NH
      </text>
    </>
  );
};

const Surroundings: React.FC<{ frame: number }> = ({ frame }) => {
  const cloudDrift = frame * 0.35;
  return (
    <>
      {/* clouds */}
      <g opacity={0.9}>
        <ellipse cx={180 + cloudDrift * 0.5} cy={210} rx={130} ry={38} fill="#FFFFFF" opacity={0.85} />
        <ellipse cx={920 - cloudDrift * 0.3} cy={120} rx={160} ry={44} fill="#FFFFFF" opacity={0.7} />
        <ellipse cx={620 + cloudDrift * 0.2} cy={90} rx={110} ry={30} fill="#FFFFFF" opacity={0.6} />
      </g>
      {/* neighbor buildings */}
      <rect x={0} y={390} width={252} height={1263} fill="#96A1AC" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={20} y={430 + i * 130} width={212} height={80} fill="#7C8994" opacity={0.7} />
      ))}
      <rect x={828} y={520} width={252} height={1133} fill="#A6B0BA" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={850} y={560 + i * 150} width={210} height={90} fill="#8C98A3" opacity={0.7} />
      ))}
      {/* subway exit 4 */}
      <rect x={60} y={1470} width={170} height={183} fill="#4A525B" />
      <rect x={72} y={1484} width={64} height={64} rx={8} fill="#F5C518" />
      <text x={104} y={1532} textAnchor="middle" fill="#1B2127" fontFamily={FONT_SANS} fontSize={44} fontWeight={700}>
        4
      </text>
      <text x={150} y={1600} textAnchor="middle" fill="#E8ECF0" fontFamily={FONT_SANS} fontSize={26} fontWeight={700}>
        경찰병원
      </text>
      {/* street + sidewalk */}
      <rect x={0} y={1653} width={1080} height={267} fill="#68707A" />
      <rect x={0} y={1653} width={1080} height={60} fill="#98A0A8" />
      {/* pedestrians */}
      <g fill="#2A3138">
        <circle cx={430} cy={1700} r={16} />
        <rect x={414} y={1716} width={32} height={70} rx={12} />
        <circle cx={492} cy={1694} r={17} />
        <rect x={474} y={1712} width={36} height={78} rx={13} fill="#7A5C42" />
      </g>
    </>
  );
};

export const BuildingWorld: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ display: "block" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DBEE8" />
          <stop offset="70%" stopColor="#C8E6F6" />
          <stop offset="100%" stopColor="#E9F4FA" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C4E6F4" />
          <stop offset="45%" stopColor="#8FC2DE" />
          <stop offset="100%" stopColor="#6FA8CB" />
        </linearGradient>
        <linearGradient id="darkGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A242F" />
          <stop offset="100%" stopColor="#2C3B49" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky)" />
      <circle cx={880} cy={230} r={130} fill="#FFF6D8" opacity={0.55} />
      <Surroundings frame={frame} />
      <GlassTower />
    </svg>
  );
};

export const DRONE_DURATION = 210;

// Drone shot: hover 2s, then accelerate into the 2F sign.
export const DroneScene: React.FC = () => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 70, DRONE_DURATION], [1, 1.07, 7], {
    easing: Easing.bezier(0.6, 0.02, 0.72, 0.96),
    extrapolateRight: "clamp",
  });
  // drone hover wobble, damped as we get closer
  const wobbleX = (Math.sin(frame / 16) * 9) / zoom;
  const wobbleY = (Math.cos(frame / 22) * 7) / zoom;
  const rot = Math.sin(frame / 42) * 0.5 / zoom;
  const descend = interpolate(frame, [0, DRONE_DURATION], [-46, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: "clamp",
  });

  const titleIn = interpolate(frame, [8, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOut = interpolate(frame, [96, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(titleIn, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#7DBEE8" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${wobbleX}px, ${wobbleY + descend}px) rotate(${rot}deg) scale(${zoom})`,
          // zoom target: the 해솔세무회계 sign at (540, ~1290)
          transformOrigin: "50% 67.2%",
        }}
      >
        <BuildingWorld frame={frame} />
      </AbsoluteFill>

      {/* opening title */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 190,
          opacity: titleIn * titleOut,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#0E1B2C",
            background: "rgba(255,255,255,0.85)",
            padding: "14px 34px",
            borderRadius: 999,
          }}
        >
          송파 · 경찰병원역 4번 출구 앞
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT_SERIF,
            fontSize: 84,
            fontWeight: 900,
            color: "#FFFFFF",
            textShadow: "0 6px 30px rgba(14,27,44,0.55)",
            letterSpacing: 4,
          }}
        >
          세금 고민, 여기서 끝
        </div>
      </AbsoluteFill>

      {/* REC-style drone HUD, fades as we dive in */}
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [140, 175], [0.9, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          padding: 54,
          fontFamily: FONT_SANS,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundColor: "#E5484D",
              opacity: Math.sin(frame / 5) > 0 ? 1 : 0.25,
            }}
          />
          <span style={{ color: "#FFFFFF", fontSize: 30, fontWeight: 700, letterSpacing: 4, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
            DRONE VIEW
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
