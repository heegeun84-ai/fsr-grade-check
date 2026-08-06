import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Diamond,
  FadeUp,
  GoldRule,
  OrnamentDivider,
  SceneShell,
} from "./components";
import { COLORS, FONT_SANS, FONT_SERIF, PADDING_X } from "./theme";

const overlineStyle: React.CSSProperties = {
  fontFamily: FONT_SANS,
  fontWeight: 500,
  fontSize: 26,
  letterSpacing: "0.38em",
  color: COLORS.gold,
};

const SockIllustration: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [delay, delay + 45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 40,
  });
  const detailOpacity = interpolate(frame, [delay + 40, delay + 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <svg
      width={170}
      height={210}
      viewBox="0 0 200 250"
      fill="none"
      style={{ transform: `scale(${0.92 + scale * 0.08})` }}
    >
      <path
        d="M70 20 H130 V150 C130 168 138 178 152 185 C170 194 182 205 181 219 C180 234 167 241 152 240 H96 C82 240 70 230 70 214 V20 Z"
        stroke={COLORS.gold}
        strokeWidth={3.5}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw}
      />
      <g opacity={detailOpacity} stroke={COLORS.gold} strokeWidth={2.5}>
        <path d="M70 54 H130" />
        <path d="M86 27 V48" opacity={0.55} />
        <path d="M100 27 V48" opacity={0.55} />
        <path d="M114 27 V48" opacity={0.55} />
        <path d="M70 190 C86 192 96 202 97 218" opacity={0.55} />
      </g>
    </svg>
  );
};

export const Intro: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <SceneShell duration={duration}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 44,
          paddingLeft: PADDING_X,
          paddingRight: PADDING_X,
        }}
      >
        <FadeUp delay={4} dist={24}>
          <SockIllustration delay={6} />
        </FadeUp>
        <FadeUp delay={20}>
          <div style={overlineStyle}>BUSINESS STYLE GUIDE</div>
        </FadeUp>
        <FadeUp delay={28}>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 900,
              fontSize: 78,
              lineHeight: 1.4,
              color: COLORS.ivory,
              margin: 0,
              wordBreak: "keep-all",
            }}
          >
            정장 양말,
            <br />
            제대로 신고 계신가요?
          </h1>
        </FadeUp>
        <OrnamentDivider delay={44} />
        <FadeUp delay={52}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 400,
              fontSize: 38,
              letterSpacing: "0.04em",
              color: COLORS.body,
            }}
          >
            센스가 갈리는 30초, 3가지 룰
          </div>
        </FadeUp>
      </AbsoluteFill>
    </SceneShell>
  );
};

const TipProgress: React.FC<{ current: number }> = ({ current }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 150,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      {[1, 2, 3].map((n) => (
        <React.Fragment key={n}>
          {n > 1 && (
            <div
              style={{ width: 70, height: 1, backgroundColor: COLORS.goldDim }}
            />
          )}
          <Diamond size={11} filled={n === current} />
        </React.Fragment>
      ))}
    </div>
  );
};

export const TipScene: React.FC<{
  duration: number;
  index: number;
  title: React.ReactNode;
  body: React.ReactNode;
}> = ({ duration, index, title, body }) => {
  const frame = useCurrentFrame();
  const num = String(index).padStart(2, "0");
  const ghostY = interpolate(frame, [0, duration], [30, -50]);
  return (
    <SceneShell duration={duration}>
      <div
        style={{
          position: "absolute",
          top: 130,
          right: -20,
          fontFamily: FONT_SERIF,
          fontWeight: 900,
          fontSize: 430,
          lineHeight: 1,
          color: "rgba(200,164,92,0.09)",
          transform: `translateY(${ghostY}px)`,
        }}
      >
        {num}
      </div>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          paddingLeft: PADDING_X,
          paddingRight: PADDING_X,
          gap: 46,
        }}
      >
        <FadeUp delay={6}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={overlineStyle}>RULE {num}</div>
            <div
              style={{ width: 90, height: 1.5, backgroundColor: COLORS.goldDim }}
            />
          </div>
        </FadeUp>
        <FadeUp delay={14}>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 900,
              fontSize: 92,
              lineHeight: 1.3,
              color: COLORS.ivory,
              margin: 0,
              wordBreak: "keep-all",
            }}
          >
            {title}
          </h2>
        </FadeUp>
        <GoldRule delay={26} width={72} />
        <FadeUp delay={32}>
          <p
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 400,
              fontSize: 41,
              lineHeight: 1.75,
              color: COLORS.body,
              margin: 0,
            }}
          >
            {body}
          </p>
        </FadeUp>
      </AbsoluteFill>
      <TipProgress current={index} />
    </SceneShell>
  );
};

export const MessageScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, 1.045], {
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <SceneShell duration={duration}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 54,
          transform: `scale(${scale})`,
        }}
      >
        <FadeUp delay={8}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 400,
              fontSize: 36,
              letterSpacing: "0.06em",
              color: COLORS.muted,
            }}
          >
            보이지 않는 1%가 인상을 완성합니다
          </div>
        </FadeUp>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1.42,
            color: COLORS.ivory,
          }}
        >
          <FadeUp delay={24}>신뢰는</FadeUp>
          <FadeUp delay={38}>
            <span style={{ color: COLORS.goldBright }}>디테일</span>에서
          </FadeUp>
          <FadeUp delay={52}>시작됩니다</FadeUp>
        </div>
        <OrnamentDivider delay={72} />
      </AbsoluteFill>
    </SceneShell>
  );
};

export const Outro: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <SceneShell duration={duration}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 46,
          paddingLeft: PADDING_X,
          paddingRight: PADDING_X,
        }}
      >
        <FadeUp delay={4} dist={24}>
          <Diamond size={14} />
        </FadeUp>
        <FadeUp delay={10}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 600,
              fontSize: 66,
              letterSpacing: "0.3em",
              paddingLeft: "0.3em",
              color: COLORS.ivory,
            }}
          >
            MDRT MINUTE
          </div>
        </FadeUp>
        <FadeUp delay={20}>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontWeight: 400,
              fontSize: 36,
              letterSpacing: "0.05em",
              color: COLORS.body,
            }}
          >
            매일 1분, 완성되는 비즈니스 센스
          </div>
        </FadeUp>
        <FadeUp delay={34} dist={30}>
          <div
            style={{
              marginTop: 26,
              border: `1.5px solid ${COLORS.gold}`,
              padding: "28px 54px",
              fontFamily: FONT_SANS,
              fontWeight: 500,
              fontSize: 33,
              letterSpacing: "0.08em",
              color: COLORS.goldBright,
            }}
          >
            팔로우하고 다음 팁 받아보기
          </div>
        </FadeUp>
      </AbsoluteFill>
    </SceneShell>
  );
};
