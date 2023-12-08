import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'GPASS',
}
  
export default function ClassPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>{children}</>
  );
}