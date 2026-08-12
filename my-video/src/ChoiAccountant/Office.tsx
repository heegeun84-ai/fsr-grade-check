import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_SANS, FONT_SERIF } from "./theme";

export const OFFICE_DURATION = 150;

// Interior: 최봉호 세무사 working at his desk, seen right after the
// camera "passes through" the 2F window.
export const OfficeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // carry the push-in momentum: start slightly zoomed, settle to 1
  const settle = interpolate(frame, [0, 40], [1.14, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const drift = interpolate(frame, [0, OFFICE_DURATION], [0, -14]);

  // typing bob + animated bar chart on the monitor
  const typing = Math.sin(frame / 2.6) * 5;
  const headBob = Math.sin(frame / 9) * 3;
  const bars = [0.45, 0.7, 0.55, 0.85, 0.65].map((h, i) =>
    interpolate(frame, [14 + i * 7, 40 + i * 7], [0.12, h], {
      easing: Easing.out(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const steam = (Math.sin(frame / 11) + 1) / 2;

  const captionIn = spring({ frame: frame - 34, fps, config: { damping: 200 } });
  const caption2In = spring({ frame: frame - 58, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#EDF1F4" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${settle}) translateY(${drift}px)`,
          transformOrigin: "50% 45%",
        }}
      >
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ display: "block" }}>
          <defs>
            <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F4F6F8" />
              <stop offset="100%" stopColor="#DDE3E8" />
            </linearGradient>
            <linearGradient id="winSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8FC7EA" />
              <stop offset="100%" stopColor="#D8ECF7" />
            </linearGradient>
            <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9B99F" />
              <stop offset="100%" stopColor="#B3A188" />
            </linearGradient>
          </defs>

          {/* room */}
          <rect width={1080} height={1400} fill="url(#wall)" />
          <rect y={1400} width={1080} height={520} fill="url(#floor)" />

          {/* window with city view */}
          <rect x={110} y={150} width={860} height={660} rx={14} fill="#2A3138" />
          <rect x={132} y={172} width={816} height={616} fill="url(#winSky)" />
          <g fill="#8AA6BC">
            <rect x={170} y={520} width={90} height={268} />
            <rect x={290} y={430} width={120} height={358} />
            <rect x={450} y={560} width={80} height={228} />
            <rect x={560} y={470} width={130} height={318} />
            <rect x={730} y={540} width={100} height={248} />
            <rect x={860} y={480} width={70} height={308} />
          </g>
          <rect x={536} y={172} width={10} height={616} fill="#2A3138" />
          <rect x={132} y={172} width={816} height={70} fill="#EDEFF1" opacity={0.9} />
          <rect x={132} y={250} width={816} height={10} fill="#D3D8DC" />

          {/* wall plaque (above the monitor) + certificate (left wall) */}
          <rect x={565} y={838} width={420} height={100} rx={10} fill="#0E1B2C" />
          <text x={775} y={905} textAnchor="middle" fill="#F5F0E6" fontFamily={FONT_SERIF} fontSize={48} fontWeight={900} letterSpacing={6}>
            해솔세무회계
          </text>
          <rect x={110} y={850} width={170} height={130} rx={8} fill="#8D6E4B" />
          <rect x={122} y={862} width={146} height={106} fill="#FBF6E8" />
          <text x={195} y={906} textAnchor="middle" fill="#5A4A33" fontFamily={FONT_SANS} fontSize={20} fontWeight={700}>
            세무사 자격증
          </text>
          <text x={195} y={940} textAnchor="middle" fill="#8B7A5E" fontFamily={FONT_SANS} fontSize={17}>
            최 봉 호
          </text>

          {/* plant */}
          <rect x={950} y={1290} width={90} height={100} rx={10} fill="#A9552F" />
          <g fill="#3E8E5A">
            <ellipse cx={995} cy={1240} rx={26} ry={62} />
            <ellipse cx={960} cy={1258} rx={22} ry={52} transform="rotate(-24 960 1258)" />
            <ellipse cx={1030} cy={1258} rx={22} ry={52} transform="rotate(24 1030 1258)" />
          </g>

          {/* chair (behind the desk, below shoulder line) */}
          <rect x={225} y={1075} width={270} height={205} rx={26} fill="#20262D" />
          <rect x={295} y={1280} width={60} height={90} fill="#20262D" />

          {/* the accountant, typing */}
          <g transform={`translate(0 ${headBob})`}>
            {/* torso: navy suit */}
            <path d="M240 1260 Q245 1080 325 1058 L400 1050 Q470 1075 480 1260 Z" fill="#1E3A5F" />
            {/* shirt + tie */}
            <path d="M330 1062 L370 1056 L372 1140 L340 1140 Z" fill="#F6F8FA" />
            <path d="M348 1066 L362 1064 L360 1132 L350 1132 Z" fill="#2FA36B" />
            {/* head */}
            <circle cx={352} cy={990} r={62} fill="#F1C9A5" />
            {/* hair */}
            <path d="M290 980 Q292 918 352 916 Q414 918 414 982 Q400 940 352 938 Q306 940 290 980 Z" fill="#23262B" />
            {/* glasses */}
            <g stroke="#2A3138" strokeWidth={5} fill="rgba(255,255,255,0.55)">
              <rect x={310} y={974} width={38} height={28} rx={8} />
              <rect x={358} y={974} width={38} height={28} rx={8} />
              <line x1={348} y1={988} x2={358} y2={988} />
            </g>
            {/* ear + smile */}
            <path d="M330 1032 Q352 1044 374 1032" stroke="#B9855C" strokeWidth={5} fill="none" strokeLinecap="round" />
            {/* typing arm */}
            <g transform={`translate(0 ${typing})`}>
              <path d="M440 1120 Q510 1160 560 1238 L600 1252 Q530 1180 470 1108 Z" fill="#1E3A5F" />
              <circle cx={588} cy={1248} r={20} fill="#F1C9A5" />
            </g>
            {/* left arm resting */}
            <path d="M262 1130 Q250 1200 300 1246 L340 1252 Q290 1190 296 1120 Z" fill="#1E3A5F" />
            <circle cx={332} cy={1250} r={18} fill="#F1C9A5" />
          </g>

          {/* desk */}
          <rect x={60} y={1240} width={960} height={44} rx={10} fill="#6E4F33" />
          <rect x={90} y={1284} width={900} height={300} fill="#5C4129" />
          <rect x={90} y={1284} width={900} height={16} fill="#4C3520" />

          {/* monitor with growing bar chart (back of desk, facing viewer) */}
          <g>
            <rect x={560} y={960} width={330} height={230} rx={12} fill="#1B2127" />
            <rect x={575} y={975} width={300} height={200} fill="#0F1720" />
            {bars.map((b, i) => (
              <rect
                key={i}
                x={595 + i * 56}
                y={1155 - b * 160}
                width={38}
                height={b * 160}
                fill={i === 3 ? "#5BC98F" : "#2FA36B"}
                opacity={0.95}
              />
            ))}
            <rect x={585} y={1158} width={280} height={4} fill="#3A4652" />
            <rect x={700} y={1190} width={50} height={50} fill="#1B2127" />
            <rect x={640} y={1236} width={170} height={12} rx={6} fill="#10161C" />
          </g>

          {/* keyboard + papers + calculator + coffee on the desk */}
          <rect x={520} y={1250} width={250} height={26} rx={8} fill="#2A3138" />
          <g transform="rotate(-4 260 1220)">
            <rect x={150} y={1216} width={190} height={30} rx={4} fill="#FFFFFF" />
            <rect x={160} y={1202} width={190} height={30} rx={4} fill="#F2EFE6" />
            <rect x={170} y={1188} width={190} height={30} rx={4} fill="#FFFFFF" />
          </g>
          <rect x={830} y={1180} width={110} height={72} rx={10} fill="#2A3138" />
          <rect x={842} y={1190} width={86} height={22} rx={4} fill="#9FD9BC" />
          <g fill="#4A525B">
            {Array.from({ length: 6 }).map((_, i) => (
              <circle key={i} cx={856 + (i % 3) * 30} cy={1228 + Math.floor(i / 3) * 16} r={6} />
            ))}
          </g>
          <rect x={430} y={1198} width={62} height={54} rx={8} fill="#FFFFFF" />
          <rect x={490} y={1210} width={16} height={26} rx={8} fill="#FFFFFF" />
          <path
            d={`M450 1182 q 10 -${18 + steam * 10} 0 -34`}
            stroke="#B9C2CA"
            strokeWidth={6}
            fill="none"
            opacity={0.4 + steam * 0.4}
            strokeLinecap="round"
          />
        </svg>
      </AbsoluteFill>

      {/* captions */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 210,
          gap: 24,
        }}
      >
        <div
          style={{
            opacity: captionIn,
            transform: `translateY(${(1 - captionIn) * 40}px)`,
            fontFamily: FONT_SERIF,
            fontSize: 72,
            fontWeight: 900,
            color: "#F5F0E6",
            textShadow: "0 4px 18px rgba(14,27,44,0.85)",
          }}
        >
          세무사 최봉호
        </div>
        <div
          style={{
            opacity: caption2In,
            transform: `translateY(${(1 - caption2In) * 40}px)`,
            fontFamily: FONT_SANS,
            fontSize: 38,
            fontWeight: 700,
            color: "#FFFFFF",
            backgroundColor: "rgba(14,27,44,0.88)",
            padding: "18px 40px",
            borderRadius: 16,
            letterSpacing: 2,
          }}
        >
          기장 · 세금신고 · 절세, 직접 챙깁니다
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
