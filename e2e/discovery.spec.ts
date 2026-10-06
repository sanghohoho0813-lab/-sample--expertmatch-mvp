import { expect, test } from "@playwright/test";
import { isMobile, stored } from "./helpers";

test("검색하면 조건 일치 이유와 가장 빠른 예약 시간이 보인다", async ({ page }) => {
  await page.goto("/experts?q=" + encodeURIComponent("투자"));
  await expect(page.getByLabel("조건 일치 이유").first()).toBeVisible();
  await expect(page.getByText(/가장 빠른 예약/).first()).toBeVisible();
});

test("결과가 없으면 추천 검색어로 다시 찾을 수 있다", async ({ page }) => {
  await page.goto("/experts?q=zzzqqq");
  await expect(page.getByText("조건에 맞는 전문가가 없습니다")).toBeVisible();
  await page.getByRole("button", { name: "마케팅", exact: true }).filter({ visible: true }).first().click();
  await expect(page.getByRole("status").filter({ hasText: "검색 결과" })).not.toContainText(" 0명");
});

test("비교는 2명부터 — 1명이면 더 담으라고 안내한다", async ({ page }) => {
  await page.goto("/experts");
  const compare = page.getByRole("button", { name: /비교하기$/ });
  await compare.first().click();
  await expect(page.getByRole("button", { name: "1명 더 담아 주세요" })).toBeDisabled();

  await compare.first().click(); // 다음 전문가 (앞의 버튼은 '비교 해제'로 바뀜)
  await page.getByRole("button", { name: /^2명 비교하기/ }).click();
  const dialog = page.getByRole("dialog");
  for (const row of ["전문 분야", "경력", "상담료", "가장 빠른 예약", "평점"]) {
    // 데스크톱은 표, 모바일은 세로 카드 — 보이는 쪽만 확인
    await expect(dialog.getByText(row, { exact: true }).filter({ visible: true }).first()).toBeVisible();
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.reload();
  expect((await stored(page)).compare).toHaveLength(2);
});

test("찜은 새로고침 후에도 유지되고 마이페이지에 보인다", async ({ page }) => {
  await page.goto("/experts");
  await page.getByRole("button", { name: /김도현 찜하기/ }).click();
  await page.reload();
  await page.goto("/mypage?tab=favorites");
  await expect(page.getByRole("heading", { name: /김도현/ })).toBeVisible();
});

test("헤더의 '상담 분야'는 같은 페이지에서도 다시 열린다", async ({ page }) => {
  test.skip(isMobile(page), "데스크톱 내비게이션");
  await page.goto("/experts");
  for (let i = 0; i < 2; i += 1) {
    await page.getByRole("navigation").getByRole("link", { name: "상담 분야" }).first().click();
    await expect(page.getByRole("dialog", { name: "상담 분야" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "상담 분야" })).toBeHidden();
  }
});

test("대화상자는 포커스를 가두고 닫히면 원래 버튼으로 돌려준다", async ({ page }) => {
  await page.goto("/experts");
  await page.getByRole("button", { name: /비교하기$/ }).first().click();
  await page.getByRole("button", { name: /비교하기$/ }).first().click();
  const opener = page.getByRole("button", { name: /^2명 비교하기/ });
  await opener.click();
  const dialog = page.getByRole("dialog");
  for (let i = 0; i < 15; i += 1) await page.keyboard.press("Tab");
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});

test("다른 탭에서 바꾼 찜이 이 탭에도 반영된다", async ({ page, context }) => {
  await page.goto("/mypage?tab=favorites");
  await expect(page.getByText("찜한 전문가가 없어요")).toBeVisible();
  const other = await context.newPage();
  await other.goto("/experts");
  await other.getByRole("button", { name: /정민아 찜하기/ }).click();
  await expect(page.getByRole("heading", { name: /정민아/ })).toBeVisible();
});
