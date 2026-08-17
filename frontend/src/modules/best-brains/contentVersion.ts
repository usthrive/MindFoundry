/**
 * The content stamp, on its own, importing nothing.
 *
 * It lived in packGenerator, and one service importing this single string —
 * bbProgressService, for a parent-facing progress tab — pulled the whole
 * generator behind it: 133 template modules, about 7 MB of authored weeks, into
 * the bundle every child downloads before the app will start. A constant should
 * never be able to do that, so it sits here where it has no dependencies to drag.
 *
 * Bumped when authored content changes in a way that invalidates a stored pack.
 */
export const CONTENT_VERSION = '1.2.0';
