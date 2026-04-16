// ─── Benchmark Accuracy Data ─────────────────────────────────────────────────
// CinemaCLIP vs 7 CLIP models + 2 VLMs across 19 cinematographic categories.
// Array order: [random, siglip2-gopt, siglip2-so400m, dfn-vit-l, openai-vit-l, mobileclip, metaclip, dfn-vit-h, qwen3-4b, qwen3-8b, cinemaclip]

export const BENCHMARK_MODELS = [
  { id: "random", name: "Random Baseline", type: "baseline" },
  { id: "siglip2-gopt", name: "SigLIP2 ViT-gopt", arch: "ViT-gopt-16-SigLIP2-384", pretrained: "webli", type: "competitor" },
  { id: "siglip2-so400m", name: "SigLIP2 SO400M", arch: "ViT-SO400M-16-SigLIP2-384", pretrained: "webli", type: "competitor" },
  { id: "dfn-vit-l", name: "DFN ViT-L-14", arch: "ViT-L-14", pretrained: "dfn2b_s39b", type: "competitor" },
  { id: "openai-vit-l", name: "OpenAI ViT-L-14", arch: "ViT-L-14", pretrained: "openai", type: "competitor" },
  { id: "mobileclip", name: "MobileCLIP-S1", arch: "MobileCLIP-S1", pretrained: "datacompdr", type: "competitor" },
  { id: "metaclip", name: "MetaCLIP PE-bigG", arch: "PE-Core-bigG-14-448", pretrained: "meta", type: "competitor" },
  { id: "dfn-vit-h", name: "DFN ViT-H-14", arch: "ViT-H-14-378-quickgelu", pretrained: "dfn5b", type: "competitor" },
  { id: "qwen3-4b", name: "Qwen3-VL 4B", arch: "Qwen3-VL-4B-Instruct", type: "competitor" },
  { id: "qwen3-8b", name: "Qwen3-VL 8B", arch: "Qwen3-VL-8B-Instruct", type: "competitor" },
  { id: "cinemaclip", name: "CinemaCLIP", arch: "MobileCLIP-S1", pretrained: "CinemaCLIP", type: "ours" },
];

// Array order: [random, siglip2-gopt, siglip2-so400m, dfn-vit-l, openai-vit-l, mobileclip, metaclip, dfn-vit-h, qwen3-4b, qwen3-8b, cinemaclip, cinemaclip-classifier]
// Real data from chart-data/category_specific_accuracy.csv
// null = classifier data not available for that category
export const BENCHMARK_DATA = {
  "shot-framing":   [0.067, 0.098, 0.073, 0.33, 0.235, 0.239, 0.249, 0.336, 0.464, 0.436, 0.792, 0.838],
  "shot-type":      [0.143, 0.297, 0.465, 0.567, 0.365, 0.357, 0.404, 0.528, 0.839, 0.733, 0.818, 0.905],
  "ots":            [0.5, 0.512, 0.505, 0.421, 0.739, 0.603, 0.57, 0.532, 0.918, 0.913, 0.92, 0.955],
  "composition":    [0.2, 0.114, 0.314, 0.252, 0.213, 0.22, 0.243, 0.278, 0.606, 0.529, 0.955, 0.96],
  "symmetry":       [0.5, 0.824, 0.46, 0.249, 0.54, 0.393, 0.78, 0.766, 0.883, 0.878, 0.883, 0.929],
  "camera-angle":   [0.125, 0.172, 0.213, 0.259, 0.19, 0.196, 0.137, 0.28, 0.451, 0.479, 0.734, 0.823],
  "camera-height":  [0.143, 0.239, 0.296, 0.336, 0.289, 0.24, 0.337, 0.376, 0.525, 0.498, 0.905, 0.918],
  "dutch-angle":    [0.5, 0.687, 0.476, 0.259, 0.384, 0.566, 0.445, 0.273, 0.632, 0.708, 0.619, 0.785],
  "saturation":     [0.333, 0.318, 0.333, 0.468, 0.581, 0.358, 0.618, 0.551, 0.652, 0.738, 0.826, 0.826],
  "color-contrast": [0.333, 0.252, 0.577, 0.371, 0.494, 0.387, 0.331, 0.34, 0.543, 0.371, 0.896, 0.868],
  "color-tones":    [0.2, 0.177, 0.24, 0.472, 0.52, 0.557, 0.502, 0.585, 0.656, 0.623, 0.86, 0.865],
  "color-theory":   [0.333, 0.317, 0.313, 0.477, 0.507, 0.473, 0.517, 0.547, 0.52, 0.58, 0.713, 0.727],
  "light-direction":[0.125, 0.171, 0.071, 0.218, 0.217, 0.288, 0.278, 0.147, 0.0, 0.0, 0.666, null],
  "light-cast":     [0.25, 0.182, 0.378, 0.228, 0.288, 0.357, 0.293, 0.254, 0.484, 0.538, 0.859, 0.904],
  "light-contrast": [0.25, 0.376, 0.484, 0.394, 0.326, 0.39, 0.355, 0.353, 0.506, 0.523, 0.939, 0.953],
  "edge-light":     [0.5, 0.256, 0.26, 0.212, 0.416, 0.34, 0.316, 0.224, 0.468, 0.568, 0.876, 0.904],
  "silhouette":     [0.5, 0.789, 0.462, 0.435, 0.674, 0.584, 0.671, 0.666, 0.540, 0.644, 0.884, 0.931],
  "shot-focus":     [0.2, 0.126, 0.482, 0.373, 0.244, 0.313, 0.312, 0.329, 0.239, 0.247, 0.713, 0.712],
  "shot-lens":      [0.167, 0.176, 0.301, 0.257, 0.345, 0.301, 0.28, 0.321, 0.348, 0.503, 0.679, 0.706],
  // Additional categories from category_specific_accuracy.csv (not in taxonomy browser)
  "color-key":      [0.333, 0.526, 0.228, 0.483, 0.532, 0.594, 0.502, 0.582, 0.772, 0.834, 0.849, 0.929],
  "location":       [0.5, 0.467, 0.650, 0.661, 0.680, 0.756, 0.684, 0.730, null, null, 0.909, 0.939],
  "time-of-day":    [0.25, 0.427, 0.485, 0.712, 0.603, 0.737, 0.696, 0.681, 0.741, 0.735, 0.692, 0.890],
  "is-crowd":       [0.5, 0.693, 0.524, 0.373, 0.686, 0.772, 0.691, 0.559, 0.945, 0.930, 0.915, 0.996],
};

