"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyPostIds, removeMyPostId, supabase, type Post } from "@/lib/supabase";

const AVATAR_COLORS = [
  { bg: "bg-[#ffd4e8]", text: "text-[#c83d83]", ring: "ring-[#ff9ccb]" },
  { bg: "bg-[#e5d6ff]", text: "text-[#7652c9]", ring: "ring-[#c9adff]" },
  { bg: "bg-[#d9f5ff]", text: "text-[#25799b]", ring: "ring-[#a8e6ff]" },
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
    <div className="glossy-card rounded-[26px] p-5 w-full flex flex-col gap-4">
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
    <main className="y2k-shell y2k-grid min-h-screen max-w-[430px] mx-auto relative pb-32 overflow-hidden">
      <div aria-hidden="true" className="absolute -top-12 -right-16 size-44 rounded-full bg-[#f8b6dd]/40 blur-3xl" />
      <div aria-hidden="true" className="absolute top-80 -left-20 size-40 rounded-full bg-[#cbb5ff]/35 blur-3xl" />

      <header className="sticky top-0 z-10 px-5 pt-8 pb-4">
        <div className="glossy-card rounded-[28px] px-5 py-4 flex items-center justify-between relative overflow-hidden">
          <div aria-hidden="true" className="absolute -top-8 right-3 text-5xl opacity-25">✦</div>
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.24em] text-[#b05a9b] uppercase">sweetest corner</p>
            <h1 className="mt-0.5 text-[25px] font-black tracking-[-0.07em] leading-tight text-[#44234f]">pro&apos;s guest-book</h1>
          </div>
          <span className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff93c6] to-[#a984ef] text-xl shadow-[0_6px_14px_rgba(192,96,174,.28)]">♡</span>
        </div>
      </header>

      <section className="relative px-5 pt-3 flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[12px] font-black tracking-[0.13em] uppercase text-[#8b5f91]">Lovely notes</h2>
          <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-bold text-[#a36a95] ring-1 ring-white/80">{posts?.length ?? 0} messages</span>
        </div>

        {error && (
          <div className="rounded-[22px] border border-[#ffc4dc] bg-[#fff3f8] text-[#ca4e82] text-sm p-4">
            메시지를 불러오지 못했어요: {error}
            <br />
            Supabase URL/anon key(.env.local)와 RLS 정책을 확인해 주세요.
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-4">
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
                  className="glossy-card rounded-[26px] p-5 w-full flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-11 rounded-2xl ring-2 ring-offset-2 ring-offset-[#fff4fc] flex items-center justify-center font-black text-sm shrink-0 ${color.bg} ${color.text} ${color.ring}`}
                      >
                        {initialsOf(post.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[15px] text-[#44234f]">{post.name}</span>
                        <span className="text-[11px] font-medium text-[#a47c9e]">{timeAgo(post.created_at)}</span>
                      </div>
                    </div>
                    {myPostIds.includes(post.id) && (
                      <button
                        type="button"
                        aria-label="메시지 삭제"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="rounded-full bg-[#fff0f7] px-2.5 py-1 text-[10px] font-bold text-[#d36c9f] hover:bg-[#ffdce9] disabled:opacity-50 shrink-0"
                      >
                        {deletingId === post.id ? "삭제 중..." : "삭제"}
                      </button>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#654f69] leading-relaxed whitespace-pre-wrap">
                    {post.message}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        {isEmpty && (
          <div className="glossy-card rounded-[28px] flex flex-col items-center text-center gap-2 py-10 px-6">
            <div className="size-24 rounded-[30px] bg-gradient-to-br from-[#ffd0e7] to-[#d4c3ff] flex items-center justify-center mb-2 shadow-inner">
              <span className="text-3xl sparkle">💌</span>
            </div>
            <h3 className="font-black text-base text-[#44234f]">첫 메시지를 기다리는 중!</h3>
            <p className="text-sm font-medium text-[#9b7898] max-w-[220px]">
              Be the first to leave a warm message in the guestbook.
            </p>
            <Link
              href="/write"
              className="mt-5 rounded-full bg-gradient-to-r from-[#fa75b3] to-[#a680e8] px-6 py-3 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(210,92,171,.28)]"
            >
              Write a message
            </Link>
          </div>
        )}
      </section>

      <Link
        href="/write"
        aria-label="메시지 남기기"
        className="fixed bottom-7 right-5 md:right-[calc(50%-195px)] size-[62px] rounded-[23px] bg-gradient-to-br from-[#ff79b6] via-[#ee77c5] to-[#aa83ed] shadow-[0_13px_24px_rgba(192,83,165,.35),inset_0_1px_0_rgba(255,255,255,.48)] flex items-center justify-center text-white text-2xl transition-transform hover:scale-105 active:scale-95"
      >
        ✏️
      </Link>
    </main>
  );
}
