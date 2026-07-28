"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { addMyPostId, supabase } from "@/lib/supabase";

export default function WritePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messageEmpty = message.trim() === "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // 관문: 이름 또는 메시지가 비어 있으면 저장하지 않는다 (입력값 유지)
    if (name.trim() === "" || message.trim() === "") {
      setError("이름과 한마디를 모두 입력해 주세요");
      return;
    }

    setSubmitting(true);
    setError(null);

    const { data: inserted, error: insertError } = await supabase
      .from("posts")
      .insert({ name: name.trim(), message: message.trim() })
      .select()
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(`저장하지 못했어요: ${insertError.message}`);
      return;
    }

    if (inserted) addMyPostId(inserted.id);
    router.push("/");
  }

  return (
    <main className="phone-shell min-h-screen max-w-[430px] mx-auto relative px-4 py-7">
      <div className="phone-frame min-h-[calc(100vh-56px)] rounded-[42px] px-4 pt-7 pb-5 flex flex-col">
        <div aria-hidden="true" className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-[#989082] shadow-inner" />
        <form onSubmit={handleSubmit} className="lcd-screen rounded-[7px] overflow-hidden flex-1 flex flex-col">
          <header className="bg-[#5a716a] px-3 py-1.5 flex items-center justify-between text-[#f6f8e9] font-mono text-[10px] tracking-wide">
            <span>◉ 3G</span><span>NEW MESSAGE</span><span>17:25 ▰▰▰</span>
          </header>
          <div className="px-4 py-4 border-b border-[#7c9785]">
            <p className="font-mono text-[10px] tracking-[0.1em] text-[#597469]">MENU  ›  WRITE</p>
            <h1 className="mt-1 text-[20px] leading-none font-black tracking-[-0.08em] text-[#284a42]">새 메시지</h1>
          </div>
          <p className="px-4 py-3 font-mono text-[11px] leading-relaxed text-[#48685c]">누군가의 하루에 작은 알림이 될<br />메시지를 작성해 보세요.</p>
          <div className="px-4 pb-4 flex flex-col gap-4 flex-1">

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-mono text-[11px] font-bold text-[#35574d]">
            01. 이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="닉네임 입력"
            className="w-full border border-[#789182] bg-[#edf2da] px-3 py-2.5 text-[13px] font-mono text-[#2c4d43] outline-none placeholder:text-[#849b87] focus:ring-1 focus:ring-[#3f7163]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="font-mono text-[11px] font-bold text-[#35574d]">
            02. 한마디
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            rows={5}
            className={`w-full border border-[#789182] bg-[#edf2da] px-3 py-2.5 text-[13px] font-mono text-[#2c4d43] outline-none resize-none placeholder:text-[#849b87] focus:ring-1 focus:ring-[#3f7163] ${
              messageEmpty && error ? "ring-2 ring-[#9a5b50]" : ""
            }`}
          />
          {messageEmpty && error && (
            <p className="text-xs text-[#8e4c3e] font-mono font-bold flex items-center gap-1">! 내용을 입력해주세요</p>
          )}
        </div>

        {error && !messageEmpty && (
          <p className="text-xs text-[#8e4c3e] font-mono font-bold -mt-3">! {error}</p>
        )}

          </div>
          <div className="mt-auto bg-[#5a716a] px-3 py-2 flex justify-between text-[#f6f8e9] font-mono text-[10px]">
            <Link href="/">◀ 취소</Link>
            <button type="submit" disabled={submitting} className="font-bold disabled:opacity-60">
              {submitting ? "저장 중..." : "등록 ▶"}
            </button>
          </div>
        </form>
        <div aria-hidden="true" className="mt-5 flex justify-center gap-2">
          <span className="size-2 rounded-full bg-[#b8ad9d]" /><span className="size-2 rounded-full bg-[#b8ad9d]" /><span className="size-2 rounded-full bg-[#b8ad9d]" />
        </div>
      </div>
    </main>
  );
}
