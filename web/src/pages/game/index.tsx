import React, { useEffect } from "react";
import PongSketch from "@/components/Game/PongSketch";
import { Layout } from "@/components";
import { io } from "socket.io-client";
import { getAccessToken } from "@/utils/token";
import { FiSend, FiSettings } from "react-icons/fi";
import { Menu, MenuList, MenuItem, MenuButton, Switch } from "@chakra-ui/react";
import ChatBox from "@/components/Game/chat/ChatBox";
import { getPayload } from "@/utils/helpers";
import { Socket } from "socket.io";
import { GameMode } from '@/components';

import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useSearchParams } from "next/navigation";
import { API_URL_BASE } from "@/utils/constants";
export interface IConnectedUser {
  id: number;
  userID: number;
  username: string;
  socketId: string;
}

export default function Index() {
  console.log("initsocket");
  const [currentMode, setCurrentMode] = React.useState("NORMAL");
  const searchParams = useSearchParams();
  const [gameMode, setGameMode] = React.useState(false);
  const [isNotAllowed, setIsNotAllowed] = React.useState(false);
  const [winner, setWinner] = React.useState<IConnectedUser | null>(null);
  const [userRoomData, setRoomData] = React.useState<{ hostUserId: number, label: string, id: string }>();
  let socketIo = React.useMemo(() => io(`${API_URL_BASE}/game`, {
		extraHeaders: {
			Authorization: getAccessToken()
		},
    //autoConnect: false
	}), []);
  // const [socketIo, setSocketIo] = React.useState<any>(
  //   //io("http://localhost:8001/api/game", {
  //   io("http://localhost:8000/game", {
  //     extraHeaders: {
  //       Authorization: getAccessToken(),
  //     },
  //   })
  // );
  const user: IConnectedUser = getPayload() as IConnectedUser;
  const arcadeMode = searchParams.get("arcade");
  const gid = searchParams.get("gid");

  console.log("user", socketIo);

  useEffect(() => {
    console.log("joinQueue emit", socketIo.id);
    socketIo.on("connect", () => {
      console.log("Connected to WebSocket server");
      // socket.send("Hello, WebSocket server!");  
        if(gid)
          socketIo.emit("joinPrivateGame", { gid: gid });
        else if(arcadeMode)
          socketIo.emit("joinArcadeQueue");
        else
          socketIo.emit("joinQueue");

    });
    socketIo.on("winner", (data: any) => {
      console.log("winner what ?", data);
      setWinner(data);
    });
    socketIo.on("moveX", () => console.log("movex"));
    socketIo.on("joinedQueue", (data: any) => {``
      console.log("queue joined", data);
    });
    socketIo.on("notAllowed", (data: any) => {
      setIsNotAllowed(true);
    });

    socketIo.on("currentRoomDetails", (data: any) => {

      setRoomData(data);
    });

    socketIo.on("message", (data: any) => {
      console.log("Message from server:", data);
    });

    socketIo.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socketIo.connect();

    return () => {
      socketIo.disconnect();
    };
  }, [socketIo]);

  return (
    <Layout disablePadding>
      {isNotAllowed ? (
        <div className="flex flex-row justify-center w-full">
          <p>User not allowed to play</p>
        </div>
      ) : (
        <>
          {winner?.id === user?.id ? (
            <div className="flex flex-row justify-center w-full">
              <p className="text-5xl font-extrabold text-indigo-700 bg-gradient-to-r from-yellow-300 to-pink-500 p-6 rounded-md shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105">
                Your&apos;e opponent left the game{" "}
              </p>
            </div>
          ) : (
            <>
              <GameMode select={(mode) => setCurrentMode(mode)} />
              <div className="flex flex-row justify-center w-full">
                {userRoomData?.hostUserId !== null ? (
                  <PongSketch
                    isHost={user.userID === userRoomData?.hostUserId}
                    socket={socketIo}
                    isSecondaryModeOn={arcadeMode === "on" && false}
                    isSecond={currentMode === "NUKE"}
                  />
                ) : (
                  "notReady"
                )}
              </div>
              {userRoomData?.hostUserId !== null && <ChatBox socket={socketIo} roomDetails = {userRoomData} />}
            </>
          )}
        </>
      )}
    </Layout>
  );
}
