(function () {
  'use strict';

  /* =========================================================
   *  EMBEDDED FIGURES TEST MODULE
   *  25 questions · 15-minute time limit · Keys 1-2-3-4
   * ========================================================= */

  // ── SVG helpers ──────────────────────────────────────────
  const S = 'http://www.w3.org/2000/svg';
  const HEAD = '<svg xmlns="' + S + '" viewBox="0 0 120 120">';
  const STYLE = ' stroke="#1a1a2e" stroke-width="2.5" fill="none" ';
  const TAIL = '</svg>';
  function svg(body) { return HEAD + body + TAIL; }
  function L(x1, y1, x2, y2) { return '<line' + STYLE + 'x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'; }
  function R(x, y, w, h) { return '<rect' + STYLE + 'x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>'; }
  function C(cx, cy, r) { return '<circle' + STYLE + 'cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
  function P(pts) { return '<polygon' + STYLE + 'points="' + pts + '"/>'; }
  function PL(pts) { return '<polyline' + STYLE + 'points="' + pts + '"/>'; }
  function PA(d) { return '<path' + STYLE + 'd="' + d + '"/>'; }
  function EL(cx, cy, rx, ry) { return '<ellipse' + STYLE + 'cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/>'; }

  // ── Question bank (25 questions) ─────────────────────────

  var questions = [
    // ── Q1 — Small triangle ─────────────────────────────────
    {
      id: 1,
      questionSvg: svg(P('60,35 40,85 80,85')),
      options: [
        // (a) square with X diagonals — NO triangle
        svg(R(20,20,80,80) + L(20,20,100,100) + L(100,20,20,100) + L(60,20,60,100) + L(20,60,100,60)),
        // (b) square with X + triangle EMBEDDED ✓
        svg(R(15,15,90,90) + L(15,15,105,105) + L(105,15,15,105) + P('60,35 40,85 80,85') + L(15,60,105,60) + L(60,15,60,105) + C(60,60,30)),
        // (c) concentric circles with lines
        svg(C(60,60,45) + C(60,60,30) + C(60,60,15) + L(15,60,105,60) + L(60,15,60,105) + L(25,25,95,95) + L(95,25,25,95)),
        // (d) diamond with cross
        svg(P('60,15 105,60 60,105 15,60') + L(60,15,60,105) + L(15,60,105,60) + R(35,35,50,50) + L(35,35,85,85) + L(85,35,35,85))
      ],
      correctIndex: 1
    },

    // ── Q2 — Small square ───────────────────────────────────
    {
      id: 2,
      questionSvg: svg(R(40,40,40,40)),
      options: [
        // (a) overlapping triangles
        svg(P('60,15 20,95 100,95') + P('60,95 20,25 100,25') + L(20,60,100,60) + L(60,15,60,95) + C(60,55,25)),
        // (b) star pattern
        svg(P('60,10 70,45 105,45 77,67 87,102 60,80 33,102 43,67 15,45 50,45') + C(60,58,20) + L(60,10,60,102)),
        // (c) rotated squares with inner square EMBEDDED ✓
        svg(P('60,10 110,60 60,110 10,60') + R(25,25,70,70) + R(40,40,40,40) + L(10,60,110,60) + L(60,10,60,110) + L(25,25,95,95) + L(95,25,25,95) + C(60,60,15)),
        // (d) hexagon with lines
        svg(P('60,15 100,37 100,83 60,105 20,83 20,37') + L(20,37,100,83) + L(100,37,20,83) + L(60,15,60,105) + C(60,60,25) + L(20,60,100,60))
      ],
      correctIndex: 2
    },

    // ── Q3 — Right-angle L-shape ────────────────────────────
    {
      id: 3,
      questionSvg: svg(PL('35,35 35,85 85,85')),
      options: [
        // (a) complex rectangles with L EMBEDDED ✓
        svg(R(15,15,90,90) + R(30,30,60,60) + PL('35,35 35,85 85,85') + L(15,15,105,105) + L(15,60,105,60) + L(60,15,60,105) + R(45,45,30,30)),
        // (b) circular pattern
        svg(C(60,60,45) + C(60,60,30) + C(60,60,15) + C(40,40,15) + C(80,80,15) + L(15,60,105,60) + L(60,15,60,105)),
        // (c) zigzag
        svg(PL('15,30 35,60 15,90 35,105') + PL('55,30 75,60 55,90 75,105') + PL('95,30 75,60 95,90') + L(15,60,105,60) + R(20,20,80,80)),
        // (d) parallel lines grid
        svg(L(20,20,20,100) + L(40,20,40,100) + L(60,20,60,100) + L(80,20,80,100) + L(100,20,100,100) + L(20,20,100,20) + L(20,50,100,50) + L(20,80,100,80) + L(20,100,100,100))
      ],
      correctIndex: 0
    },

    // ── Q4 — Diamond / rhombus ──────────────────────────────
    {
      id: 4,
      questionSvg: svg(P('60,30 85,60 60,90 35,60')),
      options: [
        // (a) star burst
        svg(L(60,10,60,110) + L(10,60,110,60) + L(20,20,100,100) + L(100,20,20,100) + L(35,15,85,105) + L(85,15,35,105) + C(60,60,20)),
        // (b) concentric squares
        svg(R(10,10,100,100) + R(25,25,70,70) + R(40,40,40,40) + L(10,10,110,110) + L(110,10,10,110) + L(60,10,60,110) + L(10,60,110,60)),
        // (c) square with diamond inside EMBEDDED ✓
        svg(R(15,15,90,90) + P('60,30 85,60 60,90 35,60') + L(15,15,60,30) + L(105,15,85,60) + L(105,105,60,90) + L(15,105,35,60) + L(60,15,60,105) + L(15,60,105,60) + C(60,60,18)),
        // (d) triangle grid
        svg(P('60,10 10,100 110,100') + P('60,100 10,20 110,20') + L(10,60,110,60) + L(35,10,35,100) + L(85,10,85,100) + L(60,10,60,100))
      ],
      correctIndex: 2
    },

    // ── Q5 — Arrow pointing up ──────────────────────────────
    {
      id: 5,
      questionSvg: svg(P('60,25 80,60 70,60 70,90 50,90 50,60 40,60')),
      options: [
        // (a) cross pattern
        svg(L(60,10,60,110) + L(10,60,110,60) + R(30,30,60,60) + L(30,30,90,90) + L(90,30,30,90) + C(60,60,35) + C(60,60,18)),
        // (b) geometric compass with arrow EMBEDDED ✓
        svg(C(60,60,48) + L(60,12,60,108) + L(12,60,108,60) + P('60,25 80,60 70,60 70,90 50,90 50,60 40,60') + L(20,20,100,100) + L(100,20,20,100) + P('60,12 65,22 55,22') + C(60,60,25)),
        // (c) parallel lines
        svg(L(20,15,20,105) + L(40,15,40,105) + L(60,15,60,105) + L(80,15,80,105) + L(100,15,100,105) + L(15,30,105,30) + L(15,60,105,60) + L(15,90,105,90) + R(15,15,90,90)),
        // (d) maze-like pattern
        svg(R(15,15,90,90) + R(30,15,30,45) + R(60,60,45,45) + L(15,60,60,60) + L(75,15,75,60) + L(30,90,90,90) + L(45,60,45,90) + L(60,30,105,30))
      ],
      correctIndex: 1
    },

    // ── Q6 — Pentagon ───────────────────────────────────────
    {
      id: 6,
      questionSvg: svg(P('60,30 88,50 78,82 42,82 32,50')),
      options: [
        // (a) hexagonal pattern
        svg(P('60,15 97,37 97,83 60,105 23,83 23,37') + L(23,37,97,83) + L(97,37,23,83) + L(60,15,60,105) + L(23,60,97,60) + C(60,60,20)),
        // (b) circle with pentagon EMBEDDED ✓
        svg(C(60,60,48) + P('60,30 88,50 78,82 42,82 32,50') + L(60,12,60,108) + L(12,60,108,60) + C(60,60,25) + L(32,50,78,82) + L(88,50,42,82) + L(60,30,60,82)),
        // (c) triangle mesh
        svg(P('60,10 10,100 110,100') + L(35,55,85,55) + L(60,10,35,55) + L(60,10,85,55) + L(35,55,60,100) + L(85,55,60,100) + L(10,100,85,55) + L(110,100,35,55)),
        // (d) square grid
        svg(R(10,10,100,100) + L(10,35,110,35) + L(10,60,110,60) + L(10,85,110,85) + L(35,10,35,110) + L(60,10,60,110) + L(85,10,85,110))
      ],
      correctIndex: 1
    },

    // ── Q7 — Small cross / plus ─────────────────────────────
    {
      id: 7,
      questionSvg: svg(P('45,35 75,35 75,45 85,45 85,75 75,75 75,85 45,85 45,75 35,75 35,45 45,45')),
      options: [
        // (a) windmill pattern
        svg(P('60,10 70,50 110,60 70,70 60,110 50,70 10,60 50,50') + C(60,60,35) + L(10,10,110,110) + L(110,10,10,110) + C(60,60,15)),
        // (b) square divisions
        svg(R(10,10,100,100) + L(10,40,110,40) + L(10,70,110,70) + L(40,10,40,110) + L(70,10,70,110) + L(10,10,110,110) + L(110,10,10,110)),
        // (c) complex cross pattern EMBEDDED ✓
        svg(R(15,15,90,90) + P('45,35 75,35 75,45 85,45 85,75 75,75 75,85 45,85 45,75 35,75 35,45 45,45') + L(15,60,105,60) + L(60,15,60,105) + C(60,60,42) + L(15,15,105,105) + L(105,15,15,105) + R(35,35,50,50)),
        // (d) circular mandala
        svg(C(60,60,48) + C(60,60,33) + C(60,60,18) + L(60,12,60,108) + L(12,60,108,60) + L(20,20,100,100) + L(100,20,20,100) + L(60,12,100,100) + L(60,12,20,100))
      ],
      correctIndex: 2
    },

    // ── Q8 — Parallelogram ──────────────────────────────────
    {
      id: 8,
      questionSvg: svg(P('45,40 90,40 75,80 30,80')),
      options: [
        // (a) tilted rectangles with parallelogram EMBEDDED ✓
        svg(R(15,20,90,80) + P('45,40 90,40 75,80 30,80') + L(15,60,105,60) + L(60,20,60,100) + P('30,20 75,20 90,50 45,50') + L(15,20,105,100) + L(105,20,15,100) + C(60,60,22)),
        // (b) diamond pattern
        svg(P('60,10 110,60 60,110 10,60') + P('60,30 90,60 60,90 30,60') + L(10,60,110,60) + L(60,10,60,110) + L(10,10,110,110) + L(110,10,10,110) + C(60,60,18)),
        // (c) triangle fan
        svg(P('60,60 20,15 60,15') + P('60,60 60,15 100,15') + P('60,60 100,15 100,60') + P('60,60 100,60 100,105') + P('60,60 100,105 60,105') + P('60,60 60,105 20,105') + P('60,60 20,105 20,60') + P('60,60 20,60 20,15')),
        // (d) concentric shapes
        svg(C(60,60,48) + R(25,25,70,70) + P('60,15 105,60 60,105 15,60') + C(60,60,22) + R(42,42,36,36) + L(60,12,60,108) + L(12,60,108,60))
      ],
      correctIndex: 0
    },

    // ── Q9 — Chevron / V-shape ──────────────────────────────
    {
      id: 9,
      questionSvg: svg(PL('30,40 60,75 90,40')),
      options: [
        // (a) arrow pattern
        svg(P('60,15 90,50 75,50 75,100 45,100 45,50 30,50') + L(15,60,105,60) + L(60,15,60,100) + R(20,20,80,80) + L(20,20,100,100)),
        // (b) zigzag grid
        svg(PL('15,30 35,60 55,30 75,60 95,30') + PL('15,60 35,90 55,60 75,90 95,60') + R(15,15,80,90) + L(15,15,95,105) + L(95,15,15,105)),
        // (c) star with chevron EMBEDDED ✓
        svg(P('60,10 72,42 108,42 80,65 90,100 60,78 30,100 40,65 12,42 48,42') + PL('30,40 60,75 90,40') + C(60,55,38) + L(12,60,108,60) + L(60,10,60,100) + C(60,55,18)),
        // (d) angular lines
        svg(L(15,15,105,105) + L(105,15,15,105) + L(15,60,105,60) + L(60,15,60,105) + L(15,30,105,90) + L(15,90,105,30) + R(25,25,70,70) + R(40,40,40,40))
      ],
      correctIndex: 2
    },

    // ── Q10 — Semicircle ────────────────────────────────────
    {
      id: 10,
      questionSvg: svg(PA('M30,60 A30,30 0 0,1 90,60') + L(30,60,90,60)),
      options: [
        // (a) circles pattern
        svg(C(60,60,45) + C(60,60,30) + C(40,40,18) + C(80,40,18) + C(60,80,18) + L(15,60,105,60) + L(60,15,60,105)),
        // (b) pie chart with semicircle EMBEDDED ✓
        svg(C(60,60,45) + PA('M30,60 A30,30 0 0,1 90,60') + L(30,60,90,60) + L(60,15,60,105) + L(15,60,105,60) + L(25,25,95,95) + L(95,25,25,95) + C(60,60,20) + PA('M60,60 L60,15 A45,45 0 0,1 105,60 Z')),
        // (c) angular pattern
        svg(P('60,10 110,35 110,85 60,110 10,85 10,35') + L(10,35,110,85) + L(110,35,10,85) + L(60,10,60,110) + L(10,60,110,60) + R(35,35,50,50)),
        // (d) square divisions
        svg(R(15,15,90,90) + R(15,15,45,45) + R(60,15,45,45) + R(15,60,45,45) + R(60,60,45,45) + L(15,15,105,105) + L(105,15,15,105) + L(37,15,37,105) + L(82,15,82,105))
      ],
      correctIndex: 1
    },

    // ── Q11 — T-shape ───────────────────────────────────────
    {
      id: 11,
      questionSvg: svg(P('30,35 90,35 90,50 68,50 68,85 52,85 52,50 30,50')),
      options: [
        // (a) grid of squares with T EMBEDDED ✓
        svg(R(10,10,100,100) + L(10,35,110,35) + L(10,60,110,60) + L(10,85,110,85) + L(35,10,35,110) + L(60,10,60,110) + L(85,10,85,110) + P('30,35 90,35 90,50 68,50 68,85 52,85 52,50 30,50')),
        // (b) circular pattern
        svg(C(60,60,48) + C(60,60,32) + C(60,60,16) + L(12,60,108,60) + L(60,12,60,108) + L(20,20,100,100) + L(100,20,20,100) + PA('M60,12 A48,48 0 0,1 108,60')),
        // (c) triangle mesh
        svg(P('60,10 10,100 110,100') + P('60,100 10,20 110,20') + L(35,55,85,55) + L(60,10,10,100) + L(60,10,110,100) + L(10,55,110,55) + C(60,60,20)),
        // (d) diamond lattice
        svg(P('60,10 110,60 60,110 10,60') + P('60,35 85,60 60,85 35,60') + L(10,60,110,60) + L(60,10,60,110) + L(35,35,85,85) + L(85,35,35,85) + R(30,30,60,60))
      ],
      correctIndex: 0
    },

    // ── Q12 — Hexagon ───────────────────────────────────────
    {
      id: 12,
      questionSvg: svg(P('60,25 90,42 90,78 60,95 30,78 30,42')),
      options: [
        // (a) star of David
        svg(P('60,10 95,90 25,35 95,35 25,90') + C(60,58,30) + L(60,10,60,110) + L(10,58,110,58) + C(60,58,15) + P('60,10 25,90 95,90') + P('60,106 25,30 95,30')),
        // (b) cubic pattern with hexagon EMBEDDED ✓
        svg(P('60,25 90,42 90,78 60,95 30,78 30,42') + L(60,25,60,95) + L(30,42,90,78) + L(90,42,30,78) + R(18,18,84,84) + L(18,18,102,102) + L(102,18,18,102) + C(60,60,42) + C(60,60,18)),
        // (c) circular rings
        svg(C(60,60,48) + C(60,60,36) + C(60,60,24) + C(60,60,12) + L(12,60,108,60) + L(60,12,60,108) + L(20,20,100,100) + L(100,20,20,100)),
        // (d) square overlap
        svg(R(15,15,60,60) + R(45,45,60,60) + R(30,30,60,60) + L(15,15,105,105) + L(45,15,15,75) + L(75,45,105,15) + L(15,45,75,105) + L(45,105,105,75))
      ],
      correctIndex: 1
    },

    // ── Q13 — Trapezoid ─────────────────────────────────────
    {
      id: 13,
      questionSvg: svg(P('40,40 80,40 95,80 25,80')),
      options: [
        // (a) angular pattern
        svg(L(10,10,110,110) + L(110,10,10,110) + L(60,10,60,110) + L(10,60,110,60) + P('60,10 110,60 60,110 10,60') + R(30,30,60,60) + C(60,60,20)),
        // (b) nested shapes
        svg(C(60,60,48) + R(22,22,76,76) + P('60,15 105,60 60,105 15,60') + C(60,60,25) + R(40,40,40,40) + L(22,22,98,98) + L(98,22,22,98)),
        // (c) house-like pattern with trapezoid EMBEDDED ✓
        svg(P('40,40 80,40 95,80 25,80') + P('60,15 40,40 80,40') + R(15,15,90,90) + L(15,80,105,80) + L(15,40,105,40) + L(40,15,40,105) + L(80,15,80,105) + L(60,15,60,105) + L(15,15,105,105) + L(105,15,15,105)),
        // (d) cross divisions
        svg(R(10,10,100,100) + L(60,10,60,110) + L(10,60,110,60) + R(35,35,50,50) + L(10,10,110,110) + L(110,10,10,110) + C(60,60,30) + C(60,60,15))
      ],
      correctIndex: 2
    },

    // ── Q14 — Star (5-point) ────────────────────────────────
    {
      id: 14,
      questionSvg: svg(P('60,15 69,43 100,43 75,60 84,90 60,73 36,90 45,60 20,43 51,43')),
      options: [
        // (a) circle with star EMBEDDED ✓
        svg(C(60,58,48) + P('60,15 69,43 100,43 75,60 84,90 60,73 36,90 45,60 20,43 51,43') + L(60,10,60,108) + L(12,58,108,58) + C(60,58,25) + L(20,20,100,96) + L(100,20,20,96)),
        // (b) square grid
        svg(R(10,10,100,100) + L(10,35,110,35) + L(10,60,110,60) + L(10,85,110,85) + L(35,10,35,110) + L(60,10,60,110) + L(85,10,85,110) + L(10,10,110,110) + L(110,10,10,110)),
        // (c) triangle layers
        svg(P('60,10 10,100 110,100') + P('60,30 25,90 95,90') + P('60,50 40,80 80,80') + L(10,60,110,60) + L(60,10,60,100) + L(10,100,110,100) + C(60,65,18)),
        // (d) hexagonal pattern
        svg(P('60,10 105,35 105,85 60,110 15,85 15,35') + P('60,30 85,42 85,78 60,90 35,78 35,42') + L(15,35,105,85) + L(105,35,15,85) + L(60,10,60,110) + L(15,60,105,60))
      ],
      correctIndex: 0
    },

    // ── Q15 — Tall rectangle ────────────────────────────────
    {
      id: 15,
      questionSvg: svg(R(45,20,30,80)),
      options: [
        // (a) complex cityscape with tall rect EMBEDDED ✓
        svg(R(45,20,30,80) + R(15,50,30,50) + R(80,40,25,60) + L(15,100,105,100) + P('15,50 30,35 45,50') + P('80,40 92,25 105,40') + L(50,30,50,90) + L(55,40,55,80) + L(60,25,60,95) + R(20,60,20,30) + R(85,55,15,35)),
        // (b) circular mandala
        svg(C(60,60,48) + C(60,60,33) + C(60,60,18) + L(60,12,60,108) + L(12,60,108,60) + L(20,20,100,100) + L(100,20,20,100) + PA('M28,28 A45,45 0 0,1 92,28') + PA('M28,92 A45,45 0 0,0 92,92')),
        // (c) diagonal lines
        svg(L(10,10,110,110) + L(30,10,110,90) + L(10,30,90,110) + L(50,10,110,70) + L(10,50,70,110) + L(70,10,110,50) + L(10,70,50,110) + L(90,10,110,30) + L(10,90,30,110)),
        // (d) triangle fan
        svg(P('60,60 10,10 60,10') + P('60,60 60,10 110,10') + P('60,60 110,10 110,60') + P('60,60 110,60 110,110') + P('60,60 110,110 60,110') + P('60,60 60,110 10,110') + P('60,60 10,110 10,60') + P('60,60 10,60 10,10'))
      ],
      correctIndex: 0
    },

    // ── Q16 — Kite shape ────────────────────────────────────
    {
      id: 16,
      questionSvg: svg(P('60,20 80,55 60,100 40,55')),
      options: [
        // (a) windmill
        svg(P('60,60 30,10 60,10') + P('60,60 110,30 110,60') + P('60,60 90,110 60,110') + P('60,60 10,90 10,60') + C(60,60,35) + L(10,10,110,110) + L(110,10,10,110) + C(60,60,15)),
        // (b) diamond pattern with kite EMBEDDED ✓
        svg(P('60,10 110,60 60,110 10,60') + P('60,20 80,55 60,100 40,55') + L(10,60,110,60) + L(60,10,60,110) + L(10,10,110,110) + L(110,10,10,110) + C(60,60,25) + R(35,35,50,50)),
        // (c) square lattice
        svg(R(10,10,100,100) + R(22,22,76,76) + R(34,34,52,52) + R(46,46,28,28) + L(10,60,110,60) + L(60,10,60,110) + L(10,10,110,110) + L(110,10,10,110)),
        // (d) radial lines
        svg(C(60,60,48) + L(60,12,60,108) + L(12,60,108,60) + L(20,20,100,100) + L(100,20,20,100) + L(60,12,100,100) + L(60,12,20,100) + L(100,12,60,108) + L(20,12,60,108))
      ],
      correctIndex: 1
    },

    // ── Q17 — Curved arc ────────────────────────────────────
    {
      id: 17,
      questionSvg: svg(PA('M30,70 Q60,20 90,70')),
      options: [
        // (a) swirl pattern
        svg(PA('M60,60 Q80,20 100,60 Q80,100 60,60') + PA('M60,60 Q40,20 20,60 Q40,100 60,60') + C(60,60,40) + C(60,60,20) + L(20,60,100,60) + L(60,20,60,100)),
        // (b) wave pattern
        svg(PA('M10,40 Q35,10 60,40 Q85,70 110,40') + PA('M10,70 Q35,40 60,70 Q85,100 110,70') + L(10,55,110,55) + R(10,15,100,90) + L(10,15,110,105) + L(110,15,10,105)),
        // (c) flower pattern with arc EMBEDDED ✓
        svg(PA('M30,70 Q60,20 90,70') + C(60,60,40) + PA('M30,50 Q60,100 90,50') + PA('M20,60 Q60,30 100,60') + PA('M20,60 Q60,90 100,60') + L(60,15,60,105) + L(15,60,105,60) + C(60,60,18) + C(60,60,8)),
        // (d) geometric maze
        svg(R(15,15,90,90) + R(30,15,30,40) + R(15,55,40,20) + R(60,55,45,20) + R(60,75,20,30) + L(30,55,30,105) + L(60,15,60,55) + L(80,55,80,105) + L(30,75,60,75))
      ],
      correctIndex: 2
    },

    // ── Q18 — Z-shape ───────────────────────────────────────
    {
      id: 18,
      questionSvg: svg(PL('30,35 80,35 30,85 80,85')),
      options: [
        // (a) zigzag grid with Z EMBEDDED ✓
        svg(R(15,15,90,90) + PL('30,35 80,35 30,85 80,85') + L(15,60,105,60) + L(60,15,60,105) + L(15,15,105,105) + L(105,15,15,105) + PL('15,35 40,60 15,85') + PL('105,35 80,60 105,85') + C(60,60,20)),
        // (b) stepped pattern
        svg(PL('15,15 45,15 45,40 75,40 75,65 105,65 105,105') + PL('15,105 15,75 45,75 45,50 75,50 75,25 105,25 105,15') + L(15,60,105,60) + L(60,15,60,105) + R(35,35,50,50)),
        // (c) angular mandala
        svg(P('60,10 110,60 60,110 10,60') + R(25,25,70,70) + P('60,25 95,60 60,95 25,60') + R(40,40,40,40) + L(10,60,110,60) + L(60,10,60,110) + C(60,60,15)),
        // (d) box divisions
        svg(R(10,10,100,100) + R(10,10,50,50) + R(60,60,50,50) + R(35,35,50,50) + L(10,10,110,110) + L(110,10,10,110) + L(60,10,60,110) + L(10,60,110,60))
      ],
      correctIndex: 0
    },

    // ── Q19 — Inverted triangle ─────────────────────────────
    {
      id: 19,
      questionSvg: svg(P('35,35 85,35 60,80')),
      options: [
        // (a) bowtie pattern with inverted triangle EMBEDDED ✓
        svg(P('35,35 85,35 60,80') + P('35,85 85,85 60,40') + R(20,20,80,80) + L(20,20,100,100) + L(100,20,20,100) + L(60,20,60,100) + L(20,60,100,60) + C(60,60,28)),
        // (b) angular web
        svg(P('60,10 110,60 60,110 10,60') + L(10,10,110,110) + L(110,10,10,110) + P('60,30 90,60 60,90 30,60') + L(30,30,90,90) + L(90,30,30,90) + C(60,60,20) + R(40,40,40,40)),
        // (c) circle segments
        svg(C(60,60,48) + L(60,12,60,108) + L(12,60,108,60) + L(20,20,100,100) + L(100,20,20,100) + C(60,60,30) + C(60,60,15) + PA('M60,12 A48,48 0 0,1 108,60')),
        // (d) grid lines
        svg(L(20,10,20,110) + L(40,10,40,110) + L(60,10,60,110) + L(80,10,80,110) + L(100,10,100,110) + L(10,20,110,20) + L(10,40,110,40) + L(10,60,110,60) + L(10,80,110,80) + L(10,100,110,100))
      ],
      correctIndex: 0
    },

    // ── Q20 — H-shape ───────────────────────────────────────
    {
      id: 20,
      questionSvg: svg(P('30,30 45,30 45,52 75,52 75,30 90,30 90,90 75,90 75,68 45,68 45,90 30,90')),
      options: [
        // (a) grid pattern
        svg(R(10,10,100,100) + L(10,35,110,35) + L(10,60,110,60) + L(10,85,110,85) + L(35,10,35,110) + L(60,10,60,110) + L(85,10,85,110) + C(60,60,30)),
        // (b) cross pattern
        svg(P('40,10 80,10 80,40 110,40 110,80 80,80 80,110 40,110 40,80 10,80 10,40 40,40') + L(10,10,110,110) + L(110,10,10,110) + C(60,60,25) + L(60,10,60,110) + L(10,60,110,60)),
        // (c) window frame with H EMBEDDED ✓
        svg(R(15,15,90,90) + P('30,30 45,30 45,52 75,52 75,30 90,30 90,90 75,90 75,68 45,68 45,90 30,90') + L(15,60,105,60) + L(60,15,60,105) + L(15,15,105,105) + L(105,15,15,105) + R(30,30,60,60) + C(60,60,18)),
        // (d) angular design
        svg(P('60,10 110,60 60,110 10,60') + L(10,60,110,60) + L(60,10,60,110) + R(30,30,60,60) + L(30,30,90,90) + L(90,30,30,90) + P('60,30 90,60 60,90 30,60') + C(60,60,15))
      ],
      correctIndex: 2
    },

    // ── Q21 — Crescent / moon ───────────────────────────────
    {
      id: 21,
      questionSvg: svg(PA('M70,25 A35,35 0 1,0 70,95 A25,25 0 1,1 70,25')),
      options: [
        // (a) overlapping circles with crescent EMBEDDED ✓
        svg(C(50,60,38) + C(70,60,38) + PA('M70,25 A35,35 0 1,0 70,95 A25,25 0 1,1 70,25') + L(12,60,108,60) + L(60,15,60,105) + C(60,60,18) + L(20,25,100,95) + L(100,25,20,95)),
        // (b) spiral
        svg(PA('M60,60 Q60,30 90,30 Q110,30 110,60 Q110,95 60,95 Q15,95 15,55 Q15,15 65,15 Q105,15 105,65') + C(60,60,38) + L(15,60,105,60) + L(60,15,60,105) + C(60,60,15)),
        // (c) star burst
        svg(L(60,5,60,115) + L(5,60,115,60) + L(15,15,105,105) + L(105,15,15,105) + L(60,5,105,105) + L(60,5,15,105) + L(5,60,105,105) + L(5,60,105,15) + C(60,60,20)),
        // (d) angular lines
        svg(L(10,20,110,20) + L(10,40,110,40) + L(10,60,110,60) + L(10,80,110,80) + L(10,100,110,100) + L(20,10,20,110) + L(50,10,50,110) + L(80,10,80,110) + L(110,10,110,110) + L(10,10,110,110))
      ],
      correctIndex: 0
    },

    // ── Q22 — Square with diagonal ──────────────────────────
    {
      id: 22,
      questionSvg: svg(R(38,38,44,44) + L(38,38,82,82)),
      options: [
        // (a) triangle fan
        svg(P('60,10 110,60 60,110 10,60') + P('60,60 60,10 110,60') + P('60,60 110,60 60,110') + P('60,60 60,110 10,60') + P('60,60 10,60 60,10') + C(60,60,30) + C(60,60,15)),
        // (b) complex square grid with sq+diag EMBEDDED ✓
        svg(R(15,15,90,90) + R(38,38,44,44) + L(38,38,82,82) + R(25,25,70,70) + L(15,15,105,105) + L(105,15,15,105) + L(60,15,60,105) + L(15,60,105,60) + C(60,60,22)),
        // (c) radial pattern
        svg(C(60,60,48) + L(60,12,60,108) + L(12,60,108,60) + L(20,20,100,100) + L(100,20,20,100) + L(60,12,108,60) + L(60,12,12,60) + L(60,108,108,60) + L(60,108,12,60) + C(60,60,20)),
        // (d) hexagonal web
        svg(P('60,10 105,35 105,85 60,110 15,85 15,35') + P('60,30 85,42 85,78 60,90 35,78 35,42') + L(15,35,105,85) + L(105,35,15,85) + L(60,10,60,110) + L(15,60,105,60) + C(60,60,18))
      ],
      correctIndex: 1
    },

    // ── Q23 — Small circle ──────────────────────────────────
    {
      id: 23,
      questionSvg: svg(C(60,60,18)),
      options: [
        // (a) target pattern with circle EMBEDDED ✓
        svg(C(60,60,48) + C(60,60,36) + C(60,60,18) + L(12,60,108,60) + L(60,12,60,108) + L(20,20,100,100) + L(100,20,20,100) + R(30,30,60,60)),
        // (b) square grid
        svg(R(10,10,100,100) + R(10,10,50,50) + R(60,60,50,50) + L(10,10,110,110) + L(110,10,10,110) + L(10,60,110,60) + L(60,10,60,110) + R(35,35,50,50)),
        // (c) angular maze
        svg(R(15,15,90,90) + R(30,15,30,45) + R(60,60,45,45) + L(15,60,60,60) + L(75,15,75,60) + L(30,90,90,90) + L(45,60,45,90) + L(60,30,105,30) + L(30,45,60,45)),
        // (d) zigzag lines
        svg(PL('10,20 30,40 10,60 30,80 10,100') + PL('50,20 70,40 50,60 70,80 50,100') + PL('90,20 110,40 90,60 110,80 90,100') + L(10,10,110,10) + L(10,110,110,110) + L(10,10,10,110) + L(110,10,110,110))
      ],
      correctIndex: 0
    },

    // ── Q24 — Lightning bolt / zigzag ───────────────────────
    {
      id: 24,
      questionSvg: svg(PL('50,20 70,50 45,55 75,95')),
      options: [
        // (a) angular mess
        svg(L(10,15,55,60) + L(55,60,20,95) + L(80,10,40,55) + L(40,55,90,100) + L(10,50,110,50) + L(60,10,60,110) + R(20,20,80,80) + P('60,10 110,60 60,110 10,60')),
        // (b) zigzag pattern with bolt EMBEDDED ✓
        svg(PL('50,20 70,50 45,55 75,95') + PL('15,20 35,50 15,80') + PL('95,30 75,60 95,90') + R(10,10,100,100) + L(10,10,110,110) + L(110,10,10,110) + L(10,55,110,55) + L(55,10,55,110) + C(60,60,22)),
        // (c) circular design
        svg(C(60,60,48) + C(60,60,33) + C(60,60,18) + L(12,60,108,60) + L(60,12,60,108) + L(20,20,100,100) + L(100,20,20,100) + PA('M12,60 A48,48 0 0,1 60,12') + PA('M108,60 A48,48 0 0,1 60,108')),
        // (d) cross pattern
        svg(L(60,10,60,110) + L(10,60,110,60) + R(30,30,60,60) + L(30,30,90,90) + L(90,30,30,90) + R(42,42,36,36) + C(60,60,38) + C(60,60,18))
      ],
      correctIndex: 1
    },

    // ── Q25 — House shape (pentagon-like) ───────────────────
    {
      id: 25,
      questionSvg: svg(P('60,20 90,50 90,90 30,90 30,50')),
      options: [
        // (a) village scene with house EMBEDDED ✓
        svg(P('60,20 90,50 90,90 30,90 30,50') + R(10,60,25,40) + P('10,60 22,45 35,60') + R(75,60,30,40) + P('75,60 90,45 105,60') + L(10,100,110,100) + L(45,90,45,70) + L(65,90,65,70) + L(45,70,65,70) + R(40,55,15,15) + L(30,50,60,20) + L(60,20,90,50)),
        // (b) abstract angular
        svg(L(10,10,110,110) + L(110,10,10,110) + L(10,60,110,60) + L(60,10,60,110) + P('60,10 110,60 60,110 10,60') + R(30,30,60,60) + P('60,30 90,60 60,90 30,60') + C(60,60,18)),
        // (c) circular mandala
        svg(C(60,60,48) + C(60,60,33) + C(60,60,18) + L(60,12,60,108) + L(12,60,108,60) + L(20,20,100,100) + L(100,20,20,100) + PA('M60,12 L108,60 L60,108 L12,60 Z') + C(60,60,8)),
        // (d) overlapping triangles
        svg(P('60,10 10,100 110,100') + P('60,110 10,20 110,20') + L(10,60,110,60) + L(60,10,60,110) + P('60,35 35,80 85,80') + P('60,85 35,40 85,40') + C(60,60,18))
      ],
      correctIndex: 0
    }
  ];

  // ── State variables ──────────────────────────────────────
  var currentQuestion = 0;
  var answers = [];          // { selected: 0-3|null, correct: bool, time: ms }
  var timerInterval = null;
  var remainingSeconds = 300; // 5 minutes
  var testStartTime = null;
  var questionStartTime = null;

  // ── DOM references (resolved lazily) ─────────────────────
  function $(id) { return document.getElementById(id); }

  // ── Public start hook ────────────────────────────────────
  function init() {
    var btn = $('start-embedded-btn');
    if (btn) {
      btn.addEventListener('click', startTest);
    }
    var resetBtn = $('emb-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetTest);
    }
    // fullscreen / exit buttons
    wireButton('emb-fullscreen-btn', toggleFullscreen);
    wireButton('emb-exit-btn', exitTest);
    wireButton('emb-results-fullscreen-btn', toggleFullscreen);
    wireButton('emb-results-exit-btn', exitTest);

    // option clicks
    for (var i = 1; i <= 4; i++) {
      (function (idx) {
        var el = $('emb-option-' + idx);
        if (el) el.addEventListener('click', function () { selectAnswer(idx - 1); });
      })(i);
    }
  }

  function wireButton(id, fn) {
    var el = $(id);
    if (el) el.addEventListener('click', fn);
  }

  // ── Test lifecycle ───────────────────────────────────────
  function startTest() {
    currentQuestion = 0;
    answers = [];
    remainingSeconds = 300;
    testStartTime = Date.now();
    window._embeddedTestRunning = true;

    showPage('emb-page');

    showQuestion();
    startTimer();
    document.addEventListener('keydown', handleKey);
  }

  function resetTest() {
    window._embeddedTestRunning = false;
    showPage('landing-page');
  }

  function exitTest() {
    stopTimer();
    window._embeddedTestRunning = false;
    document.removeEventListener('keydown', handleKey);
    finishTest();
  }

  // ── Timer ────────────────────────────────────────────────
  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(function () {
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        remainingSeconds = 0;
        stopTimer();
        finishTest();
      }
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function updateTimerDisplay() {
    var m = Math.floor(remainingSeconds / 60);
    var s = remainingSeconds % 60;
    var display = $('emb-timer-display');
    if (display) display.textContent = '00:' + pad(m) + ':' + pad(s);
    var box = $('emb-timer-box');
    if (box) {
      if (remainingSeconds < 30) box.classList.add('warning');
      else box.classList.remove('warning');
    }
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // ── Display question ─────────────────────────────────────
  function showQuestion() {
    if (currentQuestion >= questions.length) { finishTest(); return; }

    var q = questions[currentQuestion];

    // question number
    var qNum = $('emb-question-number');
    if (qNum) qNum.textContent = 'Question ' + (currentQuestion + 1) + ' / ' + questions.length;

    // question figure
    var qFig = $('emb-question-figure');
    if (qFig) qFig.innerHTML = q.questionSvg;

    // options
    var labels = ['(a)', '(b)', '(c)', '(d)'];
    for (var i = 0; i < 4; i++) {
      var opt = $('emb-option-' + (i + 1));
      if (opt) {
        opt.innerHTML = '<span class="emb-option-label">' + labels[i] + '</span><div class="emb-option-figure">' + q.options[i] + '</div>';
        opt.classList.remove('correct-flash', 'wrong-flash');
      }
    }

    // progress
    var bar = $('emb-progress-bar');
    if (bar) bar.style.width = ((currentQuestion / questions.length) * 100) + '%';

    // feedback
    var fb = $('emb-feedback');
    if (fb) fb.textContent = '';

    questionStartTime = Date.now();
  }

  // ── Answer selection ─────────────────────────────────────
  function selectAnswer(idx) {
    if (currentQuestion >= questions.length) return;

    var q = questions[currentQuestion];
    var correct = idx === q.correctIndex;
    var elapsed = Date.now() - questionStartTime;

    answers.push({ selected: idx, correct: correct, time: elapsed });

    // flash
    var optEl = $('emb-option-' + (idx + 1));
    if (optEl) {
      optEl.classList.add(correct ? 'correct-flash' : 'wrong-flash');
    }

    // feedback
    var fb = $('emb-feedback');
    if (fb) fb.textContent = correct ? '✓' : '✗';

    // advance after short delay
    setTimeout(function () {
      currentQuestion++;
      if (currentQuestion >= questions.length) {
        finishTest();
      } else {
        showQuestion();
      }
    }, 150);
  }

  // ── Keyboard handler ─────────────────────────────────────
  function handleKey(e) {
    if (!window._embeddedTestRunning) return;
    if (e.repeat) return;

    var map = {
      'Digit1': 0, 'Digit2': 1, 'Digit3': 2, 'Digit4': 3,
      'Numpad1': 0, 'Numpad2': 1, 'Numpad3': 2, 'Numpad4': 3
    };

    if (e.code in map) {
      e.preventDefault();
      selectAnswer(map[e.code]);
    }
  }

  // ── Finish & results ─────────────────────────────────────
  function finishTest() {
    stopTimer();
    window._embeddedTestRunning = false;
    document.removeEventListener('keydown', handleKey);

    var totalTime = Date.now() - testStartTime;
    var attempted = answers.length;
    var correctCount = 0;
    var wrongCount = 0;
    var skippedCount = questions.length - attempted;

    for (var i = 0; i < answers.length; i++) {
      if (answers[i].correct) correctCount++; else wrongCount++;
    }

    var accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;
    var passed = correctCount >= 13;

    // progress bar full
    var bar = $('emb-progress-bar');
    if (bar) bar.style.width = '100%';

    // show results page
    showPage('emb-results-page');

    // label
    var label = $('emb-result-label');
    if (label) {
      label.textContent = passed ? 'Passed' : 'Failed';
      label.className = passed ? 'passed' : 'failed';
    }

    // time taken
    var totalMin = Math.floor(totalTime / 60000);
    var totalSec = Math.floor((totalTime % 60000) / 1000);
    var timeTaken = pad(totalMin) + ':' + pad(totalSec);

    // stat cards
    var stats = $('emb-results-stats');
    if (stats) {
      stats.innerHTML =
        statCard('Total', questions.length, 'blue') +
        statCard('Attempted', attempted, 'purple') +
        statCard('Correct', correctCount, 'green') +
        statCard('Wrong', wrongCount, 'red') +
        statCard('Skipped', skippedCount, 'yellow') +
        statCard('Accuracy', accuracy + '%', 'green') +
        statCard('Time Taken', timeTaken, 'blue');
    }

    // table
    var tbody = $('emb-results-tbody');
    if (tbody) {
      var rows = '';
      var labels = ['(a)', '(b)', '(c)', '(d)'];
      for (var j = 0; j < questions.length; j++) {
        var ans = answers[j];
        var result, cls, tq, yourAns, correctAns;
        correctAns = labels[questions[j].correctIndex];
        if (!ans) {
          result = 'Skipped'; cls = 'skipped'; tq = '-'; yourAns = '—';
        } else {
          result = ans.correct ? 'Right' : 'Wrong';
          cls = ans.correct ? 'right' : 'wrong';
          yourAns = labels[ans.selected];
          var secs = (ans.time / 1000).toFixed(1);
          tq = secs + 's';
        }
        rows += '<tr><td>' + (j + 1) + '</td><td>' + yourAns + '</td><td>' + correctAns + '</td><td class="' + cls + '">' + result + '</td><td>' + tq + '</td></tr>';
      }
      tbody.innerHTML = rows;
    }
  }

  function statCard(label, value, color) {
    return '<div class="stat-card ' + color + '"><div class="stat-value">' + value + '</div><div class="stat-label">' + label + '</div></div>';
  }

  // ── Helpers ──────────────────────────────────────────────
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var target = $(pageId);
    if (target) target.classList.add('active');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen().catch(function () {});
    }
  }

  // ── Bootstrap ────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
