import { METHOD_LABEL } from "@/lib/data/categories";
import type { Booking, ConsultMethod } from "@/lib/types";

/** 상담 방식별 사전 준비사항 */
export const PREP_CHECKLIST: Record<ConsultMethod, string[]> = {
  video: [
    "조용한 공간과 안정적인 인터넷을 준비해 주세요",
    "카메라·마이크를 미리 확인해 주세요",
    "함께 볼 자료가 있다면 화면에 띄워 두세요",
  ],
  phone: [
    "통화하기 편한 조용한 공간을 준비해 주세요",
    "상담 시간 5분 전에 전화를 받을 수 있게 해 주세요",
    "메모할 수 있는 종이나 앱을 준비해 두세요",
  ],
  chat: [
    "상담 시작 시간에 채팅방에 접속해 주세요",
    "관련 자료는 사진이나 파일로 미리 준비해 두세요",
    "질문을 순서대로 정리해 두면 답변이 빨라요",
  ],
};

export const PREP_COMMON = [
  "가장 궁금한 질문 2~3개를 미리 적어 두세요",
  "일정 변경은 상담 24시간 전까지 가능해요",
];

function icsStamp(dateKey: string, time: string, addMinutes = 0) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const date = new Date(y, m - 1, d, hh, mm + addMinutes);
  const p = (n: number) => `${n}`.padStart(2, "0");
  return `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}T${p(date.getHours())}${p(date.getMinutes())}00`;
}

function icsEscape(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

/** 캘린더 앱에 추가할 수 있는 .ics 파일 내용 (현지 시간 기준) */
export function buildIcs(booking: Booking): string {
  const summary = `${booking.expertName} 전문가 ${METHOD_LABEL[booking.method]}`;
  const description = [
    `${booking.productName} · ${booking.minutes}분`,
    `예약번호 ${booking.code}`,
    "(sample) ExpertMatch 데모 예약",
  ].join("\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MiraeAILab//ExpertMatch Demo//KO",
    "BEGIN:VEVENT",
    `UID:${booking.code}@expertmatch.demo`,
    `DTSTAMP:${icsStamp(booking.date, booking.time)}`,
    `DTSTART:${icsStamp(booking.date, booking.time)}`,
    `DTEND:${icsStamp(booking.date, booking.time, booking.minutes)}`,
    `SUMMARY:${icsEscape(summary)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(summary)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(booking: Booking) {
  const blob = new Blob([buildIcs(booking)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expertmatch-${booking.code}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