// Display names for all benchmark categories (including those not in the taxonomy browser)
export const CATEGORY_DISPLAY_NAMES = {
  "shot-framing": "Shot Framing",
  "shot-type": "Shot Type",
  "ots": "Over-the-Shoulder",
  "is-crowd": "Is Crowd",
  "composition": "Composition",
  "symmetry": "Symmetry",
  "camera-angle": "Camera Angle",
  "camera-height": "Camera Height",
  "dutch-angle": "Dutch Angle",
  "saturation": "Saturation",
  "color-contrast": "Color Contrast",
  "color-tones": "Color Tones",
  "color-theory": "Color Theory",
  "color-key": "Color Key",
  "light-direction": "Light Direction",
  "light-cast": "Light Cast",
  "light-contrast": "Light Contrast",
  "edge-light": "Edge Light",
  "silhouette": "Silhouette",
  "shot-focus": "Shot Focus",
  "shot-lens": "Shot Lens",
  "location": "Location",
  "time-of-day": "Time of Day",
};

// Grouped benchmark categories for the Cinematic Performance chart section
export const BENCHMARK_GROUPS = [
  {
    name: "Framing",
    categories: ["shot-framing", "shot-type", "ots", "is-crowd"],
  },
  {
    name: "Composition",
    categories: ["composition", "symmetry"],
  },
  {
    name: "Camera",
    categories: ["camera-angle", "camera-height", "dutch-angle"],
  },
  {
    name: "Color",
    categories: ["saturation", "color-contrast", "color-tones", "color-theory", "color-key"],
  },
  {
    name: "Lighting",
    categories: ["light-direction", "light-cast", "light-contrast", "edge-light", "silhouette"],
  },
  {
    name: "Lens",
    categories: ["shot-focus", "shot-lens"],
  },
  {
    name: "Scene",
    categories: ["location", "time-of-day"],
  },
];

export function getBenchmarkStats(data) {
  const competitors = data.slice(1, 10).filter(v => v != null);
  const sorted = [...competitors].sort((a, b) => a - b);
  const n = sorted.length;
  const zeroShot = data[10];
  const classifier = data.length > 11 ? data[11] : null;
  const best = classifier != null ? Math.max(zeroShot, classifier) : zeroShot;
  return {
    random: data[0],
    cinemaclip: zeroShot,
    classifier,
    best,
    competitorMin: sorted[0],
    competitorMax: sorted[n - 1],
    competitorQ1: sorted[Math.floor(n * 0.25)],
    competitorQ3: sorted[Math.floor(n * 0.75)],
    competitorMedian: sorted[Math.floor(n / 2)],
    bestExisting: sorted[n - 1],
    gap: best - sorted[n - 1],
  };
}

// ─── Data ────────────────────────────────────────────────────────────────────
// Scoped to the 19 categories from the explorer plan doc.
// Labels match schema.json (probabilities_meta titles used for display).

