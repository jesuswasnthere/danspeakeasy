"use client";

import { useState } from "react";
import { ArrowRight, Heart, MessageCircle, Send } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/dates";
import { ME, useLearningStore } from "@/store/useLearningStore";
import type { Classmate, ClassroomPost } from "@/types/learning";
import { Badge } from "@/components/ui/primitives";

const TAG_TONE = { misión: "accent", pregunta: "warning", recurso: "success", logro: "neutral" } as const;

export function PostCard({ post, classmates }: { post: ClassroomPost; classmates: Map<string, Classmate> }) {
  const { profile, liked, toggleLike, replyToPost } = useLearningStore(
    useShallow((s) => ({
      profile: s.profile,
      liked: s.likedPosts.includes(post.id),
      toggleLike: s.toggleLike,
      replyToPost: s.replyToPost,
    })),
  );
  const [reply, setReply] = useState("");
  const [showReplies, setShowReplies] = useState(post.replies.length > 0 && post.replies.length <= 2);

  const author = (id: string) =>
    id === ME
      ? { name: `${profile.name} (tú)`, avatar: profile.avatar, country: "" }
      : (classmates.get(id) ?? { name: "Compañero", avatar: "🙂", country: "" });
  const a = author(post.authorId);
  const isCjk = /[㐀-鿿]/.test(post.content);

  return (
    <article className="rounded-2xl border border-line bg-surface p-4">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-xl">{a.avatar}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {a.name} <span className="font-normal">{a.country}</span>
          </p>
          <p className="text-xs text-muted">{timeAgo(post.createdAt)}</p>
        </div>
        <Badge tone={TAG_TONE[post.tag]}>{post.tag}</Badge>
      </header>

      <p className={cn("mt-3 whitespace-pre-wrap", isCjk && "font-cjk text-lg leading-relaxed")}>{post.content}</p>

      <footer className="mt-3 flex items-center gap-4 text-sm text-muted">
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          className={cn("flex items-center gap-1.5 transition hover:text-danger", liked && "text-danger")}
        >
          <Heart size={15} className={cn(liked && "fill-current")} /> {post.likes + (liked ? 1 : 0)}
        </button>
        <button type="button" onClick={() => setShowReplies((s) => !s)} className="flex items-center gap-1.5 hover:text-ink">
          <MessageCircle size={15} /> {post.replies.length} {post.replies.length === 1 ? "respuesta" : "respuestas"}
        </button>
      </footer>

      {showReplies && (
        <div className="mt-3 flex flex-col gap-3 border-l-2 border-line pl-4">
          {post.replies.map((r) => {
            const ra = author(r.authorId);
            return (
              <div key={r.id} className="text-sm">
                <p>
                  <span className="mr-1">{ra.avatar}</span>
                  <span className="font-semibold">{ra.name}</span>
                  <span className="ml-2 text-xs text-muted">{timeAgo(r.createdAt)}</span>
                </p>
                <p className={cn("mt-0.5", /[㐀-鿿]/.test(r.content) && "font-cjk text-base")}>{r.content}</p>
                {r.correction && (
                  <div className="mt-2 rounded-xl bg-success-soft p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-success">Corrección entre compañeros</p>
                    <p className="mt-1 font-cjk">
                      <span className="text-muted line-through">{r.correction.original}</span>
                      <ArrowRight size={13} className="mx-1.5 inline text-muted" />
                      <span className="font-medium">{r.correction.corrected}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">{r.correction.note}</p>
                  </div>
                )}
              </div>
            );
          })}
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              replyToPost(post.id, reply);
              setReply("");
            }}
          >
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Escribe una respuesta o una corrección amable…"
              className="flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button type="submit" disabled={!reply.trim()} className="rounded-xl p-2 text-accent disabled:opacity-30" aria-label="Enviar">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
