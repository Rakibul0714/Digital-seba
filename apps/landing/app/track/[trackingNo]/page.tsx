import { PortalPage } from '@/components/PortalPage';
export default async function Track({ params }: { params: Promise<{ trackingNo: string }> }) { const { trackingNo } = await params; return <PortalPage type="track" value={trackingNo} />; }
