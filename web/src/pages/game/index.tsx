import React, { useEffect } from "react";
import PongSketch from "@/components/Game/PongSketch";
import { Layout } from "@/components";
import { io } from "socket.io-client";
import { getAccessToken } from "@/utils/token";
import { FiSend, FiSettings } from "react-icons/fi";
import { Menu, MenuList, MenuItem, MenuButton, Switch } from "@chakra-ui/react";
import ChatBox from "@/components/Game/chat/ChatBox";

export default function Index() {
  const socket = io("http://localhost:8000/", {
    extraHeaders: {
      Authorization: getAccessToken(),
    },
  });

  const [gameMode, setGameMode] = React.useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.send("Hello, WebSocket server!");
    });

    socket.on("message", (data: any) => {
      console.log("Message from server:", data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
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

      <div className="flex flex-row justify-center w-full">
        <PongSketch isSecondaryModeOn={!gameMode} />
      </div>
      <ChatBox />
    </Layout>
  );
}
