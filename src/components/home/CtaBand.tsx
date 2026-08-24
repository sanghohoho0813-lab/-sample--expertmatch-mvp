import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function CtaBand() {
  return (
    <section className="shell py-14 sm:py-16 lg:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 text-center sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-teal-500/20 blur-[80px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-sky-500/15 blur-[90px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[34px]">
            혼자 검색하는 시간을 줄이고,
            <br />
            경험 있는 사람에게 바로 물어보세요
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-navy-200 sm:text-[16px]">
            회원가입 없이 데모로 전체 예약 과정을 체험할 수 있습니다.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/experts" size="lg" className="sm:px-8">
              내 고민에 맞는 전문가 찾기
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </ButtonLink>
            <ButtonLink
              href="/experts?demo=1"
              variant="outline"
              size="lg"
              className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
            >
              데모 둘러보기
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
