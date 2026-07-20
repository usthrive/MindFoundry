/**
 * SchoolSync (PARENT-FLOWS Flow 7 / E103) — one optional input: what the
 * class is working on right now. Stored in bb_enrollment.settings
 * (schoolTopic), honest effect statement on-screen: warm-ups lean toward
 * overlap when it exists; the weekly ladder never reorders. School name never
 * requested nor stored; entries fade after ~6 weeks. Never any ahead/behind
 * framing (§6.2 rule 10).
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { updateEnrollmentSettings } from '../../services/bbParentService';
import { useParentContext } from './FoundryParentLayout';

interface SchoolTopicEntry {
  text: string;
  savedAt: string;
}

const EXPIRY_DAYS = 42; // ~6 weeks

export default function SchoolSync() {
  const { childId = '' } = useParams<{ childId: string }>();
  const { loading, enrollments, childName, refresh } = useParentContext();
  const name = childName(childId);
  const enr = enrollments.get(childId);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const existing = (enr?.settings as Record<string, unknown> | undefined)?.schoolTopic as
    | SchoolTopicEntry
    | undefined;
  const stale =
    !!existing && Date.now() - new Date(existing.savedAt).getTime() > EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (existing?.text) setText(existing.text);
  }, [existing?.text]);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enr) return <p className="py-12 text-center text-text-secondary">{name} hasn't started yet.</p>;

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const entry: SchoolTopicEntry | null = text.trim()
        ? { text: text.trim().slice(0, 200), savedAt: new Date().toISOString() }
        : null;
      await updateEnrollmentSettings(childId, { schoolTopic: entry });
      setSaved(true);
      void refresh();
    } catch (e) {
      console.error('[bb] school sync save failed', e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[21px] font-bold text-text-primary">School sync</h1>

      <section className="mf-card flex flex-col gap-3 p-5">
        <label htmlFor="school-topic" className="text-[15px] font-semibold text-text-primary">
          What is {name}'s class working on right now?
        </label>
        <input
          id="school-topic"
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSaved(false);
          }}
          placeholder="e.g. adding fractions, telling time…"
          className="min-h-[52px] rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-text-primary focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="mf-btn-primary touch-manipulation"
        >
          {saving ? 'Saving…' : saved ? 'Saved' : text.trim() ? 'Save' : existing ? 'Clear' : 'Save'}
        </button>
        {stale && existing && (
          <p className="text-[12.5px] text-text-muted">
            Saved {new Date(existing.savedAt).toLocaleDateString()} — still current?
          </p>
        )}
      </section>

      {/* The honest effect statement — never a promise to reorder the ladder. */}
      <section className="mf-card-quiet p-5">
        <span className="mf-label mf-label-teal">What this does</span>
        <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">
          We'll lean {name}'s warm-ups toward overlapping skills when they exist — only concepts{' '}
          {name} has already been taught here can be leaned into. The weekly ladder itself never
          reorders: if a school topic sits later on {name}'s trail, we won't rush to it, because
          each rung is built on the one below. This note is optional, stored in plain words on{' '}
          {name}'s settings, and fades after about six weeks.
        </p>
      </section>

      <Link
        to={`/foundry/parent/controls/${childId}`}
        className="text-center text-[12.5px] font-semibold text-text-secondary"
      >
        Back to settings
      </Link>
    </div>
  );
}
