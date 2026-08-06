import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  FrameBorder,
  Pinstripes,
  Vignette,
  Watermark,
} from "./components";
import { Intro, MessageScene, Outro, TipScene } from "./scenes";
import { COLORS } from "./theme";

// 30s @ 30fps = 900 frames
const INTRO = 120;
const TIP = 165;
const MESSAGE = 165;
const OUTRO = 120;

export const TOTAL_DURATION = INTRO + TIP * 3 + MESSAGE + OUTRO;

export const SockStyle: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Pinstripes />
      <Vignette />

      <Sequence durationInFrames={INTRO}>
        <Intro duration={INTRO} />
      </Sequence>

      <Sequence from={INTRO} durationInFrames={TIP}>
        <TipScene
          duration={TIP}
          index={1}
          title={
            <>
              양말은 바지 색에
              <br />
              맞추세요
            </>
          }
          body={
            <>
              구두가 아니라 바지와 톤을 맞추면
              <br />
              다리 라인이 길고 단정해 보입니다.
            </>
          }
        />
      </Sequence>

      <Sequence from={INTRO + TIP} durationInFrames={TIP}>
        <TipScene
          duration={TIP}
          index={2}
          title={
            <>
              앉아도 맨살이
              <br />
              보이지 않게
            </>
          }
          body={
            <>
              기본은 미드카프 이상의 길이.
              <br />
              바지 밑단 사이 맨살은 감점 요인입니다.
            </>
          }
        />
      </Sequence>

      <Sequence from={INTRO + TIP * 2} durationInFrames={TIP}>
        <TipScene
          duration={TIP}
          index={3}
          title={
            <>
              패턴은 한 끗만,
              <br />
              은은하게
            </>
          }
          body={
            <>
              솔리드, 헤링본, 잔잔한 도트까지.
              <br />
              화려한 색은 주말을 위해 아껴두세요.
            </>
          }
        />
      </Sequence>

      <Sequence from={INTRO + TIP * 3} durationInFrames={MESSAGE}>
        <MessageScene duration={MESSAGE} />
      </Sequence>

      <Sequence from={INTRO + TIP * 3 + MESSAGE} durationInFrames={OUTRO}>
        <Outro duration={OUTRO} />
      </Sequence>

      <FrameBorder />
      <Watermark />
    </AbsoluteFill>
  );
};