export const SECTIONS = [
  {
    id: "framing",
    phrase: "Framing",
    description:
      "",
    categories: [
      {
        id: "shot-framing",
        name: "Shot Framing",
        description:
          "...",
        diagram: "framing",
        labels: [
          "Extreme Wide",
          "Wide",
          "Full",
          "Medium Wide",
          "Medium",
          "Medium Closeup",
          "Closeup",
          "Extreme Closeup",
        ],
      },
      {
        id: "shot-type",
        name: "Shot Type",
        description:
          "...",
        diagram: "shot-type",
        labels: [
          "Clean Single",
          "Two Shot",
          "Three Shot",
          "Group Shot",
          "Insert Shot",
        ],
      },
      {
        id: "ots",
        name: "Over-the-Shoulder",
        description:
          "...",
        diagram: "ots",
        labels: ["OTS", "Not OTS"],
      },
    ],
  },
  {
    id: "composition",
    phrase: "Composition",
    description:
      "",
    categories: [
      {
        id: "composition",
        name: "Composition",
        description:
          "...",
        diagram: "composition",
        labels: ["Balanced", "Center", "Left-Heavy", "Right-Heavy"],
      },
      {
        id: "symmetry",
        name: "Symmetry",
        description:
          "...",
        diagram: "symmetry",
        labels: ["Symmetric", "Asymmetric"],
      },
    ],
  },
  {
    id: "camera",
    phrase: "Camera",
    description:
      "",
    categories: [
      {
        id: "camera-angle",
        name: "Camera Angle",
        description:
          "...",
        diagram: "angle",
        labels: [
          "Overhead",
          "High Angle",
          "Subtle High",
          "Level",
          "Subtle Low",
          "Low Angle",
          "Reverse Overhead",
        ],
      },
      {
        id: "camera-height",
        name: "Camera Height",
        description:
          "...",
        diagram: "height",
        labels: [
          "Aerial",
          "Elevated",
          "Above Subject",
          "Eye Level",
          "Below Subject",
          "Ground Level",
        ],
      },
      {
        id: "dutch-angle",
        name: "Dutch Angle",
        description:
          "...",
        diagram: "dutch-angle",
        labels: ["Tilted", "Level"],
      },
    ],
  },
  {
    id: "color",
    phrase: "Colour",
    description:
      "",
    categories: [
      {
        id: "saturation",
        name: "Saturation",
        description:
          "...",
        diagram: "saturation",
        labels: ["Desaturated", "Neutral", "Saturated"],
      },
      {
        id: "color-contrast",
        name: "Color Contrast",
        description:
          "...",
        diagram: "color-contrast",
        labels: ["Low", "Neutral", "High"],
      },
      {
        id: "color-tones",
        name: "Color Tones",
        description:
          "...",
        diagram: "color-tones",
        labels: ["Black & White", "Cool", "Mixed", "Neutral", "Warm"],
      },
      {
        id: "color-theory",
        name: "Color Theory",
        description:
          "...",
        diagram: "color-theory",
        labels: ["Analogous", "Complementary", "Monochromatic"],
      },
    ],
  },
  {
    id: "lighting",
    phrase: "Lighting",
    description:
      "",
    categories: [
      {
        id: "light-direction",
        name: "Light Direction",
        description:
          "...",
        diagram: "lighting-direction",
        labels: [
          "Ambient",
          "Backlit",
          "Front-Lit",
          "Left",
          "Right",
          "Top",
          "Under-Lit",
        ],
      },
      {
        id: "light-cast",
        name: "Light Cast",
        description:
          "...",
        diagram: "light-cast",
        labels: ["Soft", "Neutral", "Hard"],
      },
      {
        id: "light-contrast",
        name: "Light Contrast",
        description:
          "...",
        diagram: "light-contrast",
        labels: ["Low", "Neutral", "High"],
      },
      {
        id: "edge-light",
        name: "Edge Light",
        description:
          "...",
        diagram: "edge-light",
        labels: ["Edge-Lit", "Not Edge-Lit"],
      },
      {
        id: "silhouette",
        name: "Silhouette",
        description:
          "...",
        diagram: "silhouette",
        labels: ["Silhouette Lighting", "Not Silhouette Lighting"],
      },
    ],
  },
  {
    id: "lens",
    phrase: "Lens",
    description:
      "",
    categories: [
      {
        id: "shot-focus",
        name: "Shot Focus",
        description:
          "...",
        diagram: "shot-focus",
        labels: ["Deep", "Neutral", "Shallow", "Out of Focus"],
      },
      {
        id: "shot-lens",
        name: "Shot Lens",
        description:
          "...",
        diagram: "shot-lens",
        labels: ["Fisheye / Ultrawide", "Wide", "Medium", "Long", "Telephoto"],
      },
    ],
  },
];

export const HERO_ANNOTATIONS = [
  {
    label: "Medium Closeup",
    category: "Framing",
    x: 12,
    y: 8,
    align: "left",
  },
  {
    label: "Shallow Focus",
    category: "Focus",
    x: 85,
    y: 14,
    align: "right",
  },
  {
    label: "Subtle Low Angle",
    category: "Angle",
    x: 10,
    y: 88,
    align: "left",
  },
  {
    label: "Warm Tones",
    category: "Color",
    x: 78,
    y: 82,
    align: "right",
  },
  {
    label: "Side-Lit (Left)",
    category: "Lighting",
    x: 14,
    y: 48,
    align: "left",
  },
  {
    label: "Centered",
    category: "Composition",
    x: 50,
    y: 35,
    align: "center",
  },
];

export const OVERALL_ACCURACY_DATA = [
  { name: "CinemaCLIP", arch: "MobileCLIP-S1", pretrained: "CinemaCLIP", accuracy: 0.8218309309179707, classifierAccuracy: 0.8756138497879081, flops: 4.7, isOurs: true },
  { name: "Qwen3-VL 8B", arch: "Qwen3-VL-8B-Instruct", accuracy: 0.5913045454545455, flops: null },
  { name: "Qwen3-VL 4B", arch: "Qwen3-VL-4B-Instruct", accuracy: 0.5786454545454546, flops: null },
  { name: "DFN ViT-H-14", arch: "ViT-H-14-378-quickgelu", pretrained: "dfn5b", accuracy: 0.4451596460824796, flops: 1054.05 },
  { name: "MetaCLIP PE-bigG", arch: "PE-Core-bigG-14-448", pretrained: "meta", accuracy: 0.4439671809768458, flops: 5045 },
  { name: "MobileCLIP-S1", arch: "MobileCLIP-S1", pretrained: "datacompdr", accuracy: 0.4356869476604511, flops: 4.7 },
  { name: "OpenAI ViT-L-14", arch: "ViT-L-14", pretrained: "openai", accuracy: 0.4377040845823745, flops: 175.33 },
  { name: "DFN ViT-L-14", arch: "ViT-L-14", pretrained: "dfn2b_s39b", accuracy: 0.3829647511636174, flops: 175.33 },
  { name: "SigLIP2 SO400M", arch: "ViT-SO400M-16-SigLIP2-384", pretrained: "webli", accuracy: 0.3735057405127512, flops: 723.48 },
  { name: "SigLIP2 ViT-gopt", arch: "ViT-gopt-16-SigLIP2-384", pretrained: "webli", accuracy: 0.3562794428506632, flops: 1000 },
  { name: "Random Baseline", accuracy: 0.2357987250398249, flops: null, isBaseline: true },
];

