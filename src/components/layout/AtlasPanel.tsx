"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowUp, Bot, ExternalLink, RotateCcw, X } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { ATLAS_PROMPTS, resolveAtlasInput, type AtlasResult } from "@/lib/atlas";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "atlas";
  text: string;
  results?: AtlasResult[];
}

const MAX_INPUT = 600;

/**
 * The actual chat surface. Lazy-loaded only when opened, so the entire tools
 * dataset and local resolver do not become part of the initial site shell.
 *
 * Non-modal by design: no backdrop, focus trap or scroll lock. Wheel/touch on
 * the conversation scrolls only its own overflow area; wheel/touch elsewhere
 * scrolls the page, and the fixed panel remains anchored to the viewport.
 */
export function AtlasPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    // Scroll only the chat, never the document. All replies are immediate local
    // lookups, so there is no delayed response that could yank the reader away.
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (document.querySelector('[aria-modal="true"]')) return;
      event.preventDefault();
      onClose();
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  const clearConversation = () => {
    setMessages([]);
    setDraft("");
    setAnnouncement("Conversation cleared");
    inputRef.current?.focus({ preventScroll: true });
  };

  const send = (value: string) => {
    const input = value.trim().slice(0, MAX_INPUT);
    if (!input) return;
    if (input.toLowerCase() === "/clear") {
      clearConversation();
      return;
    }

    const reply = resolveAtlasInput(input);
    const id = nextId.current;
    nextId.current += 2;
    setMessages((existing) => [
      ...existing,
      { id, role: "user", text: input },
      { id: id + 1, role: "atlas", text: reply.text, results: reply.results },
    ]);
    setAnnouncement("");
    setDraft("");
    // The textarea remains usable for consecutive questions without a click.
    inputRef.current?.focus({ preventScroll: true });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(draft);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(draft);
    }
  };

  return (
    <section
      id="atlas-assistant-panel"
      data-atlas-panel={open ? "" : undefined}
      role="region"
      aria-label="Atlas Assistant conversation"
      aria-hidden={!open}
      hidden={!open}
      className="absolute right-0 bottom-[60px] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-line bg-surface text-ink shadow-pop animate-pop-in"
      style={{
        height: "min(610px, calc(100dvh - 6.5rem))",
        display: open ? "flex" : "none",
      }}
    >
      <header className="flex shrink-0 items-center gap-2.5 border-b border-line bg-surface px-3.5 py-3">
        <span
          className="grid size-8 shrink-0 place-items-center rounded-[5px] border border-accent/25 bg-accent/10 text-accent"
          aria-hidden
        >
          <Bot className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[14px] leading-5 font-semibold text-ink">Atlas Assistant</h2>
          <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-ink-mute uppercase">
            <span className="size-1.5 shrink-0 rounded-full bg-success" aria-hidden />
            Local directory guide · No AI connected
          </p>
        </div>
        <button
          type="button"
          onClick={clearConversation}
          disabled={messages.length === 0}
          aria-label="Clear conversation"
          title="Clear conversation"
          className="grid size-8 shrink-0 place-items-center rounded-[5px] text-ink-mute transition-colors hover:bg-elevated hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
        >
          <RotateCcw className="size-3.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Atlas Assistant"
          title="Close Atlas Assistant"
          className="grid size-8 shrink-0 place-items-center rounded-[5px] text-ink-mute transition-colors hover:bg-elevated hover:text-ink"
        >
          <X className="size-4" aria-hidden />
        </button>
      </header>

      <div
        ref={listRef}
        role="log"
        aria-label="Conversation with Atlas Assistant"
        aria-live="polite"
        aria-relevant="additions"
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-main/35 px-3.5 py-4"
      >
        <ol className="space-y-4">
          <li>
            <p className="mb-1.5 pl-1 font-mono text-[10px] tracking-[0.12em] text-ink-mute uppercase">
              Atlas
            </p>
            <div className="max-w-[94%] rounded-md border border-line bg-card px-3 py-2.5">
              <p className="text-[13px] leading-5.5 text-ink-soft">
                Hi, I&apos;m Atlas. Ask me about tools, commands, concepts or a learning path. I
                look things up in CyberAtlas&apos;s local directory and link you to the source pages.
              </p>
              <p className="mt-2 border-t border-line/70 pt-2 text-[11.5px] leading-5 text-ink-mute">
                No model or chat API is connected yet. Nothing you type is sent to a server.
              </p>
            </div>
          </li>

          {messages.length === 0 ? (
            <li className="pt-1">
              <p className="mb-2 pl-1 font-mono text-[10px] tracking-[0.12em] text-ink-mute uppercase">
                Try asking
              </p>
              <div className="grid grid-cols-1 gap-1.5 min-[350px]:grid-cols-2">
                {ATLAS_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="rounded-[5px] border border-line bg-card px-2.5 py-2 text-left text-[12px] leading-5 text-ink-soft transition-colors hover:border-accent/35 hover:bg-card-hover hover:text-ink"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </li>
          ) : null}

          {messages.map((message) => (
            <li key={message.id} className={message.role === "user" ? "flex flex-col items-end" : ""}>
              <p
                className={cn(
                  "mb-1.5 font-mono text-[10px] tracking-[0.12em] text-ink-mute uppercase",
                  message.role === "user" ? "pr-1" : "pl-1",
                )}
              >
                {message.role === "user" ? "You" : "Atlas"}
              </p>
              {message.role === "user" ? (
                <p className="max-w-[88%] rounded-md border border-accent/25 bg-accent/10 px-3 py-2 text-[13px] leading-5.5 break-words whitespace-pre-wrap text-ink">
                  {message.text}
                </p>
              ) : (
                <div className="max-w-[96%] rounded-md border border-line bg-card px-3 py-2.5">
                  <p className="text-[13px] leading-5.5 break-words whitespace-pre-wrap text-ink-soft">
                    {message.text}
                  </p>
                  {message.results?.length ? (
                    <ul className="mt-3 space-y-2 border-t border-line/70 pt-3">
                      {message.results.map((result, index) => (
                        <li
                          key={`${message.id}-${result.href}-${index}`}
                          className="min-w-0 overflow-hidden rounded-[5px] border border-line bg-surface"
                        >
                          <Link
                            href={result.href}
                            onClick={onClose}
                            className="group flex items-start gap-2 px-2.5 py-2 transition-colors hover:bg-elevated"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1.5">
                                <span className="min-w-0 truncate text-[12.5px] font-medium text-ink group-hover:text-accent">
                                  {result.title}
                                </span>
                                <ExternalLink className="size-3 shrink-0 text-ink-mute" aria-hidden />
                              </span>
                              <span className="mt-0.5 block line-clamp-2 text-[11.5px] leading-4.5 text-ink-mute">
                                {result.detail}
                              </span>
                            </span>
                            <span className="shrink-0 rounded border border-line px-1 py-0.5 font-mono text-[9px] tracking-wide text-ink-mute uppercase">
                              {result.type}
                            </span>
                          </Link>
                          {result.command ? (
                            <div className="flex min-w-0 items-center gap-1.5 border-t border-line bg-main px-2 py-1.5">
                              <code className="scroll-rail min-w-0 flex-1 font-mono text-[11.5px] leading-5 whitespace-pre text-ink">
                                {result.command}
                              </code>
                              <CopyButton
                                value={result.command}
                                id={`atlas-${message.id}-${index}`}
                                variant="icon"
                                label={`Copy ${result.title}`}
                              />
                            </div>
                          ) : null}
                          {result.warning ? (
                            <p className="border-t border-line/70 px-2.5 py-1.5 text-[11px] leading-4.5 text-warning">
                              Note: {result.warning}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      <form onSubmit={onSubmit} className="shrink-0 border-t border-line bg-surface px-3.5 py-3">
        <label htmlFor="atlas-input" className="sr-only">
          Ask Atlas about tools and documentation
        </label>
        <div className="flex items-end gap-2 rounded-[5px] border border-line bg-elevated px-2.5 py-1.5 transition-colors focus-within:border-accent/55">
          <textarea
            ref={inputRef}
            id="atlas-input"
            rows={2}
            maxLength={MAX_INPUT}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Ask about a tool, command or path…"
            aria-describedby="atlas-input-help"
            className="min-h-9 max-h-24 min-w-0 flex-1 resize-none bg-transparent py-1.5 text-[13px] leading-5 text-ink outline-none placeholder:text-ink-mute"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message to Atlas"
            title="Send message"
            className="mb-0.5 grid size-8 shrink-0 place-items-center rounded-[4px] bg-accent text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-mute"
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <p id="atlas-input-help" className="text-[10.5px] leading-4 text-ink-mute">
            Local content only · No command execution
          </p>
          <p className="hidden font-mono text-[10px] text-ink-mute sm:block">
            Enter to send · Shift+Enter for newline
          </p>
        </div>
        <span role="status" aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </form>
    </section>
  );
}
