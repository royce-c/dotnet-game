import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner"


import { useEffect, useState } from "react";
import useSignalR from "./useSignalR";

type Message = {
  id: number;
  content: string;
  createdAt: string;
};

export default function Component() {
  const { connection } = useSignalR("/r/chatHub");

  useEffect(() => {
    if (!connection) {
      return;
    }
    // listen for messages from the server
    connection.on("ReceiveMessage", (message: Message) => {
      // from the server
      setMessages((messages) => [...(messages || []), message]);
      toast("New Message", {
        description: message.content,
        action: {
          label: "Cool",
          onClick: () => console.log("cool"),
        },
      });
    });

    return () => {
      connection.off("ReceiveMessage");
    };
  }, [connection]);

  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<Message[]>();

  useEffect(() => {
    async function getMessages() {
      const result = await fetch("/api/messages");
      const messages = await result.json();
      setMessages(messages);
    }
    getMessages();
  }, []);

  const sendMessage = async () => {
    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setContent("");
  };

  return (
    <div className="flex w-full mx-auto shadow-xl h-[100vh] rounded-tl-3xl rounded-bl-3xl overflow-hidden">
      <div className="grid w-[250px] border-r items-stretch">
        <div className="flex h-12 items-center px-4 border-b">
          <h2 className="text-lg font-medium leading-none">general</h2>
          <p>{connection ? "✅" : "❌"}</p>
          
        </div>
        <div className="flex-1 overflow-auto">
          
        </div>

      </div>
      <div className="grid w-full border-r items-stretch">
        <div className="flex h-12 items-center px-4 border-b">
          <h2 className="text-lg font-medium leading-none">general</h2>
        </div>
        <div className="flex-1 overflow-auto p-4 gap-4 flex flex-col">
          {messages?.map((message) => (
            // a single message
            <div className="flex items-start gap-4" key={message.id}>
              <div className="rounded-full overflow-hidden w-10 h-10">
                <img
                  alt="User 2"
                  className="rounded-full border"
                  height="48"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "48/48",
                    objectFit: "cover",
                  }}
                  width="48"
                />
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                  <p className="font-semibold">User</p>
                  <p>{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex h-12 items-center px-4">
          <Input
            className="flex-1 rounded-full"
            placeholder="Message #general"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button className="ml-4" onClick={sendMessage}>
            Send
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
