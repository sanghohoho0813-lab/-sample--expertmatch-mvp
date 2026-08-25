import Image from "next/image";
import { cx } from "@/lib/format";

/**
 * 미래에이아이랩 로고.
 *
 * 원본 로고의 글자색이 짙어 어두운 배경에서는 읽히지 않으므로,
 * 어두운 면 위에서는 밝은 플레이트에 올려 원본 아트워크를 그대로 사용한다.
 */
export function MiraeLogo({
  className,
  plate = false,
  priority = false,
}: {
  className?: string;
  /** 어두운 배경 위에서 사용할 때 밝은 플레이트를 함께 렌더링 */
  plate?: boolean;
  priority?: boolean;
}) {
  const img = (
    <Image
      src="/brand/mirae-logo.png"
      alt="미래에이아이랩"
      width={756}
      height={148}
      priority={priority}
      className={cx("w-auto object-contain", className)}
    />
  );

  if (!plate) return img;

  return (
    <span className="inline-flex items-center rounded-2xl bg-white px-5 py-3.5 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.6)]">
      {img}
    </span>
  );
}

/** 로고의 심볼 마크만 사용 (작은 자리) */
export function MiraeSymbol({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/mirae-mark.png"
      alt="미래에이아이랩 심볼"
      width={222}
      height={148}
      className={cx("w-auto object-contain", className)}
    />
  );
}
