'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';

export const Sidebar = () => {
  const { data } = useQuery({
    queryKey: ['tickets'],
    queryFn: () =>
      fetch(`https://backend-production-dbba.up.railway.app/api/tickets`).then(
        res => res.json(),
      ),
    refetchInterval: 5000,
  });

  const param = useParams();
  const path = usePathname();

  console.log(data);

  if (path !== '/sign-in')
    return (
      <div className='w-72 py-12 left-0 z-10  border-r bg-background p-6 shadow-lg overflow-y-auto h-screen'>
        <div className='flex flex-col sm:flex-row sm:justify-start sm:space-x-2'>
          <h1 className='font-extrabold text-2xl'>Tickets History</h1>
        </div>
        <div>
          {data ? (
            <div className='flex flex-col'>
              {data.map((ticket: any, index: number) => (
                <>
                  <Link
                    href={`/chat/${ticket.number}`}
                    key={index}
                    className={`relative rounded-2xl border border-gray-300 shadow-sm p-3  ${
                      parseInt(param.id) === ticket.number ? 'bg-gray-100' : ''
                    }  my-3 cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 hover:border-gray-400 drop-shadow-sm transition`}
                  >
                    <p>Ticket {ticket.number - 1}</p>
                    <p className='font-semibold'>{ticket.reason}</p>
                    <small>
                      {ticket.status.charAt(0).toUpperCase() +
                        ticket.status.slice(1)}
                    </small>
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
  return <div></div>;
};
