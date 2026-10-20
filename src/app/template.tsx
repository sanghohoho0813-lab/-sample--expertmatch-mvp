/**
 * 화면을 옮길 때마다 본문이 아주 짧게(200ms) 떠오르듯 나타난다.
 * 투명도만 쓰고 채움(fill)을 남기지 않아, 끝난 뒤에는 쌓임 맥락·고정 요소에 영향이 없다.
 * (움직임 줄이기 설정에서는 전역 규칙으로 사실상 즉시 표시)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-[fade-in_200ms_ease-out]">{children}</div>;
}
