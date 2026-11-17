import {
  LOGO_PRESENTATION_TILT_DEFAULT_RADIUS_SCALE,
  LOGO_PRESENTATION_TILT_DEFAULT_STRENGTH_SCALE,
  MENGER_AUTOMATIC_PROBE_DEFAULT_SETTINGS,
  MENGER_HOVER_DEFAULT_REVEAL_RADIUS,
  MENGER_TYPE_GPU_DEFAULT_ANTIALIASING,
  MENGER_TYPE_GPU_DEFAULT_DEPTH,
  type HexColor,
  type LogoViewState,
  type MengerAutomaticProbeMotionSettings,
} from "@samebase/menger-sponge/settings";
import { lazy, Suspense, useState } from "react";

// The scene and TypeGPU load in their own chunk.
const MengerSponge = lazy(() =>
  import("@samebase/menger-sponge").then((module) => ({
    default: module.MengerSponge,
  })),
);

const fallbackSrc = "/menger-sponge.svg";
const backgroundColor: HexColor = "#ffffff";
const faceColors = {
  left: "#3178c6",
  right: "#111827",
  top: "#e5e7eb",
} satisfies Record<string, HexColor>;
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
        viewDragConfig={undefined}
      />
    </Suspense>
  );
}
