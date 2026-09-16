import { PROMKIL_OPTIONS } from "./promkilConfig.js";

export interface GeneratePromptParams {
  designType?: string;
  visualStyle?: string;
  character?: string;
  colorPalette?: string;
  aspectRatio?: string;
  theme: string;
  specialMode?: string;
  language?: "en" | "id";
  isVideo?: boolean;
}

export function generateStructuredPrompt(params: GeneratePromptParams): string {
  const {
    designType = "Poster",
    visualStyle = "Minimalis Modern",
    character = "Faceless modern figure",
    colorPalette = "Pastel & Earth Tone",
    aspectRatio = "9:16",
    theme,
    specialMode = "",
    isVideo = false,
    language = "en",
  } = params;

  // Handle #v Video mode
  if (isVideo || specialMode === "video_prompt" || theme.includes("#v")) {
    const cleanTheme = theme.replace("#v", "").trim();
    return `SCENE:
A dynamic, cinematic sequence showcasing ${cleanTheme || "innovative creative design and visual storytelling"}.

SUBJECT:
A charismatic ${character.toLowerCase()} interacting with fluid elements of ${cleanTheme || "creative art and technology"}, displaying authentic emotion and natural grace.

ACTION:
Smooth transitions from an intimate close-up to an expansive medium shot, with particles and subtle kinetic motion accentuating the narrative arc.

CAMERA MOVEMENT:
Slow cinematic push-in followed by a gentle orbital pan around the subject, finishing with an upward tilt into radiant natural light.

ENVIRONMENT:
An aesthetically curated environment with atmospheric depth, soft floating dust motes, and harmonious architectural framing.

LIGHTING:
Golden hour rim lighting blended with soft ambient volumetric haze and gentle directional fill lights.

COLOR PALETTE:
${colorPalette}, complemented by subtle warm amber highlights and deep velvet undertones.

MOOD:
Inspirational, serene, aesthetically elevated, and emotionally evocative.

VISUAL STYLE:
Hyper-realistic photorealistic 8K film stock, anamorphic lens flare, shallow depth of field (f/1.8), masterfully graded for high-end cinema.

DURATION:
10 seconds per scene loop.

ASPECT RATIO:
${aspectRatio}

TECHNICAL DETAILS:
Rendered in 4K resolution, 60fps, photorealistic motion blur, crystal-clear texture rendering, perfect temporal coherence for Veo / Kling / Sora / Runway Gen-3.`;
  }

  // Handle Auto Generate 5 Gaya
  if (specialMode === "auto_5_styles" || theme.toLowerCase().includes("5 gaya") || theme.toLowerCase().includes("5 style")) {
    const styles = [
      {
        name: "1. MINIMALIS MODERN",
        style: "Clean Swiss Minimalist Graphic Design",
        palette: "Monochrome with vibrant burnt orange accent, high contrast whitespace",
        mood: "Sophisticated, crisp, highly legible, timeless elegance",
        font: "Bold sans-serif grotesque headline with understated neutral geometric subtext",
        texture: "Smooth matte surface with delicate micro-grain",
      },
      {
        name: "2. PASTEL CUTE",
        style: "Whimsical Pastel Kawaii Art Illustration",
        palette: "Soft peach, butter yellow, mint green, baby lavender, milk white",
        mood: "Joyful, cheerful, heartwarming, friendly and welcoming",
        font: "Rounded bubbly hand-drawn typography with playful bouncing baseline",
        texture: "Soft felt paper texture with gentle cloud gradients",
      },
      {
        name: "3. CLAY 3D",
        style: "Pixar-style Plasticine 3D Claymation Model",
        palette: "Tactile vibrant clay tones: coral red, deep cobalt, mustard yellow, sage green",
        mood: "Playful, tactile, dimensional, cheerful depth",
        font: "Chunky 3D embossed typographic block with soft ambient occlusion shadows",
        texture: "Fingerprint clay texture, tactile matte plasticine, soft studio rim lighting",
      },
      {
        name: "4. PROFESIONAL EDITORIAL",
        style: "High-End Magazine Editorial Graphic Art",
        palette: "Sophisticated navy blue, warm sandstone, champagne gold, deep forest slate",
        mood: "Authoritative, curated, premium, executive prestige",
        font: "Refined modern serif display header paired with high-legibility grotesque text",
        texture: "Heavy uncoated art paper grain with subtle debossed metallic foil accents",
      },
      {
        name: "5. CINEMATIC ARTISTIC",
        style: "Dramatic Digital Concept Art & Fine Illustration",
        palette: "Deep twilight indigos, atmospheric teal, glowing amber rays, rich shadows",
        mood: "Breathtaking, epic, ethereal, visually poetic",
        font: "Minimalist elegant tracked-out modern typeface",
        texture: "Subtle film grain, atmospheric volumetric fog, painterly brushstroke layers",
      },
    ];

    let fullOutput = `Hai sahabat kreatif! Berikut 5 variasi prompt untuk tema "${theme}" dalam 5 gaya visual yang berbeda:\n\n`;

    styles.forEach((s) => {
      fullOutput += `### 🎨 Gaya: ${s.name}\n\`\`\`prompt\n[HIGH-IMPACT ${designType.toUpperCase()} WITH ${s.style.toUpperCase()}]\n\nDesign Type: ${designType}\nTheme: "${theme}"\n\nColor Palette:\n${s.palette}\n\nCharacter Style:\n${character}, styled in ${s.style} aesthetic with expressive posture and delightful silhouette\n\nIllustration Style:\n${s.style}, exquisitely rendered with impeccable compositional balance\n\nFont Style:\n${s.font}\n\nLayout:\nAsymmetrical golden ratio layout with generous negative space, deliberate focal point, and clear reading path\n\nIcon Elements:\nStylized geometric vector icons complementing the core narrative\n\nBorder Elements:\nClean hairline border with subtle inner margin breathing room\n\nTexture:\n${s.texture}\n\nBackground Style:\nContextual atmospheric background with gentle radial gradient falloff\n\nText Effect:\nCrisp typography with subtle depth shading and anti-aliased edge precision\n\nIcon Set:\nConsistent 24px icon set with matching stroke weights and rounded corner radius\n\nMood:\n${s.mood}\n\nAdditional Design Elements:\nSubtle floating design tokens, modern grid alignment, masterwork visual hierarchy, 8k resolution, graphic design award winning\n\nAspect Ratio: ${aspectRatio}\n\`\`\`\n\n`;
    });

    return fullOutput;
  }

  // Handle Sticker Sheet
  if (specialMode === "sticker_sheet") {
    return `[PRINTABLE VECTOR STICKER SHEET FEATURING MULTIPLE DIE-CUT ASSETS]

Design Type: Sticker Sheet / Die-Cut Sticker Pack
Theme: "${theme}"

Color Palette:
Vibrant ${colorPalette}, clean crisp white sticker outlines, pastel background support

Character Style:
Adorable ${character} rendered in 8 to 10 distinct expressions and poses (happy, celebratory, thinking, curious, cheering, giving thumbs up, sipping coffee, creative crafting)

Illustration Style:
Kawaii vector flat illustration with smooth thick outlines, clean contour lines, cohesive stroke weight across all items

Font Style:
Playful bubbly sans-serif lettering on accompanying mini motto stickers

Layout:
Organized sticker grid sheet on an isolated pure light background, generous spacing between each die-cut sticker, kiss-cut white border padding (5mm) around each individual element

Icon Elements:
Tiny spark stars, joyful hearts, creative sparkles, mini floral badges scattered between stickers

Border Elements:
Crisp 4px white die-cut contour sticker borders with gentle drop shadow to showcase peelable effect

Texture:
Smooth glossy vinyl sticker finish with subtle highlights

Background Style:
Clean, solid neutral off-white or soft pastel grid pattern background for printing mockups

Text Effect:
Punchy colored text stickers with thick white bubble contours

Icon Set:
Matching expressive badge icons

Mood:
Energetic, heartwarming, joyful, delightful, collectible

Additional Design Elements:
High resolution 300 DPI print-ready design, vector graphics perfection, vibrant color profile, no overlapping stickers, safe cut lines, professional merchandise quality

Aspect Ratio: ${aspectRatio}`;
  }

  // Handle Carousel 10 Slide
  if (specialMode === "carousel_10") {
    let slides = [
      "Slide 1: Cover / Hook - Big bold curiosity headline, striking central visual",
      "Slide 2: Introduction - Context & relatable pain point with empathetic illustration",
      "Slide 3: Main Point 1 - Core fundamental insight broken down into digestible steps",
      "Slide 4: Main Point 2 - Actionable strategy with supporting card diagram",
      "Slide 5: Main Point 3 - Advanced pro-tip with comparative before-and-after visual",
      "Slide 6: Supporting Information - Data point or practical case study infographic card",
      "Slide 7: Real-Life Example - Visual walkthrough demonstrating the concept in action",
      "Slide 8: Quick Solutions & Checklist - Scannable bullet cards with checkmark icons",
      "Slide 9: Key Takeaways Summary - Unified recap framework summarizing core pillars",
      "Slide 10: Call to Action & Closing - Engaging bookmark/save prompt, avatar badge & share button",
    ];

    let output = `[CONSISTENT 10-SLIDE SOCIAL CAROUSEL PRESENTATION SYSTEM]\n\nDesign Type: Instagram Carousel (10 Slides)\nTheme: "${theme}"\n\nColor Palette:\nUnified cohesive ${colorPalette} applied consistently across all 10 slides for strong brand identity\n\nCharacter Style:\nConsistent recurring ${character} maintaining identical outfit, color scheme, and visual scale across every frame\n\nIllustration Style:\n${visualStyle} with cohesive line weight, flat vector rendering, and modern card components\n\nFont Style:\nModern sans-serif typography hierarchy: Bold 64pt display headers, 28pt medium subheaders, 18pt body\n\nLayout Architecture (Slide 1 to 10):\n`;
    slides.forEach((sl) => {
      output += `- ${sl}\n`;
    });
    output += `\nIcon Elements:\nConsistent line-art UI icons and directional arrows indicating swipe motion on every slide\n\nBorder Elements:\nSubtle rounded card containers (16px radius) with 1px border stroke and consistent slide number badges (e.g. 01/10)\n\nTexture:\nClean matte digital screen texture with subtle grain\n\nBackground Style:\nConsistent alternating background rhythm: light canvas with subtle ambient geometric accents\n\nText Effect:\nHigh-contrast crisp typography with optimal mobile readability\n\nMood:\nEducational, authoritative, visually engaging, easily shareable\n\nAspect Ratio: ${aspectRatio}`;
    return output;
  }

  // Handle Standard PromKil Image Prompt
  return `[HIGH-IMPACT PROFESSIONAL ${designType.toUpperCase()} IN ${visualStyle.toUpperCase()} STYLE]

Design Type: ${designType}
Theme: "${theme}"

Color Palette:
Harmonious ${colorPalette} with balanced 60-30-10 distribution, featuring subtle tonal transitions and high-contrast accents

Character Style:
${character}, stylized in a charming ${visualStyle} look with friendly engaging posture and authentic expression

Illustration Style:
${visualStyle}, executed with crisp silhouette definition, refined line weight, and masterfully balanced composition

Font Style:
Clean modern display typography for headlines with optimal letter spacing, paired with ultra-legible neutral body text

Layout:
Structured ${specialMode === "auto_layout" ? "Auto Layout with prominent upper headline, central hero visual stage, structured middle content cards, and bottom footer credentials" : "editorial layout with strong visual hierarchy, clear entry focal point, and generous negative space"}

Icon Elements:
Minimalist themed vector glyphs complementing "${theme}" with cohesive rounded aesthetics

Border Elements:
Clean geometric outer frame with subtle inner padding and delicate corner accents

Texture:
Subtle tactile paper grain with smooth matte gradient transitions

Background Style:
Curated atmospheric background with soft ambient lighting, gentle depth gradient, and clean breathing space

Text Effect:
Crisp typography with subtle depth shading and anti-aliased edge precision

Icon Set:
Matching 24px icon set with unified 2px stroke width and rounded joins

Mood:
Inspiring, professional, creative, welcoming, and visually memorable

Additional Design Elements:
Golden-ratio spatial balancing, production-ready graphic design standard, award-winning visual layout, studio lighting highlights, 8k resolution

Aspect Ratio: ${aspectRatio}`;
}
