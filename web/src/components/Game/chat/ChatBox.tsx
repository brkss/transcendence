import { Avatar } from "@chakra-ui/react";
import React from "react";
import { FiSend } from "react-icons/fi";
import { Socket } from "socket.io-client";
import Message, {IMessage} from './Message'
import { ChangeEvent } from "react";
import { IConnectedUser } from "@/pages/game";
import { getPayload } from "@/utils/helpers";
import { Text } from "@chakra-ui/react";

interface IChatBox {
  socket: Socket
  roomDetails? : { hostUserId: number, label?: string, id: string }
}

export default function ChatBox(props: IChatBox) {
  const scrollableRef = React.useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  };
  //const [messages, setMessages] = React.useState<IMessage[]|undefined>([{message: 'test', date: new Date(), isSelfMessage: false}]);
  const [messages, setMessages] = React.useState<IMessage[] | undefined>(undefined); // Initialize as undefined
  const [message, setMessage] = React.useState<string>('');
  const user: IConnectedUser = getPayload() as IConnectedUser;

  const {socket} = props;

  React.useEffect(() => {
    scrollToBottom();
    socket.on('gameChatMessage', (data: IMessage & {senderId: number}) => {
      console.log(data);
      const newData = {...data, date: new Date(data.date), isSelfMessage: user?.userID === data?.senderId};

      if (messages)
      {
        setMessages([...messages, newData])
      } else {
        setMessages([newData])
      }
    })
  }, [messages]);

  return (
    <div className="flex flex-row justify-center w-full mt-5">

      <div
        className="border border-slate-950 rounded-md"
        style={{ width: "500px" }}
      >
        <div className="bg-black pl-2 rounded-sm py-2 mb-1">
        <p className="text-white">
  Chat room: (
  {props.roomDetails?.label !== undefined ? props.roomDetails.label : "-"} -{" "}
  {props.roomDetails?.id !== undefined
    ? Number.parseFloat(props.roomDetails.id).toFixed(6).split(".")[1]
    : "-"}
  )
</p>
        </div>
       <div
          ref={scrollableRef}
          className="py-4 flex flex-col gap-2 max-h-[200px] overflow-hidden overflow-y-scroll scroll-auto"
        >
          {messages?.map(({isSelfMessage, message, date})=><Message isSelfMessage={isSelfMessage} message={message} date={date}  />)}
          {messages === undefined && <Text textAlign="center" fontSize="lg" color="black" fontWeight="bold">
  Chat with your opponent and make the game more exciting!
</Text>}
        </div>
        <div className="flex flex-row">
          <input
            className="rounded-md w-full rounded-tr-none rounded-br-none pl-2 outline-none py-0.5"
            placeholder="Say Hello!"
            value={message}
            onChange={(event:ChangeEvent<HTMLInputElement>)=>{
              setMessage(event.target.value)
            }}
          />
          <button onClick={()=> {
            socket.emit('gameChatMessage', {message, date: new Date(), isSelfMessage: true, senderId: user.userID } as IMessage)
            setMessage('')
            }} className=" border-slate-300 rounded-tl-none rounded-bl-none px-2">
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}