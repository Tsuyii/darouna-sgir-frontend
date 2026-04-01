# Design System Document: Premium Property Management PWA

## 1. Overview & Creative North Star: "The Verdant Sanctuary"
The Creative North Star for this design system is **"The Verdant Sanctuary."** In the realm of property management, we move away from the cold, industrial feel of traditional "dashboards." Instead, we embrace a high-end editorial experience that feels like flipping through a luxury architectural digest. 

We achieve this through **Organic Glassmorphism**—a style that prioritizes light, transparency, and depth. The design breaks the "template" look by using intentional white space, overlapping glass cards that break the container grid, and a hierarchy driven by tonal shifts rather than rigid lines.

---

## 2. Colors & Surface Philosophy
The palette is anchored in a sophisticated "Clean Cream" (#FAF9F6) which provides a warmer, more human foundation than pure white.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Boundaries must be established through:
1.  **Background Color Shifts:** Placing a `surface-container-low` section against a `surface` background.
2.  **Tonal Transitions:** Using subtle shifts in the cream spectrum to imply containment.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of frosted glass. 
*   **Base:** `surface` (#FAF9F6)
*   **Low Elevation:** `surface-container-low` (#F4F3F1) for large secondary sections.
*   **High Elevation:** `surface-container-lowest` (#FFFFFF) for primary content cards to create a "pop" against the cream.

### The "Glass & Gradient" Rule
Primary elements (Hero CTAs, Active States) must utilize the **Vibrant Emerald Gradient** (`#064E3B` to `#10B981`). To achieve the "Premium" feel:
*   Apply a `backdrop-filter: blur(12px)` to floating glass elements.
*   Use `primary-container` (#71AF97) at 40% opacity for glass backgrounds to allow the cream base to breathe through.
*   **Signature Texture:** Add a 1px inner "light leak" (a top-left inner shadow in white at 30% opacity) to gradient buttons to simulate high-gloss glass.

---

## 3. Typography: Editorial Authority
The typography pairing balances the approachability of *Nunito Sans* with the professional precision of *Montserrat*.

*   **Display & Headlines (Nunito Sans):** Used for property names and major section headers. The rounded terminals of Nunito Sans complement the `md` (12px) corner radius of our components.
*   **Body & Labels (Montserrat):** Used for data, descriptions, and functional UI. Its geometric nature provides the "institutional" trust required for property management.

**Hierarchy Strategy:** 
Use extreme scale contrast. A `display-lg` headline should sit near `body-md` metadata to create an editorial, "poster-like" layout.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too heavy for a "Sanctuary." We use **Ambient Depth**.

*   **The Layering Principle:** Instead of shadows, stack `surface-container-lowest` (#FFFFFF) cards on top of `surface-container` (#EFEEEB) backgrounds.
*   **Ambient Shadows:** If a card must float (e.g., a modal or a floating action button), use:
    *   `box-shadow: 0 20px 40px rgba(43, 105, 84, 0.06);` (A tinted shadow using the `primary` color rather than grey).
*   **The "Ghost Border" Fallback:** For accessibility in forms, use `outline-variant` (#BBCABF) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Cards & Containers
*   **Corner Radius:** Consistently use `md` (12px / 0.75rem) for content cards.
*   **Structure:** No dividers. Use `spacing-6` (2rem) to separate internal card content. Use background color shifts for card headers.

### Buttons (The "Gloss" Variant)
*   **Primary:** Vibrant Emerald Gradient with a subtle `white` inner glow (top-left).
*   **Secondary:** Glass-style. `surface-container-lowest` at 60% opacity with a `backdrop-filter: blur(8px)`.
*   **Interaction:** On hover, increase the gradient intensity and reduce blur for a "clearer" glass look.

### Input Fields
*   **Style:** Minimalist. No bottom line or full border. Use a `surface-container-low` background with a `sm` (4px) radius.
*   **Focus State:** Transition the background to `primary-fixed` (#B0F0D6) at 20% opacity with a `ghost border`.

### Property-Specific Components
*   **Status Badges:** Use `tertiary-container` (#0DB6A4) with `on-tertiary-container` text. Apply a 10% opacity to the background for a "tinted glass" look.
*   **Metric Glazes:** For property yield or occupancy stats, use semi-transparent cards with `headline-sm` typography to make the data the "hero."

---

## 6. Do’s and Don’ts

### Do:
*   **Do** allow elements to overlap. A glass card can partially cover a background image or a gradient blob to emphasize transparency.
*   **Do** use `spacing-12` and `spacing-16` for section breathing room. Luxury is defined by "wasted" space.
*   **Do** use the `primary` emerald gradient sparingly—only for the most important actions to maintain its "vibrant" impact.

### Don’t:
*   **Don't** use pure black (#000000) for text. Use `on-surface` (#1A1C1A) to keep the contrast soft against the cream.
*   **Don't** use 1px dividers. Use vertical whitespace or a 4px height `surface-variant` block if separation is desperately needed.
*   **Don't** use standard "Drop Shadows." If the element doesn't feel like it's lifting naturally via color, it shouldn't be floating.

---

## 7. Token Reference Summary
*   **Primary Action:** `primary` (#2B6954) → `primary-container` (#71AF97) Gradient.
*   **Main Background:** `surface` (#FAF9F6).
*   **Card Background:** `surface-container-lowest` (#FFFFFF).
*   **Corner Radius:** `md` (0.75rem).
*   **Typography:** Nunito Sans (Headlines) / Montserrat (Body).