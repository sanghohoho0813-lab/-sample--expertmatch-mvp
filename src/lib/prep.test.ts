import { describe, expect, it } from "vitest";
import { EXPERT_MAP } from "@/lib/data/experts";
import { PREP_CHECKLIST, prepItems } from "@/lib/prep";

describe("prepItems", () => {
  it("puts the product's own preparation first, then the method's setup", () => {
    const expert = EXPERT_MAP["kim-dohyun"];
    const product = expert.products[1];
    const groups = prepItems({ expertId: expert.id, productId: product.id, method: "phone" });
    expect(groups[0].items).toEqual(product.prepare);
    expect(groups[1].items).toEqual(PREP_CHECKLIST.phone);
  });

  it("still works when the product no longer exists", () => {
    const groups = prepItems({ expertId: "kim-dohyun", productId: "gone", method: "video" });
    expect(groups[0].items).toEqual(PREP_CHECKLIST.video);
  });
});
