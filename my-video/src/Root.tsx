import "./index.css";
import { Composition } from "remotion";
import { SockStyle, TOTAL_DURATION } from "./SockStyle";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SockStyle"
      component={SockStyle}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
