import { Poll, pollPdaAccount } from "@/types/polls";

export const getPollStatus = (poll:pollPdaAccount | null) => {
    const now = Math.floor(Date.now() / 1000);
    if (poll && now < Number(poll.startDate)) return { text: 'Upcoming', color: 'bg-blue-500' };
    if (poll && now >= Number(poll.startDate) && now <= Number(poll.endDate)) return { text: 'Active', color: 'bg-green-500' };
    return { text: 'Ended', color: 'bg-gray-500' };
  };
