export function Stack({ children, gap = 1 }: { gap?: number; children: React.ReactNode }) {
	return <div style={{ display: 'grid', gap: `${gap}rem` }}>{children}</div>;
}
