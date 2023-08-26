import { ThemeToggle } from '@/components/theme-toggle';

const URL = process.env.API_URL;

export const Sidebar = async () => {
  const ticketList = await fetch(`${URL}/api/tickets`)
    .then(res => res.json())
    .catch(err => console.log(err));
  return (
    <div className='w-72 flex flex-col justify-between inset-y-0 left-0 z-50 h-full border-r bg-background p-6 shadow-lg'>
      <div className='flex flex-col sm:flex-row sm:justify-start sm:space-x-2'>
        <h1>Tickets History</h1>
      </div>
      <div>
        {ticketList.length ? (
          <>
            {ticketList.map((ticket: any) => (
              <div
                className='relative max-h-5 my-3 flex-1 select-none overflow-hidden text-ellipsis break-all'
                key={ticket.number}
              >
                <span className='whitespace-nowrap'>
                  {ticket.initialContext}
                </span>
              </div>
            ))}
          </>
        ) : (
          <p>There are not tickets</p>
        )}
      </div>
      <div>
        <ThemeToggle />
      </div>
    </div>
  );
};
