import "./index.css";
import { Composition } from "remotion";
import { SockStyle, TOTAL_DURATION } from "./SockStyle";
import {
  ChoiAccountant,
  TOTAL_DURATION as CHOI_DURATION,
} from "./ChoiAccountant";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SockStyle"
        component={SockStyle}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ChoiAccountant"
        component={ChoiAccountant}
        durationInFrames={CHOI_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
