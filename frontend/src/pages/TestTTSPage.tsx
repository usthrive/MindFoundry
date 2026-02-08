import { useState, useEffect, useRef, useCallback } from 'react';
import * as ttsService from '../services/ttsService';
import type { VoiceType } from '../services/ttsService';
import { supabase } from '../lib/supabase';

interface LogEntry {
  id: number;
  time: string;
  elapsed: string;
  level: 'log' | 'warn' | 'error';
  message: string;
}

const QUICK_PHRASES = [
  "Great job!",
  "What is 3 plus 5?",
  "Let's try the next one.",
  "Remember to line up the numbers.",
  "You're doing amazing! Keep going and you'll master this in no time. Math is all about practice, and every problem you solve makes you stronger.",
];

const VOICES = [
  { id: 'nova', label: 'Nova (Default)' },
  { id: 'shimmer', label: 'Shimmer' },
  { id: 'coral', label: 'Coral' },
  { id: 'alloy', label: 'Alloy' },
];

export default function TestTTSPage() {
  const [text, setText] = useState("Hello! Let's practice math together. What is 7 plus 3?");
  const [voice, setVoice] = useState('nova');
  const [speed, setSpeed] = useState(0.9);
  const [voiceType, setVoiceType] = useState<VoiceType>('google');
  const [playState, setPlayState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sessionStatus, setSessionStatus] = useState<string>('checking...');
  const [requestCount, setRequestCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [lastTiming, setLastTiming] = useState<number | null>(null);
  const [isBursting, setIsBursting] = useState(false);

  const logIdRef = useRef(0);
  const startTimeRef = useRef(performance.now());
  const logContainerRef = useRef<HTMLDivElement>(null);
  const requestStartRef = useRef<number>(0);

  // Add a log entry
  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    const now = performance.now();
    const elapsed = ((now - startTimeRef.current) / 1000).toFixed(1);
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 1 } as Intl.DateTimeFormatOptions);
    setLogs(prev => [...prev, {
      id: logIdRef.current++,
      time,
      elapsed: `+${elapsed}s`,
      level,
      message,
    }]);
  }, []);

  // Intercept console methods to capture [TTS] logs
  useEffect(() => {
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = (...args: unknown[]) => {
      origLog.apply(console, args);
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      if (msg.includes('[TTS]')) {
        addLog('log', msg);
      }
    };

    console.warn = (...args: unknown[]) => {
      origWarn.apply(console, args);
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      if (msg.includes('[TTS]')) {
        addLog('warn', msg);
      }
    };

    console.error = (...args: unknown[]) => {
      origError.apply(console, args);
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      if (msg.includes('[TTS]') || msg.includes('Speech error')) {
        addLog('error', msg);
      }
    };

    return () => {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
    };
  }, [addLog]);

  // Auto-scroll debug log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Check session on mount
  useEffect(() => {
    async function checkSession() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        setSessionStatus('error: ' + error.message);
      } else if (session) {
        const expiresAt = session.expires_at ? new Date(session.expires_at * 1000).toLocaleTimeString() : '?';
        setSessionStatus(`valid (expires ${expiresAt})`);
      } else {
        setSessionStatus('none');
      }
    }
    checkSession();
  }, []);

  const handlePlay = async () => {
    if (!text.trim()) return;

    ttsService.stop();
    setPlayState('loading');
    setRequestCount(c => c + 1);
    requestStartRef.current = performance.now();
    addLog('log', `--- PLAY: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}" | voice=${voice} speed=${speed} type=${voiceType} ---`);

    try {
      await ttsService.speak(
        text,
        { voice, speakingRate: speed },
        () => {
          const timing = Math.round(performance.now() - requestStartRef.current);
          addLog('log', `--- ENDED (total ${timing}ms) ---`);
          setPlayState('idle');
        },
        (err) => {
          const timing = Math.round(performance.now() - requestStartRef.current);
          addLog('error', `--- ERROR after ${timing}ms: ${err.message} ---`);
          setPlayState('idle');
          setErrorCount(c => c + 1);
        },
        voiceType
      );

      if (ttsService.isPlaying()) {
        const timing = Math.round(performance.now() - requestStartRef.current);
        setLastTiming(timing);
        addLog('log', `--- PLAYING (loaded in ${timing}ms) ---`);
        setPlayState('playing');
      }
    } catch (err) {
      addLog('error', `--- EXCEPTION: ${err instanceof Error ? err.message : String(err)} ---`);
      setPlayState('idle');
      setErrorCount(c => c + 1);
    }
  };

  const handleStop = () => {
    ttsService.stop();
    setPlayState('idle');
    addLog('log', '--- STOPPED ---');
  };

  const handlePause = () => {
    ttsService.pause();
    setPlayState('paused');
    addLog('log', '--- PAUSED ---');
  };

  const handleResume = () => {
    ttsService.resume();
    setPlayState('playing');
    addLog('log', '--- RESUMED ---');
  };

  const handlePreload = async () => {
    if (!text.trim()) return;
    setRequestCount(c => c + 1);
    addLog('log', `--- PRELOAD: "${text.slice(0, 60)}..." ---`);
    const start = performance.now();
    try {
      const success = await ttsService.preload(text, { voice, speakingRate: speed });
      const timing = Math.round(performance.now() - start);
      addLog(success ? 'log' : 'warn', `--- PRELOAD ${success ? 'OK' : 'FAILED'} (${timing}ms) ---`);
    } catch (err) {
      const timing = Math.round(performance.now() - start);
      addLog('error', `--- PRELOAD ERROR (${timing}ms): ${err instanceof Error ? err.message : String(err)} ---`);
      setErrorCount(c => c + 1);
    }
  };

  const handleBurstTest = async () => {
    setIsBursting(true);
    addLog('warn', '=== BURST TEST: Firing 5 rapid TTS calls ===');

    const phrases = [
      "First burst call",
      "Second burst call",
      "Third burst call",
      "First burst call", // duplicate of #1 to test dedup
      "Fourth burst call",
    ];

    const promises = phrases.map((phrase, i) => {
      addLog('log', `  Burst #${i + 1}: "${phrase}"`);
      setRequestCount(c => c + 1);
      return ttsService.preload(phrase, { voice, speakingRate: speed })
        .then(ok => addLog(ok ? 'log' : 'warn', `  Burst #${i + 1} result: ${ok ? 'OK' : 'FAILED'}`))
        .catch(err => {
          addLog('error', `  Burst #${i + 1} error: ${err instanceof Error ? err.message : String(err)}`);
          setErrorCount(c => c + 1);
        });
    });

    await Promise.allSettled(promises);
    addLog('warn', '=== BURST TEST COMPLETE ===');
    setIsBursting(false);
  };

  const handleClearCache = () => {
    ttsService.clearCache();
    addLog('log', '--- CACHE CLEARED ---');
  };

  const logLevelColors: Record<LogEntry['level'], string> = {
    log: 'text-green-400',
    warn: 'text-yellow-400',
    error: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">TTS Debug Console</h1>
          <p className="text-sm text-gray-500 mt-1">
            Standalone test page for Text-to-Speech. Type text, adjust settings, and observe debug output.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column: Controls */}
          <div className="space-y-4">
            {/* Status bar */}
            <div className="bg-white rounded-lg border p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Session:</span>{' '}
                <span className={sessionStatus.startsWith('valid') ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {sessionStatus}
                </span>
              </div>
              <div>
                <span className="text-gray-500">State:</span>{' '}
                <span className="font-medium">{playState}</span>
              </div>
              <div>
                <span className="text-gray-500">Requests:</span>{' '}
                <span className="font-medium">{requestCount}</span>
                {errorCount > 0 && <span className="text-red-600 ml-1">({errorCount} err)</span>}
              </div>
              <div>
                <span className="text-gray-500">Last:</span>{' '}
                <span className="font-medium">{lastTiming !== null ? `${lastTiming}ms` : '—'}</span>
              </div>
            </div>

            {/* Text input */}
            <div className="bg-white rounded-lg border p-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Text to speak</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={3}
                className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none resize-y"
                placeholder="Type text to speak..."
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {QUICK_PHRASES.map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => setText(phrase)}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                    title={phrase}
                  >
                    {phrase.length > 30 ? phrase.slice(0, 30) + '...' : phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg border p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Voice</label>
                  <select
                    value={voice}
                    onChange={e => setVoice(e.target.value)}
                    className="w-full border rounded-md p-1.5 text-sm"
                  >
                    {VOICES.map(v => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Voice Type</label>
                  <select
                    value={voiceType}
                    onChange={e => setVoiceType(e.target.value as VoiceType)}
                    className="w-full border rounded-md p-1.5 text-sm"
                  >
                    <option value="google">HD (OpenAI)</option>
                    <option value="browser">Browser</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Speed: {speed.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.25"
                  max="2"
                  step="0.05"
                  value={speed}
                  onChange={e => setSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0.25 (slow)</span>
                  <span>1.0</span>
                  <span>2.0 (fast)</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-white rounded-lg border p-3">
              <div className="flex flex-wrap gap-2">
                {playState === 'idle' && (
                  <button
                    onClick={handlePlay}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Play
                  </button>
                )}
                {playState === 'loading' && (
                  <button
                    disabled
                    className="px-4 py-2 bg-blue-300 text-white rounded-lg text-sm font-medium cursor-wait"
                  >
                    Loading...
                  </button>
                )}
                {playState === 'playing' && (
                  <>
                    <button
                      onClick={handlePause}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                    >
                      Pause
                    </button>
                    <button
                      onClick={handleStop}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Stop
                    </button>
                  </>
                )}
                {playState === 'paused' && (
                  <>
                    <button
                      onClick={handleResume}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Resume
                    </button>
                    <button
                      onClick={handleStop}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Stop
                    </button>
                  </>
                )}

                <div className="border-l mx-1" />

                <button
                  onClick={handlePreload}
                  disabled={playState !== 'idle'}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
                >
                  Preload
                </button>

                <button
                  onClick={handleBurstTest}
                  disabled={isBursting || playState !== 'idle'}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
                >
                  {isBursting ? 'Bursting...' : 'Burst Test (5x)'}
                </button>

                <button
                  onClick={handleClearCache}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                >
                  Clear Cache
                </button>
              </div>
            </div>

            {/* Cache status */}
            <div className="bg-white rounded-lg border p-3 text-xs text-gray-600">
              <span className="font-medium">Cache:</span>{' '}
              {ttsService.isCached(text) ? (
                <span className="text-green-600 font-medium">HIT (current text is cached)</span>
              ) : (
                <span className="text-gray-400">MISS</span>
              )}
            </div>
          </div>

          {/* Right column: Debug log */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 flex flex-col" style={{ minHeight: '500px' }}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
              <span className="text-xs font-mono text-gray-400">Debug Log</span>
              <button
                onClick={() => { setLogs([]); startTimeRef.current = performance.now(); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
            <div
              ref={logContainerRef}
              className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-0.5"
            >
              {logs.length === 0 && (
                <div className="text-gray-600 italic">Click Play to see TTS debug output here...</div>
              )}
              {logs.map(entry => (
                <div key={entry.id} className={`${logLevelColors[entry.level]} leading-relaxed`}>
                  <span className="text-gray-600">{entry.elapsed}</span>{' '}
                  {entry.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