// Sort by accuracy descending (best to worst)
export const SORTED_DATA = [...OVERALL_ACCURACY_DATA].sort((a, b) => b.accuracy - a.accuracy);

export const LAION_EXAMPLES = {
  cinematic: [
    {
      src: "assets/laion/true-lies.jpg",
      caption: "True Lies best spy movies of all time",
    },
    {
      src: "assets/laion/rocky-horror.jpg",
      caption: "Actors in a scene from the movie 'The Rocky Horror Picture Show' 1975",
    },
    {
      src: "assets/laion/against-the-sun.jpg",
      caption: "Against the Sun movie scenes",
    },
    {
      src: "assets/laion/300.jpg",
      caption: "The most Epic fight scenes from the film 300 to the tune of Drowning Pool's, 'Let The Bodies Hit the Floor'.",
    },
  ],
  nonCinematic: [
    {
      src: "assets/laion/moore.jpg",
      caption: "The Dangerous Fun Of Having Red Hair",
    },
    {
      src: "assets/laion/fishermen.jpg",
      caption: "The livelihood of Gamboa de Baixo's fishermen is dependent on access to the sea.",
    },
    {
      src: "assets/laion/bicycle.jpg",
      caption: "Just had new inner tubes put in and a general service. Comes with the front brake and pegs not mounted.",
    },
    {
      src: "assets/laion/hotel.jpg",
      caption: "Lobby Entrance at the Pacific Gate designed by Kohn Pedersen Fox",
    },
  ],
};

