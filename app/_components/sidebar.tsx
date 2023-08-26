import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

const URL = process.env.API_URL;

export const Sidebar = async () => {
  const ticketList = await fetch(`${URL}/api/tickets`)
    .then(res => res.json())
    .catch(err => console.log(err));

  return (
    <div className='w-72 flex flex-col inset-y-0 left-0 z-10  min-h-screen border-r bg-background p-6 shadow-lg'>
      <div className='flex flex-col sm:flex-row sm:justify-start sm:space-x-2'>
        <h1>Tickets History</h1>
      </div>
      <div>
        {ticketList ? (
          <div className='flex flex-col'>
            {ticketList.map((ticket: any) => (
              <>
                <Link
                  href={`chat/${ticket.number}`}
                  className='relative border p-3 rounded-md my-3 cursor-pointer'
                >
                  {ticket.initialContext}
                </Link>
              </>
            ))}
          </div>
        ) : (
          <p>There are not tickets</p>
        )}
      </div>
    </div>
  );
};
