// src/types/index.ts
export type ElementType =
  | "heading"
  | "text"
  | "button"
  | "image"
  | "video"
  | "form"
  | "grid"
  | "columns"
  | "slider"
  | "navbar"
  | "footer";

export interface ElementStyles {
  // Colors
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  textDecoration?: string;
  textTransform?: string;

  // Spacing
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  // Layout
  width?: string;
  height?: string;
  minHeight?: string;
  maxWidth?: string;

  // Border
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;

  // Effects
  opacity?: string;
  boxShadow?: string;

  // Grid/Columns
  gridColumns?: number;
  gridRows?: number;
  gap?: string;

  // Slider
  slidesToShow?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;

  // Link/Button
  href?: string;
  target?: string;

  // Form
  formFields?: FormField[];
  submitText?: string;
  donateText?: string;
  donateColor?: string;
  donateBgColor?: string;
  donateLink?: string;

  // Video
  videoUrl?: string;
  autoplayVideo?: boolean;
  controls?: boolean;

  // Navbar
  logoText?: string;
  navLinks?: Array<{ label: string; href: string }>;
  showDonateBtn?: boolean;
  donateBtnText?: string;
  donateBtnHref?: string;

  // Footer
  copyrightText?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;

  // Anchoring
  anchorId?: string;
}

export interface FormField {
  id: string;
  type: "text" | "email" | "textarea" | "select" | "checkbox";
  label: string;
  placeholder: string;
  required: boolean;
}

export interface WebsiteElement {
  id: string;
  type: ElementType;
  content: string;
  styles: ElementStyles;
  children?: WebsiteElement[];
}

export interface WebsiteData {
  id: string;
  campaignId?: any;
  name: string;
  elements: WebsiteElement[];
  globalStyles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor?: string;
    textColor?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type PanelTab = "structures" | "elements" | "templates" | "content" | "styles";
export type DevicePreview = "desktop" | "tablet" | "mobile";

export interface StructureCategory {
  id: string;
  label: string;
  icon: string;
  elements: {
    type: ElementType;
    label: string;
    icon: string;
    defaultContent: string;
    defaultStyles: ElementStyles;
  }[];
}

export interface ElementCategory {
  id: string;
  label: string;
  icon: string;
  elements: {
    type: ElementType;
    label: string;
    icon: string;
    defaultContent: string;
    defaultStyles: ElementStyles;
  }[];
}
