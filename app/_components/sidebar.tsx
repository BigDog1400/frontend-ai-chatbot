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

  console.log(param.id);

  return (
    <div className='w-72 left-0 z-10  border-r bg-background p-6 shadow-lg overflow-y-auto h-screen'>
      <div className='flex flex-col sm:flex-row sm:justify-start sm:space-x-2'>
        <h1>Tickets History</h1>
      </div>
      <div>
        {data ? (
          <div className='flex flex-col'>
            {data.map((ticket: any, index: number) => (
              <>
                <Link
                  href={`/chat/${ticket.number}`}
                  key={ticket.number}
                  className={`relative rounded-lg border border-gray-300 shadow-sm p-3  ${
                    parseInt(param.id) === index + 1 ? 'bg-red-400' : ''
                  }  my-3 cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 hover:border-gray-400`}
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
