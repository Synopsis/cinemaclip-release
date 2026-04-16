import FramingDiagram from "./FramingDiagram.jsx";
import AngleDiagram from "./AngleDiagram.jsx";
import HeightDiagram from "./HeightDiagram.jsx";
import CompositionDiagram from "./CompositionDiagram.jsx";
import ShotTypeDiagram from "./ShotTypeDiagram.jsx";
import LightingDirectionDiagram from "./LightingDirectionDiagram.jsx";
import SaturationDiagram from "./SaturationDiagram.jsx";
import ColorContrastDiagram from "./ColorContrastDiagram.jsx";
import ColorTonesDiagram from "./ColorTonesDiagram.jsx";
import ColorTheoryDiagram from "./ColorTheoryDiagram.jsx";
import BinaryDiagram from "./BinaryDiagram.jsx";
import EdgeLightDiagram from "./EdgeLightDiagram.jsx";
import SilhouetteDiagram from "./SilhouetteDiagram.jsx";
import SymmetryDiagram from "./SymmetryDiagram.jsx";
import DutchAngleDiagram from "./DutchAngleDiagram.jsx";
import OTSDiagram from "./OTSDiagram.jsx";
import LightCastDiagram from "./LightCastDiagram.jsx";
import LightContrastDiagram from "./LightContrastDiagram.jsx";
import ShotFocusDiagram from "./ShotFocusDiagram.jsx";
import ShotLensDiagram from "./ShotLensDiagram.jsx";
import GenericSelector from "./GenericSelector.jsx";

export {
  FramingDiagram,
  AngleDiagram,
  HeightDiagram,
  CompositionDiagram,
  ShotTypeDiagram,
  LightingDirectionDiagram,
  SaturationDiagram,
  ColorContrastDiagram,
  ColorTonesDiagram,
  ColorTheoryDiagram,
  BinaryDiagram,
  EdgeLightDiagram,
  SilhouetteDiagram,
  SymmetryDiagram,
  DutchAngleDiagram,
  OTSDiagram,
  LightCastDiagram,
  LightContrastDiagram,
  ShotFocusDiagram,
  ShotLensDiagram,
  GenericSelector,
};

export const DIAGRAM_MAP = {
  framing: FramingDiagram,
  angle: AngleDiagram,
  height: HeightDiagram,
  composition: CompositionDiagram,
  "shot-type": ShotTypeDiagram,
  "lighting-direction": LightingDirectionDiagram,
  saturation: SaturationDiagram,
  "color-contrast": ColorContrastDiagram,
  "color-tones": ColorTonesDiagram,
  "color-theory": ColorTheoryDiagram,
  "light-cast": LightCastDiagram,
  "light-contrast": LightContrastDiagram,
  "shot-focus": ShotFocusDiagram,
  "shot-lens": ShotLensDiagram,
  "edge-light": EdgeLightDiagram,
  silhouette: SilhouetteDiagram,
  symmetry: SymmetryDiagram,
  "dutch-angle": DutchAngleDiagram,
  ots: OTSDiagram,
  generic: GenericSelector,
};
