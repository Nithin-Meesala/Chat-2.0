import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { RiCloseFill } from 'react-icons/ri';
import { MdGroups } from 'react-icons/md';

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType, channels } = useAppStore();

  // Find the selected channel and its members
  const selectedChannel = channels.find(channel => channel._id === selectedChatData?._id);
  const members = selectedChannel ? selectedChannel.members : [];

  console.log('Members:', members); // Debugging line to check the members array

  return (
    <div className='h-[10vh] border-b-2 border-[#00DFC0] flex items-center justify-between px-20'>
      <div className='flex gap-5 items-center w-full justify-between'>
        <div className='flex gap-3 items-center justify-center'>
          <div className="w-12 h-12 relative">
            {selectedChatType === 'contact' ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="w-full h-full bg-black object-cover"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.charAt(0)
                      : selectedChatData.email ? selectedChatData.email.charAt(0) : ''}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                <MdGroups size={30} />
              </div>
            )}
          </div>
          <div>
            {selectedChatType === 'channel' && selectedChatData.name}
            {selectedChatType === 'contact' && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>
        <div className='flex items-center justify-center gap-5'>
          {selectedChatType === 'channel' && members.length > 0 && (
            <div className="flex gap-2">
              {members.map(member => (
                <div key={member._id} className="flex items-center">
                  <Avatar className="w-8 h-8 rounded-full">
                    {member.image ? (
                      <AvatarImage
                        src={`${HOST}/${member.image}`}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-full h-full bg-black object-cover"
                      />
                    ) : ""
                      
                    }
                  </Avatar>
                  <span className="ml-2">
                    {member.firstName
                      ? `${member.firstName} ${member.lastName}`
                      : member.email}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button
            className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
            onClick={closeChat}
          >
            <RiCloseFill className='text-3xl text-[#00DFC0] hover:text-[#00dfc1d3] hover:rotate-90 transition-all' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
