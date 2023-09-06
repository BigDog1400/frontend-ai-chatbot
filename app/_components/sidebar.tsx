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

  if (path !== '/sign-in')
    return (
      <div className='w-72 py-12 left-0 z-10  border-r bg-background p-6 shadow-lg overflow-y-auto h-screen'>
        <div className='flex flex-col sm:flex-row sm:justify-start sm:space-x-2'>
          <h1 className='font-extrabold text-2xl'>Listado de Tickets</h1>
        </div>
        <div>
          {data && data.length ? (
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
                    <div className='flex items-center '>
                      <div>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-6 h-6  text-slate-800'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z'
                          />
                        </svg>
                      </div>
                      <div className='ml-3'>
                        <p className='text-sm text-gray-700 leading-1 '>
                          Ticket {ticket.number}
                        </p>
                        <p className='font-medium text-gray-900 leading-[20px]'>
                          {ticket.reason}
                        </p>
                        <small>
                          {ticket.status === 'pending'
                            ? 'Pendiente'
                            : ticket.status.charAt(0).toUpperCase() +
                              ticket.status.slice(1)}
                        </small>
                      </div>
                    </div>
                  </Link>
                </>
              ))}
            </div>
          ) : (
            <div className='rounded-md bg-blue-50 p-4 mt-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-blue-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                    />
                  </svg>
                </div>
                <div className='ml-3 flex-1 md:flex md:justify-between'>
                  <p className='text-sm text-blue-700'>No hay ticket </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  return <div></div>;
};
