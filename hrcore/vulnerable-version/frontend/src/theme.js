import { StyleSheet } from 'react-native';

// ─── Color Tokens ──────────────────────────────────────────────────────────────
export const C = {
  pageBg:       '#090D14',
  surfaceBg:    '#0F1521',
  elevatedBg:   '#141C2B',
  inputBg:      '#0C1018',

  border:       '#1E293B',
  borderSubtle: '#111827',
  borderFocus:  '#E94560',

  textPrimary:   '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted:     '#475569',
  placeholder:   '#334155',

  accent:        '#E94560',
  accentHover:   '#FF2D4F',
  accentGlow:    'rgba(233, 69, 96, 0.25)',
  accentMuted:   'rgba(233, 69, 96, 0.08)',

  success:       '#10B981',
  successMuted:  'rgba(16, 185, 129, 0.1)',
  warning:       '#F59E0B',
  warningMuted:  'rgba(245, 158, 11, 0.1)',
  danger:        '#EF4444',
  dangerMuted:   'rgba(239, 68, 68, 0.1)',
  info:          '#3B82F6',
  infoMuted:     'rgba(59, 130, 246, 0.1)',
};

// ─── Shared Styles ─────────────────────────────────────────────────────────────
export const t = StyleSheet.create({
  // Layout
  screen:    { flex: 1, backgroundColor: C.pageBg },
  screenPad: { flex: 1, backgroundColor: C.pageBg, padding: 24 },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.pageBg },
  scrollContent: { flexGrow: 1, backgroundColor: C.pageBg, padding: 24 },

  // Card
  card: {
    backgroundColor: C.surfaceBg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 20,
  },

  // Typography
  h1:      { fontSize: 26, fontWeight: '700', color: C.textPrimary, letterSpacing: -0.3 },
  h2:      { fontSize: 20, fontWeight: '600', color: C.textPrimary, letterSpacing: -0.2 },
  h3:      { fontSize: 16, fontWeight: '600', color: C.textPrimary },
  body:    { fontSize: 15, color: C.textSecondary, lineHeight: 22 },
  small:   { fontSize: 13, color: C.textSecondary },
  label:   { fontSize: 12, fontWeight: '600', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 0.9, marginBottom: 8, marginTop: 16 },
  caption: { fontSize: 11, color: C.textMuted },

  // Inputs
  input: {
    backgroundColor: C.inputBg,
    color: C.textPrimary,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    fontSize: 15,
  },
  inputFocused: { borderColor: C.accent },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' },

  // Buttons
  btnPrimary: {
    backgroundColor: C.accent,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  btnSecondary: {
    backgroundColor: C.elevatedBg,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  btnDanger: {
    backgroundColor: C.dangerMuted,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.danger,
    alignItems: 'center',
  },
  btnOutline: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  btnText:         { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnTextSecondary:{ color: C.textSecondary, fontWeight: '600', fontSize: 15 },
  btnTextDanger:   { color: C.danger, fontWeight: '600', fontSize: 13 },
  btnTextOutline:  { color: C.textSecondary, fontWeight: '600', fontSize: 13 },

  // List rows
  row: {
    backgroundColor: C.surfaceBg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },

  // Divider
  divider: { height: 1, backgroundColor: C.border, marginVertical: 20 },

  // Badges
  badgeSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeAccent: {
    backgroundColor: C.accentMuted,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeNeutral: {
    backgroundColor: C.elevatedBg,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
});
