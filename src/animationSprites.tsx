export const openSprite = new Path2D("M5 4C5 4 3 14 3 15 4 15 3 32 2 32 2 33 1 25 0 25 0 25-1 34-2 33-3 30-4 14-4 14-4 14-7 5-7 5-12-3-37 15-39 19-44 15-25-4-15-9-13-10-5-10-6-9-6-12-4-16-2-17-1-18 1-18 0-17L3-10C10-15 37 5 37 14 31 7 17 2 8 2")
export const semiOpenSprite = new Path2D("M4 5C4 5 2 15 2 16 3 16 2 33 1 33 1 34 0 26-1 26-1 26-2 35-3 34-4 31-5 15-5 15-5 15-8 6-8 6-12-1-22 12-26 20-23 0-14-9-7-8-7-11-5-15-3-16-2-17 0-17-1-16L2-9C9-14 28 7 24 21 20 9 16 3 7 3")
export const semiClosedSprite = new Path2D("M6 3C3 3 3 12 3 13 4 13 3 30 2 30 2 31 1 23 0 23 0 23-1 32-2 31-3 28-4 12-4 12-4 12-7 3-7 3-12 1-15 5-14 23-22 12-21-1-14-8-12-10-5-12-6-11-6-14-4-18-2-19-1-20 1-20 0-19L3-12C15-10 24 3 9 23 12 10 11 1 6 3")
export const closedSprite = new Path2D("M4 4C3 4 3 13 3 14 4 14 3 31 0 33 0 33 1 24 0 24 0 24-1 33-5 32-3 29-4 13-4 13-4 13-7 4-7 4-9 4-7 15-5 27-11 10-12-2-10-7-9-10-5-11-6-10-6-13-4-16-2-18-1-19 1-19 0-18L3-11C10-7 11 8 4 26 5 15 7 6 4 4")

// Sprites which are cycled between when the boid is travelling straight
export const straightSprites: Path2D[] = [openSprite, semiOpenSprite]

// Sprites which are cycled between when the boid is turning 
export const turningSprites: Path2D[] = [closedSprite, semiClosedSprite]
