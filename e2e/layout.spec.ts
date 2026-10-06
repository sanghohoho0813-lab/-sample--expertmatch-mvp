import { expect, test } from "@playwright/test";

const PAGES = ["/", "/experts", "/experts/kim-dohyun", "/booking/kim-dohyun", "/mypage", "/chat", "/about", "/booking/complete"];

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
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("없는 전문가 주소는 404 안내를 보여 준다", async ({ page }) => {
  const res = await page.goto("/experts/nobody");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다" })).toBeVisible();
});