export const EXEMPLAR_IMAGES = {
  "camera-height": [
    { label: "Aerial",          src: "assets/cinemaclip/shot.height/aerial.jpg",          film: "", year: "" },
    { label: "Elevated",        src: "assets/cinemaclip/shot.height/elevated.jpg",        film: "", year: "" },
    { label: "Above Subject",   src: "assets/cinemaclip/shot.height/above-subject.jpg",   film: "", year: "" },
    { label: "Eye Level",       src: "assets/cinemaclip/shot.height/eyelevel.jpg",         film: "", year: "" },
    { label: "Below Subject",   src: "assets/cinemaclip/shot.height/below-subject.jpg",   film: "", year: "" },
    { label: "Ground Level",    src: "assets/cinemaclip/shot.height/ground-level.jpg",    film: "", year: "" },
  ],
  "camera-angle": [
    { label: "Overhead",        src: "assets/cinemaclip/camera.angle/overhead.jpg",        film: "", year: "" },
    { label: "High Angle",      src: "assets/cinemaclip/camera.angle/high-obvious.jpg",   film: "", year: "" },
    { label: "Subtle High",     src: "assets/cinemaclip/camera.angle/high-subtle.jpg",     film: "", year: "" },
    { label: "Level",           src: "assets/cinemaclip/camera.angle/level.jpg",          film: "", year: "" },
    { label: "Subtle Low",      src: "assets/cinemaclip/camera.angle/low-subtle.jpg",     film: "", year: "" },
    { label: "Low Angle",       src: "assets/cinemaclip/camera.angle/low-obvious.jpg",    film: "", year: "" },
    { label: "Reverse Overhead", src: "assets/cinemaclip/camera.angle/reverse-overhead.png", film: "", year: "" },
  ],
  "dutch-angle": [
    { label: "Tilted", src: "assets/cinemaclip/camera.angle.dutch/dutch.jpg", film: "", year: "" },
    { label: "Level",  src: "assets/cinemaclip/camera.angle.dutch/not dutch.jpg", film: "", year: "" },
  ],
  "light-direction": [
    { label: "Ambient",   src: "assets/cinemaclip/lighting.direction/ambient.jpg",   film: "", year: "" },
    { label: "Backlit",   src: "assets/cinemaclip/lighting.direction/backlit.jpg",   film: "", year: "" },
    { label: "Front-Lit", src: "assets/cinemaclip/lighting.direction/front.jpg",     film: "", year: "" },
    { label: "Top",       src: "assets/cinemaclip/lighting.direction/top.jpg",        film: "", year: "" },
    { label: "Left",      src: "assets/cinemaclip/lighting.direction/left.jpg",      film: "", year: "" },
    { label: "Right",     src: "assets/cinemaclip/lighting.direction/right.jpg",     film: "", year: "" },
    { label: "Under-Lit", src: "assets/cinemaclip/lighting.direction/underlit.jpg",   film: "", year: "" },
  ],
  "light-cast": [
    { label: "Soft",    src: "assets/cinemaclip/lighting.cast/soft.jpg",    film: "", year: "" },
    { label: "Neutral", src: "assets/cinemaclip/lighting.cast/neutral.jpg", film: "", year: "" },
    { label: "Hard",    src: "assets/cinemaclip/lighting.cast/hard.jpg",    film: "", year: "" },
  ],
  "light-contrast": [
    { label: "Low",     src: "assets/cinemaclip/lighting.contrast/low.jpg",     film: "", year: "" },
    { label: "Neutral", src: "assets/cinemaclip/lighting.contrast/neutral.jpg", film: "", year: "" },
    { label: "High",    src: "assets/cinemaclip/lighting.contrast/high.jpg",    film: "", year: "" },
  ],
  "edge-light": [
    { label: "Edge-Lit",      src: "assets/cinemaclip/lighting.edge/edge.jpg",     film: "", year: "" },
    { label: "Not Edge-Lit", src: "assets/cinemaclip/lighting.edge/not-edge.jpg", film: "", year: "" },
  ],
  silhouette: [
    { label: "Silhouette Lighting",     src: "assets/cinemaclip/lighting.silhouette/silhouette.jpg",     film: "", year: "" },
    { label: "Not Silhouette Lighting", src: "assets/cinemaclip/lighting.silhouette/not-silhouette.jpg", film: "", year: "" },
  ],
  "shot-framing": [
    { label: "Extreme Wide",   src: "assets/cinemaclip/shot.framing/extreme-wide.jpg",   film: "", year: "" },
    { label: "Wide",           src: "assets/cinemaclip/shot.framing/wide.jpg",           film: "", year: "" },
    { label: "Full",           src: "assets/cinemaclip/shot.framing/full.jpg",            film: "", year: "" },
    { label: "Medium Wide",    src: "assets/cinemaclip/shot.framing/medium-wide.jpg",    film: "", year: "" },
    { label: "Medium",         src: "assets/cinemaclip/shot.framing/medium.jpg",         film: "", year: "" },
    { label: "Medium Closeup", src: "assets/cinemaclip/shot.framing/medium-closeup.jpg", film: "", year: "" },
    { label: "Closeup",        src: "assets/cinemaclip/shot.framing/closeup.jpg",        film: "", year: "" },
    { label: "Extreme Closeup", src: "assets/cinemaclip/shot.framing/extreme-closeup.jpg", film: "", year: "" },
  ],
  saturation: [
    { label: "Desaturated", src: "assets/cinemaclip/color.saturation/desaturated.JPG", film: "", year: "" },
    { label: "Neutral",     src: "assets/cinemaclip/color.saturation/neutral.jpg",     film: "", year: "" },
    { label: "Saturated",   src: "assets/cinemaclip/color.saturation/saturated.jpg",   film: "", year: "" },
  ],
  "color-contrast": [
    { label: "Low",     src: "assets/cinemaclip/color.contrast/low.jpg",     film: "", year: "" },
    { label: "Neutral", src: "assets/cinemaclip/color.contrast/neutral.jpg", film: "", year: "" },
    { label: "High",    src: "assets/cinemaclip/color.contrast/high.jpg",    film: "", year: "" },
  ],
  "color-tones": [
    { label: "Black & White", src: "assets/cinemaclip/color.tones/black-white.jpg", film: "", year: "" },
    { label: "Cool",          src: "assets/cinemaclip/color.tones/cool.jpg",         film: "", year: "" },
    { label: "Mixed",         src: "assets/cinemaclip/color.tones/mixed.jpg",        film: "", year: "" },
    { label: "Neutral",       src: "assets/cinemaclip/color.tones/neutral.jpg",      film: "", year: "" },
    { label: "Warm",          src: "assets/cinemaclip/color.tones/warm.jpg",         film: "", year: "" },
  ],
  "color-theory": [
    { label: "Analogous",     src: "assets/cinemaclip/color.theory/analagous.jpg",     film: "", year: "" },
    { label: "Complementary", src: "assets/cinemaclip/color.theory/complementary.jpg", film: "", year: "" },
    { label: "Monochromatic", src: "assets/cinemaclip/color.theory/monochrome.jpg",    film: "", year: "" },
  ],
  composition: [
    { label: "Balanced",   src: "assets/cinemaclip/shot.composition/balanced.jpg", film: "", year: "" },
    { label: "Center",    src: "assets/cinemaclip/shot.composition/center.jpg",   film: "", year: "" },
    { label: "Left-Heavy", src: "assets/cinemaclip/shot.composition/left.jpg",    film: "", year: "" },
    { label: "Right-Heavy", src: "assets/cinemaclip/shot.composition/right.jpg",   film: "", year: "" },
  ],
  symmetry: [
    { label: "Symmetric",   src: "assets/cinemaclip/shot.composition.symmetric/symmetric.jpg",   film: "", year: "" },
    { label: "Asymmetric", src: "assets/cinemaclip/shot.composition.symmetric/asymmetric.jpg", film: "", year: "" },
  ],
  "shot-type": [
    { label: "Clean Single", src: "assets/cinemaclip/shot.type/cleansingle.jpg", film: "", year: "" },
    { label: "Two Shot",     src: "assets/cinemaclip/shot.type/twoshot.jpg",    film: "", year: "" },
    { label: "Three Shot",   src: "assets/cinemaclip/shot.type/threeshot.jpg",  film: "", year: "" },
    { label: "Group Shot",   src: "assets/cinemaclip/shot.type/groupshot.jpg",  film: "", year: "" },
    { label: "Insert Shot",  src: "assets/cinemaclip/shot.type/insert.jpg",     film: "", year: "" },
  ],
  ots: [
    { label: "OTS",     src: "assets/cinemaclip/shot.type.ots/ots.jpg",     film: "", year: "" },
    { label: "Not OTS", src: "assets/cinemaclip/shot.type.ots/not-ots.jpg", film: "", year: "" },
  ],
  "shot-focus": [
    { label: "Deep",         src: "assets/cinemaclip/shot.focus/deep.jpg",   film: "", year: "" },
    { label: "Neutral",      src: "assets/cinemaclip/shot.focus/neutral.png", film: "", year: "" },
    { label: "Shallow",      src: "assets/cinemaclip/shot.focus/shallow.jpg", film: "", year: "" },
    { label: "Out of Focus", src: "assets/cinemaclip/shot.focus/out.jpg",    film: "", year: "" },
  ],
  "shot-lens": [
    { label: "Fisheye / Ultrawide", src: "assets/cinemaclip/shot.lens/ultrawide-fisheye.jpg", film: "", year: "" },
    { label: "Wide",                src: "assets/cinemaclip/shot.lens/wide.jpg",             film: "", year: "" },
    { label: "Medium",              src: "assets/cinemaclip/shot.lens/medium.jpg",           film: "", year: "" },
    { label: "Long",                src: "assets/cinemaclip/shot.lens/long.jpg",             film: "", year: "" },
    { label: "Telephoto",           src: "assets/cinemaclip/shot.lens/telephoto.jpg",        film: "", year: "" },
  ],
};

