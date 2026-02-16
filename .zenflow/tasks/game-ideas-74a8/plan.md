# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification
<!-- chat-id: 2e015ded-0552-430e-bd00-ee1d4d97ee9c -->

**Completed**: Technical specification created at `.zenflow/tasks/game-ideas-74a8/spec.md`
- **Complexity**: Medium
- **Approach**: React + Vite, 4-lane running game with A-S-D-F controls
- **Components**: Game, Robot, GameBackground, useKeyPress hook

---

### [x] Step: Project Initialization & Setup
<!-- chat-id: b4a1a9d9-02b5-468f-8471-6c107e64f7a0 -->

Initialize the React project with Vite and set up the basic structure.

**Tasks:**
- Initialize Vite + React project using `npm create vite@latest`
- Configure package.json with dev, build, and lint scripts
- Create .gitignore for node_modules, dist, and build artifacts
- Set up basic project directory structure (components/, hooks/, styles/)
- Verify dev server runs with `npm run dev`

**Verification:**
- `npm install` completes without errors
- `npm run dev` starts development server
- Browser shows default React app

---

### [ ] Step: Core Game Components

Implement the main game components and layout structure.

**Tasks:**
- Create Game component with 4-lane layout
- Create Robot component with lane positioning system (0-3)
- Create GameBackground component with scrolling effect
- Implement CSS for 4-lane grid and basic styling
- Wire up components in App.jsx

**Verification:**
- Game renders with visible 4-lane layout
- Robot displays in initial position
- Background has scrolling animation
- No console errors

---

### [ ] Step: Keyboard Input & Animation

Add keyboard controls and running animations.

**Tasks:**
- Implement useKeyPress custom hook for A-S-D-F keys
- Connect keyboard input to robot lane switching
- Add running animation to Robot using CSS keyframes
- Implement smooth lane transition animations
- Handle edge cases (rapid presses, multiple keys)

**Verification:**
- Press A/S/D/F keys - robot moves to correct lanes
- Robot has continuous running animation
- Lane transitions are smooth
- Rapid key presses handled correctly

---

### [ ] Step: Polish & Final Verification

Polish the game visuals and perform final verification.

**Tasks:**
- Improve visual design (colors, robot character, track design)
- Optimize animations for smoothness
- Run `npm run lint` and fix any issues
- Run `npm run build` to verify production build
- Manual testing of all features
- Write implementation report to `.zenflow/tasks/game-ideas-74a8/report.md`

**Verification:**
- All lint checks pass
- Production build succeeds
- Game works smoothly in browser
- All A-S-D-F controls functional
- Report documents implementation
