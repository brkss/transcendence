import { Avatar } from "@chakra-ui/react";
import React from "react";
import { FiSend } from "react-icons/fi";

export default function ChatBox() {
  const scrollableRef = React.useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="flex flex-row justify-center w-full mt-5">

      <div
        className="border border-slate-950 rounded-md"
        style={{ width: "500px" }}
      >
        <div className="bg-black pl-2 rounded-sm py-2 mb-1">
          <p className="text-white">Chat room: ( Game ID )</p>
        </div>
        <div
          ref={scrollableRef}
          className="py-4 flex flex-col gap-2 max-h-[200px] overflow-hidden overflow-y-scroll scroll-auto"
        >
          <div className="flex flex-row gap-1 pl-2">
            <Avatar w={8} h={8} />
            <div>
              <p className="p-1 bg-slate-500 text-white px-2 rounded-md">
                message
              </p>
              <p className="text-[10px]">11/20/2023 03:33</p>
            </div>
          </div>
          <div className="flex flex-row gap-1 pl-2">
            <Avatar w={8} h={8} />
            <div>
              <p className="p-1 bg-slate-500 text-white px-2 rounded-md">
                messagemessagemessagemessagemessagemessage
              </p>
              <p className="text-[10px]">11/20/2023 03:33</p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-1 pr-2 pl-2">
            <Avatar w={8} h={8} />
            <div>
              <p className="bg-black text-white p-1 px-2 rounded-md break-all relative">
                message
              </p>
              <p className="text-[10px]">11/20/2023 03:33</p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-1 pr-2 pl-2">
            <Avatar w={8} h={8} />
            <div>
              <p className="bg-black text-white p-1 px-2 rounded-md break-all relative">
                messagemessagemessagemessagemessagemessagemessagemessagemessage
              </p>
              <p className="text-[10px]">11/20/2023 03:33</p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-1 pr-2 pl-2">
            <Avatar w={8} h={8} />
            <div>
              <p className="bg-black text-white p-1 px-2 rounded-md break-all relative">
                message
              </p>
              <p className="text-[10px]">11/20/2023 03:33</p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-1 pr-2 pl-2">
            <Avatar w={8} h={8} />
            <div>
              <p className="bg-black text-white p-1 px-2 rounded-md break-all relative">
                message
              </p>
              <p className="text-[10px]">11/20/2023 03:33</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <input
            className="rounded-md w-full rounded-tr-none rounded-br-none pl-2 outline-none py-0.5"
            placeholder="Say Hello!"
          />
          <button className=" border-slate-300 rounded-tl-none rounded-bl-none px-2">
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}
