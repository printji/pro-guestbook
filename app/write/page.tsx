"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { addMyPostId, supabase } from "@/lib/supabase";

export default function WritePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
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
    if (!agree) {
      setError("개인정보 수집 및 이용에 동의해 주세요");
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
    <main className="min-h-screen max-w-[430px] mx-auto bg-[#f9fafb] relative pb-40">
      <header className="flex items-center gap-2 px-6 pt-12 pb-4">
        <Link
          href="/"
          aria-label="뒤로가기"
          className="size-10 -ml-2 rounded-full flex items-center justify-center text-lg"
        >
          ‹
        </Link>
        <h1 className="text-xl font-bold">메시지 남기기</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-6 pt-4 flex flex-col gap-6">
        <div className="bg-primary/5 rounded-card p-5 flex gap-4 items-start">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            ✎
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-bold text-sm text-primary">당신의 이야기를 들려주세요</p>
            <p className="text-[13px] text-primary/70">
              소중한 방문에 감사드립니다. 정성 어린 메시지는 큰 힘이 됩니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-[13px] font-bold uppercase tracking-wide">
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="성함을 입력해주세요"
            className="w-full bg-white border border-gray-200 rounded-card shadow-sm px-5 py-4 text-[15px] outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-[13px] font-bold uppercase tracking-wide">
            메시지
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="따뜻한 한마디를 남겨주세요"
            rows={5}
            className={`w-full bg-white rounded-card shadow-sm px-5 py-4 text-[15px] outline-none resize-none ${
              messageEmpty && error ? "border-2 border-accent" : "border border-gray-200 focus:border-primary"
            }`}
          />
          {messageEmpty && error && (
            <p className="text-xs text-accent font-medium flex items-center gap-1">⚠ 내용을 입력해주세요</p>
          )}
        </div>

        <label className="flex items-center gap-3 py-2 px-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="size-6 rounded-md accent-primary"
          />
          <span className="text-[13px] text-gray-500">개인정보 수집 및 이용에 동의합니다</span>
        </label>

        {error && !messageEmpty && (
          <p className="text-xs text-accent font-medium -mt-3">⚠ {error}</p>
        )}

        <div className="fixed bottom-0 left-0 right-0">
          <div className="max-w-[430px] mx-auto bg-gradient-to-t from-[#f9fafb] via-[#f9fafb] to-transparent pt-12 pb-12 px-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white font-bold rounded-card h-14 flex items-center justify-center gap-2 shadow-[0_10px_15px_-3px_rgba(91,127,222,0.3),0_4px_6px_-2px_rgba(91,127,222,0.15)] disabled:opacity-60"
            >
              {submitting ? "남기는 중..." : "남기기 ➤"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