export const PIXMO_SOURCE_NAME = "Pixmo Dataset (Labelled By Humans)";
export const SHAREGPT4V_SOURCE_NAME = "ShareGPT4V-COCO Dataset (Labelled By GPT-4)";

export const RICH_CAPTION_EXAMPLES = [
  {
    src: "assets/pixmo/painting.jpg",
    source: PIXMO_SOURCE_NAME,
    caption: `The image depicts an interior scene from colonial times, rendered in a slightly impressionistic style using oil pastels. Central to the composition is a person seated at either a piano or harpsichord, dressed in a blue suit, playing as several individuals stand around. The scene is set in a large room with plastered walls, displaying various shades of white and blue that reflect different light sources.

In the foreground, a woman wearing a colonially styled dress with a white apron stands to the far right, possibly holding another piece of fabric. The group surrounding the seated figure consists of both men and women, many with dark hair pulled back into buns or braids. One figure, distinguished by a tall stature and a braid, stands near a window adorned with blue drapes on the upper right part of the painting.

The background features a mix of dark and lighter blue splotches, creating a dynamic and textured effect, contributing to the overall impressionistic aesthetic. Near the center-right portion, there's a table draped with a white tablecloth, possibly supporting a vase or similar object. The composition also includes a white door in the background and a person leaning against it. One prominent character in brown smock and white shirt is pointing, drawing attention to the musical performance or another focal point within the scene. The figures lack intricate facial details, adding to the impressionistic quality of the artwork.`,
  },
  {
    src: "assets/pixmo/landscape.jpg",
    source: PIXMO_SOURCE_NAME,
    caption: `This scenic nature image captures a serene and picturesque landscape with a harmonious blend of colors and light. A wide expanse of water, characterized by its calm, grayish-blue hue and gentle ripples, dominates the scene. On the right-hand side, a small rocky formation is depicted in shades of gray, connected to another rocky section by a single wooden board spanning a gap in the water.

A streak of bright yellow sunlight is vividly reflected in the water, adding a warm, ethereal glow to the composition. In the distance, tall hillsides with shadowy, tree-covered slopes create a layered backdrop, partially veiled by the sun's rays.

Above this tranquil setting, the sky is painted in a soft blue, transitioning to a solid cloud cover on the far right, providing contrast to the otherwise clear expanse. The bright yellow sun shines prominently, casting a radiant light that enhances the overall tone and style of the image, making it visually appealing and evocative of a peaceful, natural beauty.`,
  },
  {
    src: "assets/pixmo/over-processed.jpg",
    source: PIXMO_SOURCE_NAME,
    caption: `This rectangular photograph appears to be either aged or filtered, giving it muted tones that lend an almost surreal quality to the image. It captures a dense, jungle-like scene brimming with various leafy green plants, now tinged with blue hues due to the effect. Scattered among the foliage are flowers that stand out in contrasting shades of purple and peach, creating a striking visual contrast. The scene appears edited or photoshopped, as the colors do not match the natural tones one would expect. In the backdrop, glimpses of light blue sky peek through the intertwined branches, bushes, and trees, indicating it is a daytime shot. The foliage is cast in shades of light and dark blue, replacing the typical greens, adding a unique, dreamlike atmosphere to the image.`,
  },
  {
    src: "assets/sharegpt4v-coco/25.jpg",
    source: SHAREGPT4V_SOURCE_NAME,
    caption: `This image captures a serene moment in a zoo enclosure, where two majestic giraffes are seen in their natural behavior. The giraffes, adorned in their distinctive brown and white patterns, stand tall against the backdrop of lush green trees.

On the left, one giraffe is actively engaged in a meal, its long neck extended towards the tree as it munches on the verdant leaves. Its companion on the right stands leisurely next to a tree trunk, perhaps taking a break from its own leafy feast.

The enclosure they inhabit is grassy and spacious, providing them with ample room to roam and forage. The trees dotting the enclosure not only offer a source of food but also create a naturalistic habitat for these towering creatures.

In summary, this image is a snapshot of life in a zoo, showcasing the grace and beauty of giraffes in an environment designed to mimic their wild habitats.`,
  },
  {
    src: "assets/sharegpt4v-coco/71.jpg",
    source: SHAREGPT4V_SOURCE_NAME,
    caption: `This image captures a bustling scene at a train station. The main focus is an orange and white train composed of 8 cars, stationed on the gray tracks that curve towards the right side of the image. The train, positioned on the left, appears to be moving towards the right, following the direction of the tracks.

In the background, there's a yellow crane on the left and a red brick building on the right. The building sports a sign that reads "Sprint". The sky above is a clear blue with a few scattered clouds.

The image is taken from an elevated position, placing the photographer above the train and station. There are 4 sets of tracks in total, adding to the complexity and depth of the scene.

Overall, this image paints a vivid picture of a day at the train station, with its various elements contributing to a sense of movement and activity.`,
  },
  {
    src: "assets/sharegpt4v-coco/192.jpg",
    source: SHAREGPT4V_SOURCE_NAME,
    caption: `This is a dynamic scene from a baseball game. The photo captures the moment from behind home plate, providing a clear view of the field. There are four main characters in this scene:

1. The batter, dressed in a white uniform with blue stripes, is in the middle of a powerful swing. His blue helmet matches his uniform, adding a touch of color coordination to his attire.
2. Behind the batter, we see the catcher in a striking red uniform. He is crouched in anticipation, ready to catch the ball or react to the swing.
3. The umpire, wearing a black uniform, stands firm behind the catcher. His focus is on the batter and the ball, ready to make the call.
4. On the left side of the photo, near the dugout, another player from the batter's team watches the action unfold.

The field itself is a vibrant green, contrasting with the brown dirt around home plate. The entire scene is viewed through a protective netting, adding an extra layer of texture to the photo.

This image encapsulates the tension and excitement of a baseball game - each player in their position, ready for whatever comes next.`,
  },
];

