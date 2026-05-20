export type PortfolioShape =
  | { type: "image"; src: string; x: number; y: number; w: number; h: number; opacity?: number | null }
  | { type: "text"; text: string; x: number; y: number; w: number; h: number; font?: string | null; size?: number | null; color?: string | null; align?: "left" | "center" | "right" | "justify" | null; italic?: boolean | null; bold?: boolean | null };

export type PortfolioSlide = { id: number; shapes: PortfolioShape[] };

export const portfolioSlides: PortfolioSlide[] = [
  /* ---------------- SLIDE 1 ---------------- */
  {
    "id": 1,
    "shapes": [
      {
        "type": "image",
        "x": 0.0,
        "y": 0.0,
        "w": 100.0,
        "h": 100.0,
        "src": "/portfolio/media/image1.jpeg",
        "opacity": null
      },
      {
        "type": "text",
        "x": 0.5631,
        "y": 26.9219,
        "w": 98.8739,
        "h": 54.0448,
        "text": "PORTFOLIO",
        "font": "Anton",
        "size": 433.83,
        "color": "#AA212E",
        "align": "center",
        "bold": false
      }
    ]
  },

  /* ---------------- SLIDE 2 ---------------- */
  {
    "id": 2,
    "shapes": [
      {
        "type": "image",
        "x": 0.0,
        "y": 0.0,
        "w": 100.0,
        "h": 100.0,
        "src": "/portfolio/media/image1.jpeg",
        "opacity": null
      }
    ]
  },

  /* ---------------- SLIDE 3 (UPDATED) ---------------- */
  {
    "id": 3,
    "shapes": [
      {
        "type": "image",
        "x": 0.0,
        "y": 0.0,
        "w": 100.0,
        "h": 100.0,
        "src": "/portfolio/media/image1.jpeg",
        "opacity": null
      },

      {
        "type": "text",
        "x": 40.6893,
        "y": 22.3569,
        "w": 56.5439,
        "h": 28.8408,
        "text": "HIGHLIGHTS",
        "font": "Anton",
        "size": 231.4,
        "color": "#103d2e",
        "align": "left",
        "bold": false
      },
      {
        "type": "text",
        "x": 40.6893,
        "y": 14.7846,
        "w": 46.7093,
        "h": 13.392,
        "text": "Our Project",
        "font": "Brittany",
        "size": 106.67,
        "color": "#103d2e",
        "align": "left"
      },

      {
        "type": "text",
        "x": 40.6893,
        "y": 72.9557,
        "w": 11.1146,
        "h": 12.4645,
        "text": "15+",
        "font": "Anton",
        "size": 100.23,
        "color": "#103d2e",
        "align": "left"
      },
      {
        "type": "text",
        "x": 67.0007,
        "y": 72.9557,
        "w": 11.1146,
        "h": 12.4645,
        "text": "90%",
        "font": "Anton",
        "size": 100.23,
        "color": "#103d2e",
        "align": "left"
      },

      {
        "type": "text",
        "x": 48.5397,
        "y": 78.2528,
        "w": 16.9645,
        "h": 2.9815,
        "text": "Projects completed to date",
        "font": "Glacial Indifference",
        "size": 24.0,
        "color": "#103d2e",
        "align": "left"
      },
      {
        "type": "text",
        "x": 78.7394,
        "y": 78.2528,
        "w": 13.0762,
        "h": 2.9815,
        "text": "Client Satisfaction Rate",
        "font": "Glacial Indifference",
        "size": 24.0,
        "color": "#103d2e",
        "align": "left"
      }
    ]
  },

  /* ---------------- SLIDE 4 ---------------- */
  { "id": 4, "shapes": [] },

  /* ---------------- SLIDE 5 ---------------- */
  { "id": 5, "shapes": [] },

  /* ---------------- SLIDE 6 ---------------- */
  { "id": 6, "shapes": [] },

  /* ---------------- SLIDE 7 ---------------- */
  { "id": 7, "shapes": [] },

  /* ---------------- SLIDE 8 ---------------- */
  { "id": 8, "shapes": [] },

  /* ---------------- SLIDE 9 ---------------- */
  { "id": 9, "shapes": [] },

  /* ---------------- SLIDE 10 ---------------- */
  { "id": 10, "shapes": [] }
];