import React from "react";
import { Pose } from "../lib/camera";
import { arrive, mix, move, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { LF } from "../lib/time";
import { FONT } from "../fonts";
import { Pointer } from "./Icons";
import { Place } from "./Place";

const BW = 840;
const BH = 170;
const CW = 980;
const CH = 880;

const Rise: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
  <div style={{ overflow: "hidden", paddingBottom: 6 }}>
    <div style={{ transform: `translateY(${(1 - t) * 110}%)` }}>{children}</div>
  </div>
);

/** The Book button (pressed on "free"), which blooms into the end card. */
export const EndCard: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const free = LF("free");
  const cta = LF("cta");
  if (frame < free.start - 10) return null;

  // E2: the button unfolds out of the folded map
  const born = ramp(frame, free.start - 10, free.start + 14, arrive);
  const pointer = ramp(frame, free.start + 6, free.accent - 3, move);
  const press = ramp(frame, free.accent - 3, free.accent + 12);
  const pressed = frame >= free.accent - 1;
  const ripple = ramp(frame, free.accent, free.accent + 26);
  const bloom = ramp(frame, cta.start - 18, cta.start + 14, arrive);
  const item = (i: number) => ramp(frame, cta.start + 4 + i * 5, cta.start + 22 + i * 5);

  return (
    <>
      {bloom < 1 ? (
        <Place pose={pose} at={[0, 0.3, 0]} w={BW} h={BH} grow={mix(0.15, 1, born) * mix(1, 0.7, bloom)} opacity={1 - ramp(frame, cta.start - 6, cta.start + 6)}>
          <div style={{ position: "absolute", inset: 0, borderRadius: BH / 2, background: COLOR.accent, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${1 - 0.05 * Math.sin(press * Math.PI)})`, boxShadow: `0 ${pressed ? 10 : 24}px 60px rgba(167,20,76,0.35), inset 0 2px 0 rgba(255,255,255,0.3)`,
            fontFamily: FONT.hero, fontWeight: 800, fontSize: 62, letterSpacing: "-0.02em", color: COLOR.white, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 600 - 400 * ripple, top: 110 - 400 * ripple, width: 800 * ripple, height: 800 * ripple, borderRadius: "50%",
              background: `rgba(255,255,255,${0.35 * (1 - ripple)})` }} />
            Book a free placement
          </div>
          {pointer > 0 && bloom < 0.3 ? (
            <div style={{ position: "absolute", left: mix(900, 600, pointer), top: mix(330, 110, pointer), transformOrigin: "0 0",
              transform: `scale(${1 - 0.12 * Math.sin(press * Math.PI)})` }}>
              <Pointer size={96} />
            </div>
          ) : null}
        </Place>
      ) : null}

      {bloom > 0 ? (
        <Place pose={pose} at={[0, 0.2, 0]} w={CW} h={CH}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 48, overflow: "hidden", background: COLOR.white,
            clipPath: `circle(${bloom * 75}% at 50% 50%)`, boxShadow: "0 60px 160px rgba(80,40,30,0.25)",
            display: "flex", flexDirection: "column", alignItems: "center", padding: "70px 60px 0" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 18, background: COLOR.accent }} />
            <Rise t={item(0)}>
              <div style={{ fontFamily: FONT.hero, fontWeight: 900, fontSize: 210, letterSpacing: "-0.05em", lineHeight: 0.95, color: COLOR.accent }}>S.A.M</div>
            </Rise>
            <Rise t={item(1)}>
              <div style={{ fontFamily: FONT.accent, fontStyle: "italic", fontSize: 68, color: COLOR.ink, marginTop: 8 }}>Seriously Addictive Mathematics</div>
            </Rise>
            <div style={{ width: `${70 * ramp(frame, cta.start + 12, cta.start + 34, move)}%`, height: 3, background: "rgba(30,27,46,0.15)", margin: "34px 0 30px" }} />
            <Rise t={item(3)}>
              <div style={{ fontFamily: FONT.hero, fontWeight: 800, fontSize: 56, letterSpacing: "-0.02em", color: COLOR.ink }}>J3 Mall, Al Wasl Rd</div>
            </Rise>
            <Rise t={item(4)}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14 }}>
                <span style={{ fontFamily: FONT.hero, fontWeight: 800, fontSize: 56, letterSpacing: "-0.02em", color: COLOR.ink }}>AB Centre</span>
                <span style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 42, color: COLOR.white, background: COLOR.accent, borderRadius: 28, padding: "6px 20px" }}>opening soon</span>
              </div>
            </Rise>
            <Rise t={item(5)}>
              <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 54, color: COLOR.ink, marginTop: 40 }}>+971 4 375 5154</div>
            </Rise>
            <Rise t={item(6)}>
              <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 54, color: COLOR.accent, marginTop: 10 }}>@sam.j3malldubai</div>
            </Rise>
          </div>
        </Place>
      ) : null}
    </>
  );
};
