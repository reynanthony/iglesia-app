import { redirect } from 'next/navigation'
import { clearPageBlocks } from '@/app/actions/admin'

export default async function ResetPageRoute({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  await clearPageBlocks(page)
  redirect('/admin/paginas')
}
