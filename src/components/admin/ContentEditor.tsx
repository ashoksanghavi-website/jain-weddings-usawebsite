import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminContent, saveSiteContent } from "@/lib/content";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;
type Path = (string | number)[];

/** Friendlier labels for the top-level sections. */
const SECTION_LABELS: Record<string, string> = {
  IMG: "Image base URL",
  LOGO: "Logo",
  heroVideo: "Hero video",
  site: "Business details",
  socials: "Social links",
  routes: "Navigation",
  weddingMenu: "Wedding menu",
  servicesMenu: "Services menu",
  meta: "SEO / page titles",
  images: "Images",
  rituals: "The 12 rituals",
  gallery: "Gallery photos",
  films: "Films",
  home: "Home page",
  testimonials: "Testimonials",
  about: "About page",
  ceremonyEnquiry: "Ceremony enquiry card",
  ritualsPage: "Rituals page",
  galleryPage: "Gallery page",
  servicesPage: "Services page (poojans)",
  contactPage: "Contact page",
  invitationBand: "Invitation band",
  invite: "Invite popup",
  pathways: "Pathways",
  notFoundPage: "404 page",
};

function humanize(key: string): string {
  if (/^h[1-6]$/i.test(key)) return key.toUpperCase();
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function isMedia(key: string, value: string): boolean {
  if (/(src|image|img|logo|thumb|full|poster|favicon|photo|video|mp4|banner|portrait|certificate)/i.test(key))
    return true;
  return /^(https?:\/\/|\/).*\.(jpe?g|png|webp|gif|svg|mp4|webm)(\?.*)?$/i.test(value);
}

function isImage(value: string): boolean {
  return /\.(jpe?g|png|webp|gif|svg)(\?.*)?$/i.test(value) || (/^(https?:\/\/|\/)/.test(value) && !/\.(mp4|webm)$/i.test(value));
}

function setByPath(root: Json, path: Path, value: Json): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = root.slice();
    copy[head as number] = setByPath(root[head as number], rest, value);
    return copy;
  }
  return { ...(root ?? {}), [head]: setByPath(root?.[head as string], rest, value) };
}

function cloneTemplate(sample: Json): Json {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const out: Json = {};
    for (const k of Object.keys(sample)) out[k] = cloneTemplate(sample[k]);
    return out;
  }
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  return "";
}

function MediaField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [value]);
  const showImg = value && isImage(value) && !broken;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-16 w-16 shrink-0 overflow-hidden rounded border border-mist/30 bg-paper">
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center font-util text-[9px] uppercase tracking-wide text-mist">
            {value ? "media" : "empty"}
          </div>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image / video URL"
        className="jw-adm-input mt-1 flex-1"
        spellCheck={false}
      />
    </div>
  );
}

function StringField({
  keyName,
  value,
  onChange,
}: {
  keyName: string;
  value: string;
  onChange: (v: string) => void;
}) {
  if (isMedia(keyName, value)) return <MediaField value={value} onChange={onChange} />;
  const long = value.length > 70 || value.includes("\n");
  if (long) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.max(2, Math.ceil(value.length / 60)))}
        className="jw-adm-input w-full"
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="jw-adm-input w-full"
    />
  );
}

