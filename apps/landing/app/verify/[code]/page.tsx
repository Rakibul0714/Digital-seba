import { PortalPage } from '@/components/PortalPage';
export default async function Verify({ params }: { params: Promise<{ code: string }> }) { const { code } = await params; return <PortalPage type="verify" value={code} />; }
