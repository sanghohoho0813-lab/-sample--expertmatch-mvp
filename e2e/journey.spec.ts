import { expect, test, type Page } from "@playwright/test";
import { SEED_CODE, bookFromDetail, methodButton, nextStep, seed, seedBooking, stored } from "./helpers";

/** 맞춤 찾기 5문항에 답한다 */
async function answerMatch(page: Page, answers: RegExp[]) {
  await page.goto("/match");
  for (let i = 0; i < answers.length; i += 1) {
    await expect(page.getByText(`${i + 1} / 5`)).toBeVisible();
    await page.getByRole("button", { name: answers[i] }).first().click();
  }
  await page.waitForURL(/\/match\/result\?/);
  await expect(page.getByRole("heading", { name: "먼저 살펴볼 전문가" })).toBeVisible();
}

const STARTUP_VIDEO = [/^창업/, /^예비·초기 창업자/, /^화상상담/, /^12만 원 이하/, /^2주 안에/];

test.describe("맞춤 찾기", () => {
  test("답에 맞는 전문가를 실제 데이터 근거와 함께 추천하고, 한 번에 비교로 넘긴다", async ({ page }) => {
    await answerMatch(page, STARTUP_VIDEO);

    // 조건 요약 + 조건별 대조 결과 (점수·매칭률 없이)
    for (const chip of ["창업", "예비·초기 창업자", "화상상담", "12만 원 이하", "2주 안에"]) {
      await expect(page.getByText(chip, { exact: true }).first()).toBeVisible();
    }
    const fits = page.getByRole("list", { name: "내 조건과 비교" });
    await expect(fits.first()).toBeVisible();
    await expect(fits.first()).toContainText("창업");
    await expect(page.locator("main")).not.toContainText("%");

    await page.getByRole("button", { name: /^추천 \d명 비교하기/ }).click();
    await page.waitForURL(/\/compare$/);
    await expect(page.getByRole("heading", { name: "이런 경우에는 이 전문가" })).toBeVisible();
    // 맞춤 찾기 조건으로도 대조한다
    await expect(page.getByText(/맞춤 찾기에서 답한 조건/)).toBeVisible();
    expect((await stored(page)).compare).toHaveLength(3);
  });

  test("뒤로 가면 이전 질문으로 돌아가고 고른 답이 남아 있다", async ({ page }) => {
    await page.goto("/match");
    await page.getByRole("button", { name: /^세무/ }).click();
    await expect(page.getByText("2 / 5")).toBeVisible();
    await page.goBack();
    await expect(page.getByText("1 / 5")).toBeVisible();
    await expect(page.getByRole("button", { name: /^세무/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("결과를 새로고침해도 같은 조건으로 다시 보여 준다", async ({ page }) => {
    await page.goto("/match/result?topic=tax&method=phone");
    await expect(page.getByText("전화상담", { exact: true }).first()).toBeVisible();
    await page.reload();
    await expect(page.getByText("세무", { exact: true }).first()).toBeVisible();
    expect((await stored(page)).needs).toMatchObject({ topic: "tax", method: "phone" });
  });

  test("남긴 고민과 고른 방식이 예약 화면에 미리 채워진다", async ({ page }) => {
    await answerMatch(page, STARTUP_VIDEO);
    const memo = "예비창업패키지 서류를 준비 중이에요.";
    const box = page.getByPlaceholder(/온라인 쇼핑몰/);
    await box.fill(memo);
    await box.blur();
    await expect(page.getByText("저장했어요")).toBeVisible();

    await page.goto("/booking/kim-dohyun?product=p1");
    await expect(page.getByRole("heading", { name: "어떤 방식으로 상담할까요?" })).toBeVisible();
    await expect(methodButton(page, /화상상담/)).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/맞춤 찾기에서 고른 방식이에요/)).toBeVisible();

    await nextStep(page).click();
    await page.locator('button[aria-label*="자리"]').filter({ visible: true }).first().click();
    await nextStep(page).click();
    await page.locator("section button[aria-pressed]:not([disabled])").first().click();
    await nextStep(page).click();
    await expect(page.locator("#booking-note")).toHaveValue(memo);
    await expect(page.getByText("맞춤 찾기에서 적은 고민을 옮겨 왔어요")).toBeVisible();
  });
});

test.describe("예약 이후", () => {
  test("상담 전 준비 체크는 저장돼 다시 열어도 남아 있다", async ({ page }) => {
    await seed(page, { bookings: [seedBooking()] });
    await page.goto(`/booking/complete?code=${SEED_CODE}`);
    const first = page.getByRole("checkbox").first();
    await expect(first).toHaveAttribute("aria-checked", "false");
    await first.click();
    await expect(first).toHaveAttribute("aria-checked", "true");
    await page.reload();
    await expect(page.getByRole("checkbox").first()).toHaveAttribute("aria-checked", "true");
    // 상품별 준비물(전문가가 정한 것)이 먼저 나온다
    await expect(page.getByText("사업 소개 자료(있다면)")).toBeVisible();
  });

  test("일정을 바꾸면 이전 일정이 기록되고 새 시간으로 저장된다", async ({ page }) => {
    await bookFromDetail(page);
    const [before] = (await stored(page)).bookings;

    await page.getByRole("link", { name: "일정 변경" }).click();
    await page.waitForURL(/\/booking\/reschedule\?code=/);
    await expect(page.getByText("지금 일정")).toBeVisible();
    // 다른 날짜의 첫 시간으로
    const days = page.locator('button[aria-label*="자리"]:not([disabled])').filter({ visible: true });
    await days.nth(1).click();
    await page.locator("#reschedule-time button[aria-pressed]:not([disabled])").first().click();
    await page.getByRole("button", { name: "이 일정으로 변경" }).filter({ visible: true }).first().click();

    await page.waitForURL(/\/booking\/complete\?code=/);
    await expect(page.getByText("에서 변경됨")).toBeVisible();
    const [after] = (await stored(page)).bookings;
    expect(after.id).toBe(before.id);
    expect(after.rescheduledFrom).toEqual({ date: before.date, time: before.time });
    expect(`${after.date} ${after.time}`).not.toBe(`${before.date} ${before.time}`);
  });

  test("상담방은 시작 전에는 잠겨 있고, 전달할 내용을 미리 고칠 수 있다", async ({ page }) => {
    await seed(page, { bookings: [seedBooking({ note: "처음 적은 내용" })] });
    await page.goto(`/chat?code=${SEED_CODE}`);
    await expect(page.getByRole("heading", { name: "아직 입장 전이에요" })).toBeVisible();
    await expect(page.getByRole("button", { name: "전화상담 입장" })).toBeDisabled();

    await page.getByRole("button", { name: "고치기" }).click();
    await page.getByLabel("전문가에게 전달할 내용").fill("자료를 미리 보내 드릴게요.");
    await page.getByRole("button", { name: "저장" }).click();
    await expect(page.getByText("자료를 미리 보내 드릴게요.")).toBeVisible();
    expect((await stored(page)).bookings[0].note).toBe("자료를 미리 보내 드릴게요.");
  });

  test("끝난 상담에서 같은 전문가에게 재상담을 예약하면 지난 상담이 이어진다", async ({ page }) => {
    await seed(page, { bookings: [seedBooking({ status: "done", date: "2026-09-01" })] });
    await page.goto(`/booking/complete?code=${SEED_CODE}`);
    await expect(page.getByRole("heading", { name: "상담은 어떠셨나요?" })).toBeVisible();

    await page.getByRole("link", { name: /재상담/ }).click();
    await page.waitForURL(/rebook=/);
    // 지난 상담과 같은 방식이 골라져 있다
    await expect(methodButton(page, /전화상담/)).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/지난 상담과 같은 방식이에요/)).toBeVisible();
    await nextStep(page).click();
    await page.locator('button[aria-label*="자리"]').filter({ visible: true }).first().click();
    await nextStep(page).click();
    await page.locator("section button[aria-pressed]:not([disabled])").first().click();
    await nextStep(page).click();
    await expect(page.locator("#booking-note")).toHaveValue(/지난 상담\(.+\) 이후 이어서/);
    await nextStep(page).click();
    await page.getByRole("button", { name: "상담 예약하기" }).filter({ visible: true }).first().click();
    await page.waitForURL(/\/booking\/complete\?code=/);
    const fresh = (await stored(page)).bookings.find((b: { code: string }) => b.code !== SEED_CODE);
    expect(fresh.rebookOf).toBe(SEED_CODE);
  });
});

test("전문가 상세는 맞는 사람·결과·상품별 차이를 보여 주고, 상품으로 바로 예약을 시작한다", async ({ page }) => {
  await page.goto("/experts/kim-dohyun");
  await expect(page.getByRole("heading", { name: "이런 고민이라면 도움이 돼요" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "상담 후 얻는 것" })).toBeVisible();
  await expect(page.getByText("이런 경우에 고르세요").first()).toBeVisible();
  await page.getByRole("link", { name: "90분 사업계획서 리뷰 90분으로 예약" }).click();
  await page.waitForURL(/product=p3/);
  await expect(page.getByRole("heading", { name: "어떤 방식으로 상담할까요?" })).toBeVisible();
});