export const SECTION_ACCENTS = {
  framing: ["#1a1a2e", "#e94560"],
  composition: ["#2d132c", "#c72c41"],
  camera: ["#0a1628", "#4a90d9"],
  color: ["#2d3436", "#e17055"],
  lighting: ["#0d0d0d", "#533483"],
  lens: ["#1a1a2e", "#6c5ce7"],
};

// Per-category max images per row. Tweak these to taste.
export const GRID_MAX_PER_ROW = {
  "camera-height": 3,   // 6 labels → 3+3
  "camera-angle":  3,   // 7 labels → 4+3
  "dutch-angle":  2,   // 2 labels → single row
  "light-direction": 3, // 7 labels → 4+3
  "light-cast":    3,   // 3 labels → single row
  "light-contrast": 3,  // 3 labels → single row
  "edge-light":    2,   // 2 labels → single row
  silhouette:      2,   // 2 labels → single row
  "shot-framing":  3,   // 8 labels → 4+4
  "shot-type":     3,   // 5 labels → single row
  ots:             2,   // 2 labels → single row
  composition:     2,   // 4 labels → single row
  symmetry:        2,   // 2 labels → single row
  saturation:      3,   // 3 labels → single row
  "color-contrast": 3,  // 3 labels → single row
  "color-tones":   3,   // 5 labels → single row
  "color-theory":  3,   // 3 labels → single row
  "shot-focus":    2,   // 4 labels → single row
  "shot-lens":     2,   // 5 labels → single row
};

// ─── Text Encoder Similarity Matrices ────────────────────────────────────────
// Cosine similarity of text embeddings between terms within a taxonomy.
// Each matrix has data for both CinemaCLIP and MobileCLIP (pre-trained).

export const TEXT_SIMILARITY_MATRICES = [
  {
    id: "shot-framing",
    title: "Shot Framing",
    type: "cinematic",
    labels: ["Extreme Wide", "Wide", "Medium", "Medium Closeup", "Closeup", "Extreme Closeup"],
    cinemaclip: [
      [1.00, 0.89, 0.82, 0.76, 0.71, 0.82],
      [0.89, 1.00, 0.91, 0.82, 0.77, 0.75],
      [0.82, 0.91, 1.00, 0.87, 0.73, 0.72],
      [0.76, 0.82, 0.87, 1.00, 0.91, 0.84],
      [0.71, 0.77, 0.73, 0.91, 1.00, 0.89],
      [0.82, 0.75, 0.72, 0.84, 0.89, 1.00],
    ],
    mobileclip: [
      [1.00, 0.86, 0.69, 0.58, 0.46, 0.64],
      [0.86, 1.00, 0.79, 0.66, 0.56, 0.54],
      [0.69, 0.79, 1.00, 0.79, 0.54, 0.52],
      [0.58, 0.66, 0.79, 1.00, 0.86, 0.76],
      [0.46, 0.56, 0.54, 0.86, 1.00, 0.83],
      [0.64, 0.54, 0.52, 0.76, 0.83, 1.00],
    ],
  },
  {
    id: "shot-angle",
    title: "Shot Angle",
    type: "cinematic",
    labels: ["Overhead", "High Angle", "Subtle High", "Eye Level", "Subtle Low", "Low Angle"],
    cinemaclip: [
      [1.00, 0.90, 0.82, 0.78, 0.80, 0.85],
      [0.90, 1.00, 0.91, 0.75, 0.85, 0.91],
      [0.82, 0.91, 1.00, 0.73, 0.90, 0.85],
      [0.78, 0.75, 0.73, 1.00, 0.74, 0.74],
      [0.80, 0.85, 0.90, 0.74, 1.00, 0.93],
      [0.85, 0.91, 0.85, 0.74, 0.93, 1.00],
    ],
    mobileclip: [
      [1.00, 0.72, 0.65, 0.66, 0.57, 0.62],
      [0.72, 1.00, 0.89, 0.68, 0.71, 0.76],
      [0.65, 0.89, 1.00, 0.64, 0.85, 0.71],
      [0.66, 0.68, 0.64, 1.00, 0.68, 0.73],
      [0.57, 0.71, 0.85, 0.68, 1.00, 0.89],
      [0.62, 0.76, 0.71, 0.73, 0.89, 1.00],
    ],
  },
  {
    id: "dog-breeds",
    title: "Dog Breeds",
    type: "non-cinematic",
    labels: ["Poodle", "Pug", "Labrador", "Golden Retriever", "Beagle"],
    cinemaclip: [
      [1.00, 0.54, 0.53, 0.51, 0.40],
      [0.54, 1.00, 0.68, 0.48, 0.46],
      [0.53, 0.68, 1.00, 0.67, 0.59],
      [0.51, 0.48, 0.67, 1.00, 0.54],
      [0.40, 0.46, 0.59, 0.54, 1.00],
    ],
    mobileclip: [
      [1.00, 0.64, 0.60, 0.65, 0.58],
      [0.64, 1.00, 0.69, 0.64, 0.60],
      [0.60, 0.69, 1.00, 0.73, 0.63],
      [0.65, 0.64, 0.73, 1.00, 0.62],
      [0.58, 0.60, 0.63, 0.62, 1.00],
    ],
  },
  {
    id: "animals",
    title: "Animals & Object",
    type: "non-cinematic",
    labels: ["Dog", "Cat", "Dinosaur", "Telephone"],
    cinemaclip: [
      [1.00, 0.86, 0.78, 0.76],
      [0.86, 1.00, 0.76, 0.74],
      [0.78, 0.76, 1.00, 0.66],
      [0.76, 0.74, 0.66, 1.00],
    ],
    mobileclip: [
      [1.00, 0.86, 0.80, 0.73],
      [0.86, 1.00, 0.77, 0.69],
      [0.80, 0.77, 1.00, 0.68],
      [0.73, 0.69, 0.68, 1.00],
    ],
  },
];

