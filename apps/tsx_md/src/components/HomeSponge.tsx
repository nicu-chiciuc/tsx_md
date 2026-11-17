import {
  LOGO_PRESENTATION_TILT_DEFAULT_RADIUS_SCALE,
  LOGO_PRESENTATION_TILT_DEFAULT_STRENGTH_SCALE,
} from "@samebase/logo-model/logo-presentation-tilt";
import type { LogoViewState } from "@samebase/logo-model/logo-view-drag";
import { LOGO_VIEW_SNAP_DRAG_CONFIG } from "@samebase/logo-model/logo-view-snap";
import {
  MENGER_AUTOMATIC_PROBE_DEFAULT_SETTINGS,
  type MengerAutomaticProbeMotionSettings,
} from "@samebase/logo-model/menger-automatic-probe";
import { MENGER_HOVER_DEFAULT_REVEAL_RADIUS } from "@samebase/logo-model/menger-hover";
import type { HexColor } from "@samebase/logo-model/menger-sponge";
import {
  MENGER_TYPE_GPU_DEFAULT_ANTIALIASING,
  MENGER_TYPE_GPU_DEFAULT_DEPTH,
} from "@samebase/logo-model/menger-type-gpu-settings";
import { lazy, Suspense, useEffect, useState } from "react";

// The scene and TypeGPU load in their own chunk.
const MengerSponge = lazy(() =>
  import("@samebase/logo-model/menger-sponge").then((module) => ({
    default: module.MengerSponge,
  })),
);

const fallbackSrc = "/menger-sponge.svg";
const backgroundColor: HexColor = "#ffffff";
// The hue turns once every 40 seconds. Each face keeps its own saturation
// and lightness, so the top stays light and the right face stays dark.
// The first frame is the TypeScript blue of the static image.
const hueTurnMilliseconds = 40_000;
const startHue = 212;

function hslToHex(
  hue: number,
  saturation: number,
  lightness: number,
): HexColor {
  const s = saturation / 100;
  const l = lightness / 100;
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => {
    const k = (n + hue / 30) % 12;
    const value = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

function faceColorsAt(hue: number) {
  return {
    left: hslToHex(hue, 60, 48),
    right: hslToHex(hue, 39, 11),
    top: hslToHex(hue, 13, 91),
  };
}

function useCyclingFaceColors() {
  const [faceColors, setFaceColors] = useState(() => faceColorsAt(startHue));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const hue = startHue + ((now - start) / hueTurnMilliseconds) * 360;
      const next = faceColorsAt(hue % 360);
      // A new object only when a color changes, so React skips the rest.
      setFaceColors((current) =>
        current.left === next.left &&
        current.right === next.right &&
        current.top === next.top
          ? current
          : next,
      );
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return faceColors;
}

const initialView: LogoViewState = {
  elevationDegrees: 35.26438968,
  rotationDegrees: 45,
};

const {
  landingSize: _landingSize,
  showPath: _showPath,
  ...probeMotionDefaults
} = MENGER_AUTOMATIC_PROBE_DEFAULT_SETTINGS;

function readAutomaticProbe(): MengerAutomaticProbeMotionSettings {
  const cannotHover = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
  ).matches;
  return { ...probeMotionDefaults, enabled: cannotHover };
}

export function HomeSponge() {
  const [view, setView] = useState(initialView);
  const [automaticProbe] = useState(readAutomaticProbe);
  const faceColors = useCyclingFaceColors();

  return (
    <Suspense
      fallback={
        <img
          alt=""
          aria-hidden="true"
          className="block size-full object-contain p-0.5"
          src={fallbackSrc}
        />
      }
    >
      <MengerSponge
        antialiasing={MENGER_TYPE_GPU_DEFAULT_ANTIALIASING}
        automaticProbe={automaticProbe}
        backgroundColor={backgroundColor}
        cameraFrustumPadding={1}
        depth={MENGER_TYPE_GPU_DEFAULT_DEPTH}
        elevationDegrees={view.elevationDegrees}
        faceColors={faceColors}
        fallbackSrc={fallbackSrc}
        onInteractionEnd={setView}
        onRenderUnavailable={() => {}}
        onViewChange={setView}
        performanceMeasurementEnabled={false}
        pointerTiltEnabled={!automaticProbe.enabled}
        pointerTiltRadiusScale={LOGO_PRESENTATION_TILT_DEFAULT_RADIUS_SCALE}
        pointerTiltStrengthScale={LOGO_PRESENTATION_TILT_DEFAULT_STRENGTH_SCALE}
        resolutionScale={1}
        revealRadius={MENGER_HOVER_DEFAULT_REVEAL_RADIUS}
        rotationDegrees={view.rotationDegrees}
        viewDragConfig={LOGO_VIEW_SNAP_DRAG_CONFIG}
      />
    </Suspense>
  );
}
