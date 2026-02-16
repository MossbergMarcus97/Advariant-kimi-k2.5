export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: 'new' }]
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
