import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";

export default function ChatBox() {

  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  // ID ÚNICO DEL CLIENTE
  const [chatId] = useState(() => {

    let saved = localStorage.getItem("chatId");

    if (!saved) {

      saved = crypto.randomUUID();

      localStorage.setItem("chatId", saved);

    }

    return String(saved);

  });

  // ESCUCHAR MENSAJES EN TIEMPO REAL
  useEffect(() => {

    const normalizedChatId = String(chatId || "").trim();

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const loadedMessages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (msg) =>
            String(msg.chatId || "").trim() === normalizedChatId
        );

      setMessages(loadedMessages);

    });

    return () => unsubscribe();

  }, [chatId]);

  // AUTO SCROLL
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // ENVIAR MENSAJE
  const sendMessage = async () => {

    if (!message.trim()) return;

    await addDoc(collection(db, "messages"), {

      text: message,
      sender: "client",
      chatId: String(chatId),
      createdAt: Date.now(),

    });

    setMessage("");

  };

  return (
    <>
      {/* BOTÓN CHAT */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-full shadow-2xl"
      >
        💬 Chat
      </button>

      {/* CHAT */}
      {chatOpen && (

        <div className="fixed bottom-24 right-6 z-50 w-[380px] bg-white rounded-[30px] overflow-hidden shadow-2xl border border-gray-300">

          {/* HEADER */}
          <div className="bg-black text-white p-5 flex justify-between items-center">

            <div>

              <h2 className="font-black text-2xl">
                Awesome Fence
              </h2>

              <p className="text-sm opacity-70">
                Live Support
              </p>

            </div>

            <button
              onClick={() => setChatOpen(false)}
              className="text-xl"
            >
              ✕
            </button>

          </div>

          {/* MENSAJES */}
          <div className="h-[350px] overflow-y-auto p-4 bg-gray-100 flex flex-col gap-3">

            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                Start the conversation...
              </div>
            )}

            {messages.map((msg) => (

              <div
                key={msg.id}
                className={`max-w-[80%] px-4 py-3 rounded-2xl break-words ${
                  msg.sender === "admin"
                    ? "bg-blue-700 text-white self-end"
                    : "bg-gray-200 text-black self-start shadow"
                }`}
              >
                {msg.text}
              </div>

            ))}

            <div ref={messagesEndRef}></div>

          </div>

          {/* INPUT */}
          <div className="p-4 flex gap-2 border-t bg-white">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 rounded-full"
            >
              Send
            </button>

          </div>

        </div>

      )}
    </>
  );

}