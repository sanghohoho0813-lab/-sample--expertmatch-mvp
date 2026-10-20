import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { EXPERTS } from "@/lib/data/experts";

export function CtaBand() {
  const faces = EXPERTS.slice(0, 5);

  return (
    <section className="shell pt-12 sm:pt-20">
      <div className="relative overflow-hidden rounded-[28px] bg-navy-900 px-6 py-10 text-center sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_120%_at_50%_-20%,#26457A_0%,#16294B_50%,#0C1B36_100%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-2xl">
          <div className="flex justify-center -space-x-3">
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

          <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-9xl">
            혼자 고민하지 말고,
            <br />
            <span className="text-teal-300">경험 있는 사람</span>에게 물어보세요
          </h2>
          <p className="mt-4 text-md leading-relaxed text-navy-200 sm:text-xl">
            회원가입 없이 예약까지 바로 체험할 수 있어요.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
            <Link
              href="/match"
              className="inline-flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-teal-500 px-8 text-lg font-bold text-navy-950 transition-[color,background-color,border-color,transform] hover:bg-teal-400 sm:w-auto active:scale-[0.98]"
            >
              질문 5개로 맞춤 찾기
              <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
            </Link>
            <Link
              href="/experts"
              className="inline-flex h-14 w-full items-center justify-center whitespace-nowrap rounded-2xl border border-white/25 px-8 text-lg font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              전문가 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
