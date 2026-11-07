import { ReviewsService } from '../src/reviews/reviews.service';

describe('SM-2 Spaced Repetition Core Logic', () => {
  let reviewsService: ReviewsService;

  beforeEach(() => {
    // Instantiate with mock prisma
    reviewsService = new ReviewsService({} as any);
  });

  it('should maintain initial interval of 1 on first successful review (repetitions=0, grade=4)', () => {
    const result = reviewsService.calculateSM2(2.5, 1, 0, 4);
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
    expect(result.easeFactor).toBe(2.5); // 2.5 + (0.1 - (1) * (0.08 + 0.02)) = 2.5 + 0 = 2.5
  });

  it('should increase interval to 6 on second successful review (repetitions=1, grade=4)', () => {
    const result = reviewsService.calculateSM2(2.5, 1, 1, 4);
    expect(result.interval).toBe(6);
    expect(result.repetitions).toBe(2);
    expect(result.easeFactor).toBe(2.5);
  });

  it('should scale interval by ease factor on subsequent reviews (repetitions=2, grade=5)', () => {
    // grade 5 -> EF increases: 2.5 + (0.1 - 0) = 2.6
    // interval = Math.round(6 * 2.6) = 16
    const result = reviewsService.calculateSM2(2.5, 6, 2, 5);
    expect(result.easeFactor).toBe(2.6);
    expect(result.interval).toBe(16);
    expect(result.repetitions).toBe(3);
  });

  it('should reset interval to 1 and repetitions to 0 on failure (grade < 3)', () => {
    const result = reviewsService.calculateSM2(2.4, 25, 4, 1);
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
    // EF should drop but never below 1.3
    expect(result.easeFactor).toBeLessThan(2.4);
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('should never let easeFactor drop below minimum bound of 1.3', () => {
    const result = reviewsService.calculateSM2(1.35, 10, 3, 0);
    expect(result.easeFactor).toBe(1.3);
  });
});
