/**
 * ParentControls (PARENT-FLOWS Flow 8) — parent-owned boundaries that can
 * soften but never break the constitution; every control states WHY the
 * boundary exists. Session length stays inside the LS1-R1 band caps (the
 * hard cap is un-extendable by any setting); sprints are a real opt-out
 * (DD11/P11, no "recommended!" steering); the decorative persona voice is
 * optional while instruction TTS is never removable (P10); the data panel
 * lists exactly what is stored, in plain words (P12). Changes take effect
 * next session, never mid-session.
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BAND_SESSION_CAPS } from '../../constants';
import { bandForLevel } from '../../copy';
import { updateEnrollmentSettings } from '../../services/bbParentService';
import { useParentContext } from './FoundryParentLayout';
import type { BBEnrollmentSettings, SessionLengthSetting } from '../../types';

function Toggle({
  label,
  checked,
  onChange,
  why,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  why: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3">
        <span className="text-[15px] font-semibold text-text-primary">{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className="relative h-7 w-12 shrink-0 rounded-full transition-colors touch-manipulation"
          style={{ background: checked ? 'var(--mf-primary)' : 'var(--mf-line)' }}
        >
          <span
            className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all"
            style={{ left: checked ? 22 : 2 }}
          />
        </button>
      </label>
      <p className="text-[12.5px] leading-relaxed text-text-secondary">{why}</p>
    </div>
  );
}

export default function ParentControls() {
  const { childId = '' } = useParams<{ childId: string }>();
  const { loading, enrollments, childName, refresh } = useParentContext();
  const name = childName(childId);
  const enr = enrollments.get(childId);
  const [pending, setPending] = useState<Partial<BBEnrollmentSettings>>({});
  const [saving, setSaving] = useState(false);

  if (loading) return <p className="py-12 text-center text-text-secondary">Setting up…</p>;
  if (!enr) return <p className="py-12 text-center text-text-secondary">{name} hasn't started yet.</p>;

  const band = bandForLevel(enr.level);
  const caps = BAND_SESSION_CAPS[band];
  const settings: BBEnrollmentSettings = { ...enr.settings, ...pending };

  async function patch(p: Partial<BBEnrollmentSettings>) {
    setPending((prev) => ({ ...prev, ...p }));
    setSaving(true);
    try {
      await updateEnrollmentSettings(childId, p);
      void refresh();
    } catch (e) {
      console.error('[bb] settings save failed', e);
    } finally {
      setSaving(false);
    }
  }

  const lengthOptions: Array<{ value: SessionLengthSetting; label: string; minutes: string }> = [
    { value: 'short', label: 'Short', minutes: '≈5 min' },
    { value: 'standard', label: 'Standard', minutes: `≈${caps.target} min` },
    { value: 'full', label: 'Full', minutes: `≈${caps.hard} min` },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-[21px] font-bold text-text-primary">{name}'s settings</h1>
        {saving && <span className="text-[12px] text-text-muted">saving…</span>}
      </div>
      <p className="text-[12.5px] text-text-muted">Changes take effect next session — never mid-session.</p>

      <section className="mf-card-quiet flex flex-col gap-4 p-5">
        <Toggle
          label="Fluency sprints"
          checked={!settings.sprintOptOut}
          onChange={(on) => void patch({ sprintOptOut: !on })}
          why="Two calm minutes, you-versus-you, never graded — and genuinely optional. Off means the offer never appears and the fluency panel hides. Neither choice is 'recommended'; it's yours."
        />
        <Toggle
          label="Ms. Wren's voice"
          checked={settings.personaVoiceEnabled !== false}
          onChange={(on) => void patch({ personaVoiceEnabled: on })}
          why="The decorative persona voice. Instruction read-aloud always stays available — that part is an accessibility floor, not a preference."
        />
        <Toggle
          label="Sound effects"
          checked={settings.soundEffectsEnabled !== false}
          onChange={(on) => void patch({ soundEffectsEnabled: on })}
          why="Already minimal by design — no fanfares either way."
        />
      </section>

      {/* Session length — within the LS1-R1 band caps only. */}
      <section className="mf-card-quiet flex flex-col gap-3 p-5">
        <span className="mf-label mf-label-teal">Daily session length</span>
        <div className="flex gap-2">
          {lengthOptions.map((opt) => {
            const active = (settings.sessionLength ?? 'standard') === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => void patch({ sessionLength: opt.value })}
                className="flex min-h-[56px] flex-1 flex-col items-center justify-center rounded-xl border transition-colors touch-manipulation"
                style={
                  active
                    ? { borderColor: 'var(--mf-primary)', borderWidth: 2.5, background: 'var(--mf-primary-soft)' }
                    : { borderColor: 'var(--mf-line)', background: 'var(--mf-surface)' }
                }
              >
                <span className="text-sm font-bold text-text-primary">{opt.label}</span>
                <span className="text-[11px] text-text-secondary">{opt.minutes}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[12.5px] leading-relaxed text-text-secondary">
          At {name}'s band the day targets {caps.target} minutes and hard-caps at {caps.hard} — no
          setting extends it. More isn't better here; consistency is.
        </p>
      </section>

      <Link to={`/foundry/parent/school/${childId}`} className="mf-card-quiet flex items-center justify-between p-4">
        <span className="text-[15px] font-semibold text-text-primary">School sync</span>
        <span className="text-[12.5px] font-semibold text-primary">optional</span>
      </Link>

      {/* Data panel — P12: view exactly what is stored, in plain words. */}
      <section className="mf-card-quiet flex flex-col gap-2 p-5">
        <span className="mf-label mf-label-teal">What we store about {name}</span>
        <ul className="flex flex-col gap-1 text-[13px] leading-relaxed text-text-secondary">
          <li>· The placed level and the placement walk's cluster results</li>
          <li>· Each week's state, day tiles, and check scores</li>
          <li>· Each practice answer: the answer given, right/wrong, hints used, and a mistake-type tag</li>
          <li>· The weekly reports on your shelf, and when you tapped "Seen it"</li>
          <li>· These settings, including any school-topic note</li>
        </ul>
        <p className="text-[12.5px] leading-relaxed text-text-secondary">
          Nothing else — no recordings, no photos, no comparisons to other children. Everything
          stored is visible on these parent pages. To export or delete {name}'s practice data,
          contact us from your account page; deletion is honored fully.
        </p>
      </section>

      {/* Escalation contact — visible queue state lands with the live-teacher flow. */}
      <section className="mf-card-quiet p-5">
        <span className="mf-label mf-label-apricot">If a week ever gets steep</span>
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
          After two strengthening rounds, a teacher from our team steps in and we re-check the
          starting point — you'd see the scheduling right here, and the weekly report walks you
          through it. That's the system working, not a crisis.
        </p>
      </section>
    </div>
  );
}
