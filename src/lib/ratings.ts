/**
 * 평균 평점과 전체 후기 수에 맞는 별점 분포.
 * 화면에 보이는 샘플 후기는 일부이므로, 분포는 전체 후기 수 기준으로 계산해
 * "후기 218개"와 막대 합계가 어긋나지 않게 한다.
 */
export function ratingDistribution(rating: number, total: number) {
  const p1 = 0;
  const p2 = rating < 4.7 ? 0.01 : 0;
  const p3 = Math.min(0.06, Math.max(0.01, 0.02 + (4.9 - rating) * 0.06));
  // 평균 = 4 + p5 - p3 - 2·p2 - 3·p1 이 되도록 p5를 맞춘다
  const p5 = Math.min(1, Math.max(0, rating - 4 + p3 + 2 * p2 + 3 * p1));
  const p4 = Math.max(0, 1 - p5 - p3 - p2 - p1);

  const raw = { 5: p5, 4: p4, 3: p3, 2: p2, 1: p1 } as Record<number, number>;
  const counts = [5, 4, 3, 2, 1].map((star) => ({ star, count: Math.round(raw[star] * total) }));
  const diff = total - counts.reduce((s, c) => s + c.count, 0);
  counts[0].count += diff;
  return counts;
}
