import { expect, test } from "@playwright/test";
import { bookFromDetail, methodButton, nextStep, pickMethodDateTime, stored } from "./helpers";

test.describe("예약", () => {
  test("상세에서 예약을 끝내면 완료 화면과 마이페이지에 남는다 (새로고침 후에도)", async ({ page }) => {
    await bookFromDetail(page);

    await expect(page.getByRole("heading", { name: "상담 예약이 완료되었습니다" })).toBeVisible();
    await expect(page.getByText("상담 전 준비사항")).toBeVisible();

    await page.getByRole("link", { name: "내 예약 확인" }).click();
    await expect(page.locator('li[data-status="upcoming"]')).toHaveCount(1);
    await expect(page.getByText("예약 확정")).toBeVisible();

    await page.reload();
    await expect(page.locator('li[data-status="upcoming"]')).toHaveCount(1);
  });

  test("예약한 시간은 다시 고를 수 없고, 취소하면 다시 열린다", async ({ page }) => {
    await bookFromDetail(page);
    const [booking] = (await stored(page)).bookings;

    // 같은 전문가·같은 상품으로 다시 들어가 같은 날짜를 고른다
    const openSameDay = async () => {
      await page.goto(`/booking/${booking.expertId}?product=${booking.productId}`);
      await methodButton(page, /화상상담/).click();
      await nextStep(page).click();
      const [, m, d] = booking.date.split("-").map(Number);
      return page.locator(`button[aria-label^="${m}월 ${d}일"]`).filter({ visible: true }).first();
    };

    const day = await openSameDay();
    if (await day.isDisabled()) {
      // 그날 남은 시간이 하나뿐이었다면 날짜 자체가 막힌다
      await expect(day).toHaveAttribute("aria-label", /예약 불가/);
    } else {
      await day.click();
      await nextStep(page).click();
      const slot = page.locator("section button", { hasText: booking.time });
      await expect(slot).toBeDisabled();
      await expect(slot).toContainText("예약됨");
    }

    await page.goto("/mypage?tab=upcoming");
    await page.getByRole("button", { name: "예약 취소" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "예약 취소" }).click();
    await page.goto("/mypage?tab=cancelled");
    await expect(page.locator('li[data-status="cancelled"]')).toHaveCount(1);

    const reopened = await openSameDay();
    await reopened.click();
    await nextStep(page).click();
    await expect(page.locator("section button", { hasText: booking.time })).toBeEnabled();
  });

  test("휴대폰 뒤로가기는 예약을 벗어나지 않고 이전 단계로 간다", async ({ page }) => {
    await page.goto("/booking/jung-mina");
    await nextStep(page).click();
    await pickMethodDateTime(page);
    await page.goBack();
    await page.goBack();
    await expect(page.getByRole("heading", { name: "어떤 방식으로 상담할까요?" })).toBeVisible();
    await expect(methodButton(page, /화상상담/)).toHaveAttribute("aria-pressed", "true");
  });

  test("상세의 날짜를 누르면 그 날짜가 선택된 채 시작한다", async ({ page }) => {
    await page.goto("/experts/park-jaehyung");
    const link = page.locator('#availability a[href*="date="]').first();
    await link.click();
    await page.waitForURL(/date=/);
    await nextStep(page).click();
    await methodButton(page, /화상상담/).click();
    await nextStep(page).click();
    // 날짜 띠(와 데스크톱 달력)에 미리 고른 날짜가 선택되어 있다
    const href = page.url().match(/date=(\d{4})-(\d{2})-(\d{2})/)!;
    const selected = page.locator('button[aria-pressed="true"][aria-label*="자리"]').filter({ visible: true }).first();
    await expect(selected).toHaveAttribute("aria-label", new RegExp(`^${Number(href[2])}월 ${Number(href[3])}일`));
    await expect(nextStep(page)).toBeEnabled();
  });

  test("잘못된 예약번호로 완료 화면에 들어오면 안내를 보여 준다", async ({ page }) => {
    await page.goto("/booking/complete?code=EM-NOPE");
    await expect(page.getByRole("heading", { name: "예약 정보를 찾을 수 없어요" })).toBeVisible();
  });
});

test("완료된 상담에 후기를 남기면 전문가 상세에 반영된다", async ({ page }) => {
  await bookFromDetail(page);
  await page.goto("/mypage?tab=upcoming");
  await page.getByRole("button", { name: /상담 완료로 표시/ }).click();
  await page.goto("/mypage?tab=done");
  await page.getByRole("button", { name: "후기 작성" }).click();

  const submit = page.getByRole("button", { name: /후기 등록|10자 이상/ });
  await expect(submit).toBeDisabled(); // 빈 후기는 등록할 수 없다
  await page.getByRole("radio", { name: "4점" }).click();
  await page.locator("#review-body").fill("방향을 명확하게 잡을 수 있었어요.");
  await page.getByRole("button", { name: "후기 등록" }).click();

  await page.goto("/experts/kim-dohyun");
  await expect(page.getByText("방향을 명확하게 잡을 수 있었어요.")).toBeVisible();
});
