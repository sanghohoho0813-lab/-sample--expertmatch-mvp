import { expect, test } from "@playwright/test";
import { SEED_CODE, noHorizontalOverflow, seed, seedBooking } from "./helpers";

const PAGES = [
  "/",
  "/experts",
  "/experts/kim-dohyun",
  "/match",
  "/match/result?topic=startup&who=founder&method=video&budget=80000&when=week",
  "/compare",
  "/booking/kim-dohyun",
  "/booking/reschedule",
  "/mypage",
  "/chat",
  "/about",
  "/booking/complete",
];

for (const path of PAGES) {
  test(`가로 스크롤·콘솔 오류 없음 ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      // 외부 웹폰트 CDN 차단 등 네트워크 실패는 앱 오류가 아니다
      if (m.type() === "error" && !/net::ERR|Failed to load resource/.test(m.text())) errors.push(m.text());
    });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    // 모바일 에뮬레이션에서는 내용이 넘치면 innerWidth 도 함께 늘어나므로 clientWidth 와 비교한다
    const overflow = await noHorizontalOverflow(page);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("없는 전문가 주소는 404 안내를 보여 준다", async ({ page }) => {
  const res = await page.goto("/experts/nobody");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다" })).toBeVisible();
});

/* 로딩 자리표시가 실제 배치와 달라 내용이 그려질 때 화면이 밀리면 안 된다 (CLS 0.1 = '좋음' 기준) */
const SHIFT_PAGES = [
  `/booking/complete?code=${SEED_CODE}`,
  "/match/result?topic=startup&method=video",
  "/compare?ids=kim-dohyun,jang-minho",
  `/chat?code=${SEED_CODE}`,
  "/experts",
  "/mypage?tab=upcoming",
];

for (const path of SHIFT_PAGES) {
  test(`로딩 후 화면이 밀리지 않음 ${path}`, async ({ page }) => {
    await seed(page, { bookings: [seedBooking()] });
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
          if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1200);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.1);
  });
}
