export type NoticeCategory = "공지" | "행사" | "규정" | "일반";

export interface Notice {
  id: string;
  title: string;
  body: string; // 문단은 "\n" 으로 구분
  category: NoticeCategory;
  pinned: boolean;
  author: string;
  date: string; // ISO yyyy-mm-dd
}

export type SuggestionStatus = "접수" | "검토중" | "답변완료" | "보류";
export type SuggestionCategory =
  | "제도개선"
  | "영업지원"
  | "복지/환경"
  | "교육"
  | "기타";

export interface SuggestionReply {
  body: string;
  date: string;
  author: string;
}

export interface Suggestion {
  id: string;
  title: string;
  body: string;
  category: SuggestionCategory;
  author: string; // 익명이면 "익명"
  anonymous: boolean;
  date: string;
  status: SuggestionStatus;
  votes: number; // 공감 수
  reply?: SuggestionReply;
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number; // 연간 배정액 (원)
  note?: string;
}

export type TxnType = "수입" | "지출";

export interface Transaction {
  id: string;
  date: string;
  type: TxnType;
  categoryId?: string; // 지출일 때 예산 항목
  source?: string; // 수입일 때 재원 출처
  description: string;
  amount: number; // 원
}

export type MeetingStatus = "예정" | "완료";

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  status: MeetingStatus;
  agenda: string[];
  summary?: string; // 완료된 회의의 회의록 요약
}

export interface Member {
  role: string;
  name: string;
  branch: string;
}

export interface AppState {
  notices: Notice[];
  suggestions: Suggestion[];
  budgetCategories: BudgetCategory[];
  transactions: Transaction[];
  meetings: Meeting[];
  members: Member[];
}