// ─── Table of Contents ──────────────────────────────────────────────────────

export const TOC_SECTIONS = [
  {
    id: "intro",
    title: "Introducing CinemaCLIP",
    group: "Intro",
    children: [
      { id: "visual-language", title: "Visual Language" },
      { id: "taxonomy", title: "Taxonomy Browser" },
    ],
  },
  {
    id: "training",
    title: "Training CinemaCLIP",
    group: "Method",
    children: [
      { id: "the-gap", title: "The Gap" },
      { id: "decomposition", title: "Decomposition" },
      { id: "dataset", title: "Dataset" },
    ],
  },
  {
    id: "benchmarks",
    title: "Benchmarks",
    group: "Results",
    children: [
      { id: "hyperparams", title: "Hyperparameters" },
      { id: "retention", title: "Knowledge Retention" },
      { id: "text-encoder", title: "Text Encoder" },
      { id: "efficiency", title: "Efficiency" },
    ],
  },
  { id: "conclusion", title: "Conclusion", group: "", children: [] },
];

function flattenTOC(sections) {
  const flat = [];
  sections.forEach((s) => {
    flat.push({ id: s.id, title: s.title, parentId: null, parentTitle: null });
    (s.children || []).forEach((c) =>
      flat.push({ id: c.id, title: c.title, parentId: s.id, parentTitle: s.title })
    );
  });
  return flat.map((item, i) => ({ ...item, globalIndex: i }));
}

export const FLAT_TOC = flattenTOC(TOC_SECTIONS);

// ─── Hyperparameter Table Data ──────────────────────────────────────────────
// [Parameter, Value, Notes]

export const HYPERPARAMETER_ROWS = [
  ["No. of layers fine-tuned in the vision encoder", "6", "Sweet spot for MobileCLIP-S1. Tuning more layers meant losing too much general knowledge for a marginal gain in cinematic understanding"],
  ["No. of layers fine-tuned in the text encoder", "3", "Sweet spot for MobileCLIP-S1. Tuning more layers meant losing too much general knowledge for a marginal gain in cinematic understanding"],
  ["Learning rate", "2e-5, 2e-3", "For the CLIP image & text encoders, and the classifier heads respectively. We used Leslie Smith & FastAI's LR finder technique to find the ideal range. Did not experiment with differential learning rates for earlier layers"],
  ["Alpha blending ratio (1=full fine-tune, 0=pre-trained)", "0.75", "Slightly better zero-shot performance on cinematic tasks, +7% on zero-shot ImageNet, and only a 1% drop in classifier accuracy compared to the fully fine-tuned model"],
  ["Data ratio between pre-trained (DataComp) data and new cinematic data", "50%", "Critical to maintaining general knowledge. We experimented with a few different ratios that seemed sensible while, and 50-50 was the best balance. All the data (ours + DataComp) was annotated with cinematic labels by our teacher models."],
  ["Confidence threshold of auto-labelled tags", "0.85", "0.85 led to about +10% better performance on cinematic tasks as the training data was more precise. Varying this had no impact on non-cinematic performance"],
  ["No. of contrastive training tasks", "8", "6 cinematic + 2 'general' tasks. Grouping our 22 cinematic tasks into 6 captions led to a +14% improvement over singular captions. Could be extended further to other domains."],
  ["No. of epochs", "3 epochs", "Training for longer meant losing too much prior knowledge for a marginal gain in cinematic understanding. We report epochs and not no. of steps because this observation is based on no. of unique images the model's seen. We saw similar trends with smaller datasets."],
  // ["Batch Size (Images)", "1152", "This was the most we could fit on 3x 3090s. The 8x task formulation meant that 1152 images were doing a lot more work than the usual training schedule, as we had 1152 * 8 = 9216 total captions per batch"],
];
