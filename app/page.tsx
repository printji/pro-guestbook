"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyPostIds, removeMyPostId, supabase, type Post } from "@/lib/supabase";

const AVATAR_COLORS = [
  { bg: "bg-[#abc7be]", text: "text-[#234e48]" },
  { bg: "bg-[#d7c7a2]", text: "text-[#695329]" },
  { bg: "bg-[#c4d3a8]", text: "text-[#40582f]" },
];

function initialsOf(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.slice(0, 2).toUpperCase();
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  return `${day}일 전`;
}

function PostSkeleton() {
  return (
    <div className="lcd-line px-3 py-4 w-full flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="skeleton size-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-4 w-24 rounded-md" />
          <div className="skeleton h-2 w-16 rounded-md" />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="skeleton h-3 w-full rounded-md" />
        <div className="skeleton h-3 w-3/4 rounded-md" />
      </div>
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [myPostIds, setMyPostIds] = useState<number[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setPosts([]);
      return;
    }
    setPosts(data ?? []);
  }

  useEffect(() => {
    loadPosts();
    setMyPostIds(getMyPostIds());
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("이 메시지를 삭제할까요?")) return;

    setDeletingId(id);
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", id);
    setDeletingId(null);

    if (deleteError) {
      window.alert(`삭제하지 못했어요: ${deleteError.message}`);
      return;
    }

    removeMyPostId(id);
    setMyPostIds((ids) => ids.filter((existingId) => existingId !== id));
    setPosts((prev) => (prev ? prev.filter((post) => post.id !== id) : prev));
  }

  const isLoading = posts === null;
  const isEmpty = posts !== null && posts.length === 0;

  return (
    <main className="phone-shell min-h-screen max-w-[430px] mx-auto relative px-4 py-7">
      <div className="phone-frame min-h-[calc(100vh-56px)] rounded-[42px] px-4 pt-7 pb-5 flex flex-col">
        <div aria-hidden="true" className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-[#989082] shadow-inner" />
        <section className="lcd-screen rounded-[7px] overflow-hidden flex-1 flex flex-col min-h-0">
          <header className="bg-[#5a716a] px-3 py-1.5 flex items-center justify-between text-[#f6f8e9] font-mono text-[10px] tracking-wide">
            <span>◉ 3G</span>
            <span>GUEST-BOOK</span>
            <span>17:25 ▰▰▰</span>
          </header>
          <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-[#7c9785]">
            <div>
              <p className="font-mono text-[10px] tracking-[0.1em] text-[#597469]">MENU  ›  INBOX</p>
              <h1 className="mt-1 text-[20px] leading-none font-black tracking-[-0.08em] text-[#284a42]">방명록</h1>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#58796e] text-lg">✉</span>
          </div>
          <div className="px-4 pt-3 flex items-center justify-between">
            <h2 className="font-mono text-[11px] font-bold">받은 메시지</h2>
            <span className="rounded-sm bg-[#99b8a6] px-1.5 py-0.5 font-mono text-[10px]">{posts?.length ?? 0}</span>
          </div>
          <div className="px-3 pt-2 pb-4 flex-1 overflow-y-auto">

        {error && (
          <div className="border border-[#8c685d] bg-[#f2d9c5] text-[#734133] text-xs p-3 font-mono">
            메시지를 불러오지 못했어요: {error}
            <br />
            Supabase URL/anon key(.env.local)와 RLS 정책을 확인해 주세요.
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}

        {!isLoading && !isEmpty && (
          <div className="flex flex-col gap-4">
            {posts!.map((post, i) => {
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <article
                  key={post.id}
                  className="lcd-line px-2.5 py-3 w-full flex flex-col gap-2 transition-colors hover:bg-[#c8dab8]"
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-9 rounded-full border border-[#547168] flex items-center justify-center font-mono font-bold text-xs shrink-0 ${color.bg} ${color.text}`}
                      >
                        {initialsOf(post.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-[13px] text-[#284a42]">{post.name}</span>
                        <span className="font-mono text-[10px] text-[#628075]">{timeAgo(post.created_at)}</span>
                      </div>
                    </div>
                    {myPostIds.includes(post.id) && (
                      <button
                        type="button"
                        aria-label="메시지 삭제"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="key-button rounded-sm px-2 py-0.5 text-[9px] font-mono font-bold text-[#564d42] disabled:opacity-50 shrink-0"
                      >
                        {deletingId === post.id ? "삭제 중..." : "삭제"}
                      </button>
                    )}
                  </div>
                  <p className="pl-12 text-[12px] font-mono leading-relaxed text-[#3d5d52] whitespace-pre-wrap">
                    {post.message}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center text-center gap-2 py-10 px-6 font-mono">
            <div className="size-16 rounded-full border-2 border-dashed border-[#668477] flex items-center justify-center mb-2">
              <span className="text-2xl">✉</span>
            </div>
            <h3 className="font-bold text-sm text-[#284a42]">새 메시지가 없습니다</h3>
            <p className="text-xs text-[#628075] max-w-[220px]">
              Be the first to leave a warm message in the guestbook.
            </p>
            <Link
              href="/write"
              className="key-button mt-4 rounded-md px-5 py-2 text-xs font-mono font-bold text-[#33483f]"
            >
              Write a message
            </Link>
          </div>
        )}
          </div>
          <div className="mt-auto bg-[#5a716a] px-3 py-2 flex justify-between text-[#f6f8e9] font-mono text-[10px]">
            <span>◀ MENU</span>
            <Link href="/write" className="font-bold">작성 ▶</Link>
          </div>
        </section>
        <div aria-hidden="true" className="mt-5 flex justify-center gap-2">
          <span className="size-2 rounded-full bg-[#b8ad9d]" /><span className="size-2 rounded-full bg-[#b8ad9d]" /><span className="size-2 rounded-full bg-[#b8ad9d]" />
        </div>
      </div>
    </main>
  );
}
