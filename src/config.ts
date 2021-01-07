// Debug
export const SPAWN_DEBUG_BIRD = false
export const ENABLE_VISION_DEBUG = true

// Boid behaviour
export const ALIGNMENT_WITH_OTHERS_COUNT = 7
export const PROJECTION_SECTOR_COUNT = 360
export const SHADOW_SIZE = 20
export const COLLISION_LOOKAHEAD = 30
export const VISION_RANGE = 100
export const BOX_VISION_RANGE = 25
export const MOUSE_VISION_RANGE = 400
export const MAX_TURN_ANGLE = (Math.PI / 180.0) * 10
export const BOUNDARY_PADDING = 15
export const BOID_SPEED = 2.2

// Animation
export const TURN_ANIMATION_THRESHOLD_ANGLE = MAX_TURN_ANGLE * 0.3
export const ANIMATION_FRAME_HOLD = 8
export const MIN_TURN_FRAMES_FOR_ANIMATION_CHANGE =5

// Overall
export const INITIAL_BOID_COUNT = 150
