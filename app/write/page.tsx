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
    <main className="y2k-shell y2k-grid min-h-screen max-w-[430px] mx-auto relative pb-40 overflow-hidden">
      <div aria-hidden="true" className="absolute -top-10 -left-12 size-40 rounded-full bg-[#ffc1df]/45 blur-3xl" />
      <div aria-hidden="true" className="absolute top-72 -right-16 size-40 rounded-full bg-[#cfb8ff]/40 blur-3xl" />
      <header className="relative flex items-center gap-2 px-5 pt-8 pb-3">
        <Link
          href="/"
          aria-label="뒤로가기"
          className="size-10 rounded-2xl glossy-card flex items-center justify-center text-2xl font-light text-[#6d4175]"
        >
          ‹
        </Link>
        <div>
          <p className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#ba689c]">say something sweet</p>
          <h1 className="text-xl font-black tracking-[-0.05em] text-[#44234f]">메시지 남기기</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="relative px-5 pt-5 flex flex-col gap-5">
        <div className="glossy-card rounded-[28px] p-5 flex gap-4 items-start overflow-hidden relative">
          <span aria-hidden="true" className="absolute -right-2 -top-3 text-5xl opacity-20">✦</span>
          <div className="size-11 rounded-2xl bg-gradient-to-br from-[#ff92c5] to-[#ad89ef] shadow-[0_6px_15px_rgba(200,103,180,.28)] flex items-center justify-center shrink-0 text-white text-lg">
            ♡
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-black text-sm text-[#7a3e79]">오늘의 한마디를 남겨줘!</p>
            <p className="text-[13px] font-medium leading-relaxed text-[#9d7197]">
              귀엽고 재밌는 얘기라면 뭐든 좋아요. 우리만의 작은 기록을 채워봐요.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="ml-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#875d89]">
            Your name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="닉네임을 알려줘"
            className="w-full glossy-card rounded-[20px] px-5 py-4 text-[15px] font-medium text-[#503653] outline-none placeholder:text-[#c4a7c2] focus:ring-2 focus:ring-[#f5a5ce]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="ml-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#875d89]">
            Love note
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="오늘 있었던 재밌는 일, 하고 싶은 말 모두 좋아!"
            rows={5}
            className={`w-full glossy-card rounded-[20px] px-5 py-4 text-[15px] font-medium text-[#503653] outline-none resize-none placeholder:text-[#c4a7c2] focus:ring-2 focus:ring-[#f5a5ce] ${
              messageEmpty && error ? "ring-2 ring-[#ff85b9]" : ""
            }`}
          />
          {messageEmpty && error && (
            <p className="text-xs text-[#d65991] font-bold flex items-center gap-1">⚠ 내용을 입력해주세요</p>
          )}
        </div>

        {error && !messageEmpty && (
          <p className="text-xs text-[#d65991] font-bold -mt-3">⚠ {error}</p>
        )}

        <div className="fixed bottom-0 left-0 right-0">
          <div className="max-w-[430px] mx-auto bg-gradient-to-t from-[#fff4fb] via-[#fff4fb]/95 to-transparent pt-12 pb-8 px-5">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#fa75b3] via-[#e877c9] to-[#a980ed] text-white font-black rounded-[20px] h-14 flex items-center justify-center gap-2 shadow-[0_11px_20px_rgba(198,87,170,.32),inset_0_1px_0_rgba(255,255,255,.42)] transition-transform active:scale-[.98] disabled:opacity-60"
            >
              {submitting ? "남기는 중..." : "Send my love ♡"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
