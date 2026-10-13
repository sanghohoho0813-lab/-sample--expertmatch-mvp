import { expect, type Page } from "@playwright/test";

/** 단계 이동 버튼 ("다음: 날짜" / "다음 · 날짜") — 날짜 띠의 "다음 날짜" 화살표와 구분 */
export const nextStep = (page: Page) =>
  page.getByRole("button", { name: /^다음 ?[:·]/ }).filter({ visible: true }).first();

/** 지금 단계 본문의 상담 방식 버튼 (우측 요약의 '상담 방식' 행과 구분) */
export const methodButton = (page: Page, name: RegExp) =>
  page.locator("section").getByRole("button", { name });

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 1024;

/** 저장된 상태 읽기 (localStorage) */
export const stored = (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("expertmatch:v1") ?? "{}"));

/** 상담 방식 → 날짜(첫 가능일) → 시간(첫 가능 시간)까지 진행하고 고른 날짜·시간을 돌려준다 */
export async function pickMethodDateTime(page: Page) {
  await methodButton(page, /화상상담/).click();
  await nextStep(page).click();
  const day = page.locator('button[aria-label*="자리"]').filter({ visible: true }).first();
  const dayLabel = (await day.getAttribute("aria-label")) ?? "";
  await day.click();
  await nextStep(page).click();
  const slot = page.locator("section button[aria-pressed]:not([disabled])").first();
  const time = ((await slot.textContent()) ?? "").trim().slice(0, 5);
  await slot.click();
  await expect(slot).toHaveAttribute("aria-pressed", "true");
  return { dayLabel, time };
}

/** 상세 → 예약 완료까지 */
export async function bookFromDetail(page: Page, expertId = "kim-dohyun") {
  await page.goto(`/experts/${expertId}`);
  await page.getByRole("link", { name: "상담 예약하기" }).filter({ visible: true }).first().click();
  await page.waitForURL(/\/booking\//);
  // 예약 화면은 주소의 상품·날짜를 읽은 뒤 그려지므로 첫 단계 제목을 기다린다
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  if (await page.getByRole("heading", { name: "어떤 상담을 받으시겠어요?" }).isVisible()) {
    await nextStep(page).click();
  }
  const picked = await pickMethodDateTime(page);
  await nextStep(page).click(); // 상담 내용 (선택)
  await nextStep(page).click(); // 예약 확인
  await page.getByRole("button", { name: "상담 예약하기" }).filter({ visible: true }).first().click();
  await page.waitForURL(/\/booking\/complete\?code=/);
  return picked;
}

/* ── 저장소 미리 채우기 (예약 이후 화면을 바로 검증할 때) ── */

export const SEED_CODE = "EM-20990101-0001";

/** 오늘부터 며칠 뒤 날짜 (브라우저와 같은 Asia/Seoul 기준) */
export function dateIn(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

export function seedBooking(over: Record<string, unknown> = {}) {
  return {
    id: "seed-1",
    code: SEED_CODE,
    expertId: "kim-dohyun",
    expertName: "김도현",
    expertTitle: "스타트업 전략 · 사업개발 파트너",
    expertAccent: 0,
    categoryName: "창업",
    productId: "p2",
    productName: "60분 집중 상담",
    minutes: 60,
    price: 90000,
    method: "phone",
    date: dateIn(3),
    time: "10:00",
    note: "",
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    status: "upcoming",
    ...over,
  };
}

/** 첫 방문에만 저장소를 채운다 (이후 이동·새로고침에서는 앱이 쓴 값을 유지) */
export async function seed(page: Page, state: Record<string, unknown>) {
  await page.addInitScript((s) => {
    if (sessionStorage.getItem("e2e-seeded")) return;
    localStorage.setItem("expertmatch:v1", JSON.stringify(s));
    sessionStorage.setItem("e2e-seeded", "1");
  }, state);
}
