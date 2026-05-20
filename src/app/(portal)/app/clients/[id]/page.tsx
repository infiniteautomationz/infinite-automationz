import { redirect } from 'next/navigation';

export default function ClientsIdRedirectPage() {
  redirect('/app/admin/customers');
}