function FieldNode({
  label,
  value,
  path,
  update,
  depth = 0,
}: {
  label: string;
  value: Json;
  path: Path;
  update: (path: Path, value: Json) => void;
  depth?: number;
}) {
  // Array
  if (Array.isArray(value)) {
    const addItem = () => {
      const sample = value.length ? value[value.length - 1] : "";
      update(path, [...value, cloneTemplate(sample)]);
    };
    const removeItem = (i: number) => update(path, value.filter((_, idx) => idx !== i));
    const move = (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= value.length) return;
      const copy = value.slice();
      [copy[i], copy[j]] = [copy[j], copy[i]];
      update(path, copy);
    };
    return (
      <div className="jw-adm-group">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-util text-[11px] font-semibold uppercase tracking-[0.14em] text-maroon">
            {label} <span className="text-mist">· {value.length}</span>
          </span>
          <button type="button" onClick={addItem} className="jw-adm-mini">
            + Add
          </button>
        </div>
        <div className="space-y-3">
          {value.map((item, i) => (
            <div key={i} className="rounded border border-gold/30 bg-paper/60 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-util text-[10px] uppercase tracking-[0.14em] text-mist">
                  #{i + 1}
                </span>
                <span className="flex items-center gap-2">
                  <button type="button" onClick={() => move(i, -1)} className="jw-adm-mini" aria-label="Move up">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(i, 1)} className="jw-adm-mini" aria-label="Move down">
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="jw-adm-mini jw-adm-danger"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </span>
              </div>
              <FieldNode
                label={`#${i + 1}`}
                value={item}
                path={[...path, i]}
                update={update}
                depth={depth + 1}
              />
            </div>
          ))}
          {value.length === 0 ? (
            <p className="text-[13px] italic text-mist">Empty — use “Add”.</p>
          ) : null}
        </div>
      </div>
    );
  }

  // Object
  if (value && typeof value === "object") {
    return (
      <div className={depth > 0 ? "jw-adm-group" : "space-y-5"}>
        {Object.keys(value).map((k) => (
          <div key={k} className={value[k] && typeof value[k] === "object" ? "" : "jw-adm-field"}>
            {value[k] && typeof value[k] === "object" ? null : (
              <label className="jw-adm-label">{humanize(k)}</label>
            )}
            {value[k] && typeof value[k] === "object" ? (
              <FieldNode
                label={humanize(k)}
                value={value[k]}
                path={[...path, k]}
                update={update}
                depth={depth + 1}
              />
            ) : typeof value[k] === "boolean" ? (
              <input
                type="checkbox"
                checked={value[k]}
                onChange={(e) => update([...path, k], e.target.checked)}
                className="h-4 w-4 accent-kumkum"
              />
            ) : typeof value[k] === "number" ? (
              <input
                type="number"
                value={value[k]}
                onChange={(e) => update([...path, k], Number(e.target.value))}
                className="jw-adm-input w-40"
              />
            ) : (
              <StringField
                keyName={k}
                value={String(value[k] ?? "")}
                onChange={(v) => update([...path, k], v)}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Primitive at the item level (array of strings/numbers)
  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => update(path, Number(e.target.value))}
        className="jw-adm-input w-40"
      />
    );
  }
  if (typeof value === "boolean") {
    return (
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => update(path, e.target.checked)}
        className="h-4 w-4 accent-kumkum"
      />
    );
  }
  return (
    <StringField
      keyName={typeof path[path.length - 1] === "string" ? (path[path.length - 1] as string) : ""}
      value={String(value ?? "")}
      onChange={(v) => update(path, v)}
    />
  );
}

export function ContentEditor() {
  const [content, setContent] = useState<Json | null>(null);
  const [section, setSection] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const c = await getAdminContent();
      setContent(c);
      setSection((s) => s || Object.keys(c)[0] || "");
      setStatus("ready");
      setDirty(false);
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const update = useCallback((path: Path, value: Json) => {
    setContent((prev: Json) => setByPath(prev, path, value));
    setDirty(true);
    setSaved(false);
  }, []);

  const sections = useMemo(() => (content ? Object.keys(content) : []), [content]);

  async function onSave() {
    if (!content) return;
    setSaving(true);
    setErr(null);
    try {
      await saveSiteContent({ data: content });
      setSaved(true);
      setDirty(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return <p className="py-16 text-center font-util text-[12px] uppercase tracking-[0.2em] text-mist">Loading content…</p>;
  }
  if (status === "error" || !content) {
    return (
      <p className="py-16 text-center text-[15px] text-kumkum">
        Could not load content.{" "}
        <button onClick={load} className="underline">
          Try again
        </button>
      </p>
    );
  }

  return (
    <div className="jw-adm-cms">
      <aside className="jw-adm-nav">
        {sections.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            className={`jw-adm-navitem ${s === section ? "is-active" : ""}`}
          >
            {SECTION_LABELS[s] ?? humanize(s)}
          </button>
        ))}
      </aside>

      <div className="jw-adm-panel">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gold/30 pb-4">
          <h2 className="font-display text-[22px] text-ink">
            {SECTION_LABELS[section] ?? humanize(section)}
          </h2>
          <div className="flex items-center gap-3">
            {saved ? <span className="text-[13px] text-green-700">Saved ✓</span> : null}
            {dirty ? <span className="text-[12px] italic text-mist">Unsaved changes</span> : null}
            <button type="button" onClick={load} className="jw-adm-mini" disabled={saving}>
              Reset
            </button>
            <button type="button" onClick={onSave} disabled={saving || !dirty} className="jw-btn-primary jw-adm-save">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

        {err ? <p role="alert" className="mb-4 text-[14px] text-kumkum">{err}</p> : null}

        <FieldNode
          label={SECTION_LABELS[section] ?? humanize(section)}
          value={content[section]}
          path={[section]}
          update={update}
        />

        <div className="mt-8 border-t border-gold/30 pt-5 text-right">
          <button type="button" onClick={onSave} disabled={saving || !dirty} className="jw-btn-primary jw-adm-save">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
