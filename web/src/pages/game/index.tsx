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

import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface IConnectedUser {
  id: number;
  userID: number;
  username: string;
  socketId: string;
}

export default function Index() {
  console.log("initsocket");

  const [gameMode, setGameMode] = React.useState(false);
  const [isNotAllowed, setIsNotAllowed] = React.useState(false);
  const [winner, setWinner] = React.useState<IConnectedUser | null>(null);
  const [userRoomData, setRoomData] = React.useState<{ hostUserId: number }>();
  const [socketIo, setSocketIo] = React.useState<any>(
    io("http://localhost:8000/game", {
      extraHeaders: {
        Authorization: getAccessToken(),
      },
    })
  );
  const user: IConnectedUser = getPayload() as IConnectedUser;

  console.log("user", socketIo);

  useEffect(() => {
    console.log("joinQueue emit", socketIo.id);
    socketIo.on("connect", () => {
      console.log("Connected to WebSocket server");
      // socket.send("Hello, WebSocket server!");
      socketIo.emit("joinQueue");
    });
    socketIo.on("winner", (data: any) => {
      setWinner(data);
    });
    socketIo.on("moveX", () => console.log("movex"));
    socketIo.on("joinedQueue", (data: any) => {
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

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <Layout disablePadding>
      <div className="flex flex-row justify-center w-full mb-2">
        <Menu>
          <MenuButton>
            <div className="p-3 bg-black rounded-md hover:opacity-90 cursor-pointer transition-all">
              <FiSettings color="white" />
            </div>
          </MenuButton>
          <MenuList className="text-center">
            <div className="flex flex-row gap-2 items-center hover:bg-black/10 py-1 justify-center">
              <p>Crazy mode {gameMode ? "OFF" : "ON"}!</p>
              <Switch
                isChecked={!gameMode}
                onChange={() => setGameMode(!gameMode)}
              />
            </div>
          </MenuList>
        </Menu>
      </div>

      {isNotAllowed ? (
        <div className="flex flex-row justify-center w-full">
          <p>User not allowed to play (needs further handling)</p>
        </div>
      ) : (
        <>
          {winner?.id === user?.id ? (
            <div className="flex flex-row justify-center w-full">
            <p className="text-5xl font-extrabold text-indigo-700 bg-gradient-to-r from-yellow-300 to-pink-500 p-6 rounded-md shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105">
  YOU WON
</p>


            </div>
          ) : (
            <>
              <div className="flex flex-row justify-center w-full">
                {userRoomData?.hostUserId !== null ? (
                  <PongSketch
                    isHost={user.userID === userRoomData?.hostUserId}
                    socket={socketIo}
                    isSecondaryModeOn={!gameMode}
                  />
                ) : (
                  "notReady"
                )}
              </div>
              <ChatBox />
            </>
          )}
        </>
      )}
    </Layout>
  );
}
