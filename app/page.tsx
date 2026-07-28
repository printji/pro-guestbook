"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase, type Post } from "@/lib/supabase";

const AVATAR_COLORS = [
  { bg: "bg-primary/10", text: "text-primary" },
  { bg: "bg-accent/15", text: "text-accent" },
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
    <div className="bg-white border border-gray-100 rounded-card shadow-sm p-5 w-full flex flex-col gap-4">
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
  }, []);

  const isLoading = posts === null;
  const isEmpty = posts !== null && posts.length === 0;

  return (
    <main className="min-h-screen max-w-[430px] mx-auto bg-[#f9fafb] relative pb-32">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-[#f9fafb]/80 border-b border-gray-200/50 px-6 pt-12 pb-6 flex flex-col gap-1">
        <h1 className="text-[28px] font-bold tracking-tight leading-tight">pro&apos;s guest-book</h1>
        <p className="text-sm text-gray-500">Leave a warm message</p>
      </header>

      <section className="px-5 pt-6 flex flex-col gap-4">
        <h2 className="px-1 text-xs font-semibold tracking-wider uppercase text-gray-500">
          Recent Messages
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-card p-4">
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
                  className="bg-white border border-gray-100 rounded-card shadow-sm p-5 w-full flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${color.bg} ${color.text}`}
                      >
                        {initialsOf(post.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[15px] text-gray-900">{post.name}</span>
                        <span className="text-[11px] text-gray-500">{timeAgo(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {post.message}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        {isEmpty && (
          <div className="border-t border-gray-200/50 pt-8 flex flex-col items-center text-center gap-2 py-10">
            <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center mb-4">
              <span className="text-3xl text-primary/40">✉️</span>
            </div>
            <h3 className="font-bold text-base">아직 남겨진 메시지가 없어요</h3>
            <p className="text-sm text-gray-500 max-w-[200px]">
              Be the first to leave a warm message in the guestbook.
            </p>
            <Link
              href="/write"
              className="mt-6 bg-white border border-gray-200 shadow-sm rounded-full px-6 py-2.5 text-sm font-semibold text-gray-900"
            >
              Write a message
            </Link>
          </div>
        )}
      </section>

      <Link
        href="/write"
        aria-label="메시지 남기기"
        className="fixed bottom-8 right-5 md:right-[calc(50%-195px)] size-[60px] rounded-full bg-primary shadow-[0_10px_15px_-3px_rgba(91,127,222,0.3),0_4px_6px_-2px_rgba(91,127,222,0.15)] flex items-center justify-center text-white text-2xl"
      >
        ✏️
      </Link>
    </main>
  );
}
