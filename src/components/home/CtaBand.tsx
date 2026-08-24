import { ArrowRight, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Portrait } from "@/components/ui/Portrait";
import { EXPERTS } from "@/lib/data/experts";

export function CtaBand() {
  const faces = EXPERTS.slice(0, 6);

  return (
    <section className="shell py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-[28px] bg-navy-900 px-6 py-14 text-center sm:px-12 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_120%_at_50%_-20%,#26457A_0%,#16294B_50%,#0C1B36_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-teal-400/16 blur-[90px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gold-400/12 blur-[100px]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-2xl">
          <div className="flex items-center justify-center">
            <div className="flex -space-x-3">
              {faces.map((e) => (
                <Portrait
                  key={e.id}
                  name={e.name}
                  accent={e.accent}
                  photo={e.photo}
                  rounded="rounded-full"
                  sizes="48px"
                  className="h-12 w-12 ring-2 ring-navy-900"
                />
              ))}
            </div>
          </div>

          <h2 className="mt-7 text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[42px]">
            혼자 검색하는 시간을 줄이고,
            <br />
            <span className="bg-gradient-to-r from-gold-200 to-gold-400 bg-clip-text text-transparent">
              경험 있는 사람
            </span>
            에게 바로 물어보세요
          </h2>
          <p className="mt-5 text-[19px] leading-relaxed text-navy-200 sm:text-[20px]">
            회원가입 없이 데모로 전체 예약 과정을 체험할 수 있습니다.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/experts" size="lg" className="sm:px-9">
              내 고민에 맞는 전문가 찾기
              <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
            </ButtonLink>
            <ButtonLink
              href="/experts?demo=1"
              variant="outline"
              size="lg"
              className="border-white/20 bg-transparent text-white hover:border-gold-300/60 hover:bg-white/10"
            >
              데모 둘러보기
            </ButtonLink>
          </div>

          <p className="mt-6 inline-flex items-center gap-1.5 text-[15px] text-navy-300">
            <ShieldCheck className="h-4 w-4 text-gold-300" strokeWidth={2.2} />
            데모 환경 · 실제 결제는 발생하지 않습니다
          </p>
        </div>
      </div>
    </section>
  );
}
