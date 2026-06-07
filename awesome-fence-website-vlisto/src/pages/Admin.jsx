import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";

import { db, storage } from "../firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function Admin() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [requests, setRequests] = useState([]);

  const [selectedChat, setSelectedChat] = useState(null);

  const [chatList, setChatList] = useState([]);

  const [galleryImages, setGalleryImages] = useState([]);

  const messagesEndRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // LOAD CHATS
  useEffect(() => {

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const allMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const groupedChats = [
        ...new Map(
          allMessages
            .filter((msg) => msg.chatId)
            .map((msg) => [
              String(msg.chatId),
              {
                chatId: String(msg.chatId),
                lastMessage: msg.text,
              },
            ])
        ).values(),
      ];

      setChatList(groupedChats);

      if (
        !selectedChat &&
        groupedChats.length > 0
      ) {

        setSelectedChat(
          groupedChats[0].chatId
        );

      }

      const activeChat =
        selectedChat ||
        groupedChats[0]?.chatId;

      setMessages(
        allMessages.filter(
          (msg) =>
            String(msg.chatId) ===
            String(activeChat)
        )
      );

    });

    return () => unsubscribe();

  }, [selectedChat]);

  // LOAD REQUESTS
  useEffect(() => {

    const q = query(
      collection(db, "contactRequests"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      setRequests(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

    });

    return () => unsubscribe();

  }, []);

  // LOAD GALLERY
  useEffect(() => {

    const q = query(
      collection(db, "galleryImages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      setGalleryImages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

    });

    return () => unsubscribe();

  }, []);

  // SEND MESSAGE
  const sendMessage = async () => {

    if (!message.trim()) return;

    if (!selectedChat) return;

    await addDoc(collection(db, "messages"), {

      text: message,

      sender: "admin",

      chatId: String(selectedChat),

      createdAt: Date.now(),

    });

    setMessage("");

  };

  // DELETE CHAT
  const deleteConversation = async (chatId) => {

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", String(chatId))
    );

    const snapshot = await getDocs(q);

    for (const messageDoc of snapshot.docs) {

      await deleteDoc(
        doc(db, "messages", messageDoc.id)
      );

    }

    setSelectedChat(null);

    setMessages([]);

  };

  // DELETE REQUEST
  const deleteRequest = async (id) => {

    await deleteDoc(
      doc(db, "contactRequests", id)
    );

  };

  // UPLOAD IMAGE
  const handleUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      const imageRef = ref(
        storage,
        `gallery/${Date.now()}-${file.name}`
      );

      await uploadBytes(imageRef, file);

      const downloadURL =
        await getDownloadURL(imageRef);

      await addDoc(
        collection(db, "galleryImages"),
        {
          imageUrl: downloadURL,
          path: imageRef.fullPath,
          createdAt: Date.now(),
        }
      );

    } catch (error) {

      console.log(error);

    }

  };

  // DELETE IMAGE
  const deleteImage = async (image) => {

    try {

      const imageRef = ref(
        storage,
        image.path
      );

      await deleteObject(imageRef);

      await deleteDoc(
        doc(db, "galleryImages", image.id)
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="h-screen overflow-hidden bg-black text-white">

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-950 to-blue-950"></div>

      {/* GLOW */}
      <div className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[180px] opacity-20"></div>

      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[180px] opacity-20"></div>

      {/* MAIN */}
      <div className="relative z-10 h-screen p-6 flex flex-col">

        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between gap-4">

          <div>

            <h1 className="text-6xl font-black tracking-[0.2em]">

              ADMIN CONTROL

            </h1>

            <p className="text-zinc-400 mt-2 uppercase tracking-[0.3em] text-sm">

              Premium Control Panel

            </p>

          </div>

          <button
            onClick={() => navigate("/")}
            className="w-14 h-14 rounded-full border border-white/10 bg-white/10 hover:bg-red-600 transition flex items-center justify-center text-2xl font-black"
            title="Cerrar Admin"
          >
            ×
          </button>

        </div>

        {/* GRID */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-6">

          {/* SIDEBAR */}
          <div className="col-span-3 min-h-0 rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden flex flex-col">

            <div className="p-6 border-b border-white/10">

              <h2 className="text-3xl font-black">

                Conversaciones

              </h2>

            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

              {chatList.length === 0 && (

                <div className="text-zinc-500 text-center mt-10">

                  No hay conversaciones

                </div>

              )}

              {chatList.map((chat) => (

                <div
                  key={chat.chatId}
                  onClick={() =>
                    setSelectedChat(chat.chatId)
                  }
                  className={`relative rounded-3xl p-5 border cursor-pointer transition ${
                    selectedChat === chat.chatId
                      ? "bg-gradient-to-r from-blue-700 to-cyan-500 border-cyan-300"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >

                  <div className="font-black">

                    Cliente

                  </div>

                  <div className="text-sm opacity-70 truncate mt-2">

                    {chat.lastMessage}

                  </div>

                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      deleteConversation(
                        chat.chatId
                      );

                    }}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-full"
                  >

                    X

                  </button>

                </div>

              ))}

            </div>

          </div>

          {/* CHAT */}
          <div className="col-span-6 min-h-0 rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden flex flex-col">

            {/* TOP */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">

              <div>

                <h2 className="text-4xl font-black">

                  Live Chat

                </h2>

                <p className="text-zinc-400 mt-1">

                  Tiempo real

                </p>

              </div>

              <div className="w-4 h-4 rounded-full bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)]"></div>

            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">

              {messages.length === 0 && (

                <div className="text-zinc-500 text-center mt-20">

                  No hay mensajes

                </div>

              )}

              {messages.map((msg) => (

                <div
                  key={msg.id}
                  className={`max-w-[75%] p-5 rounded-[30px] border ${
                    msg.sender === "admin"
                      ? "self-end bg-gradient-to-r from-blue-700 to-cyan-500 border-cyan-300"
                      : "self-start bg-white/10 border-white/10"
                  }`}
                >

                  <div className="text-xs uppercase opacity-70 mb-2">

                    {msg.sender === "admin"
                      ? "Administrador"
                      : "Cliente"}

                  </div>

                  <div className="text-lg">

                    {msg.text}

                  </div>

                </div>

              ))}

              <div ref={messagesEndRef}></div>

            </div>

            {/* INPUT */}
            <div className="p-6 border-t border-white/10">

              <div className="flex gap-4">

                <input
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  placeholder="Responder..."
                  className="flex-1 rounded-3xl bg-white/10 border border-white/10 px-6 py-5 outline-none"
                />

                <button
                  onClick={sendMessage}
                  className="px-10 rounded-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500"
                >

                  Enviar

                </button>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="col-span-3 min-h-0 flex flex-col gap-6">

            {/* REQUESTS */}
            <div className="flex-1 min-h-0 rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden flex flex-col">

              <div className="p-6 border-b border-white/10">

                <h2 className="text-3xl font-black">

                  Solicitudes

                </h2>

              </div>

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

                {requests.map((req) => (

                  <div
                    key={req.id}
                    className="relative rounded-3xl border border-white/10 bg-white/5 p-5"
                  >

                    <button
                      onClick={() =>
                        deleteRequest(req.id)
                      }
                      className="absolute top-3 right-3 bg-red-600 text-xs px-3 py-1 rounded-full"
                    >

                      X

                    </button>

                    <div className="font-black text-xl">

                      {req.name}

                    </div>

                    <div className="text-sm text-zinc-400 mt-2">

                      {req.email}

                    </div>

                    <div className="mt-4 text-sm">

                      {req.message}

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* GALLERY */}
            <div className="h-[420px] min-h-0 rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden flex flex-col">

              <div className="p-6 border-b border-white/10">

                <h2 className="text-3xl font-black">

                  Contenido

                </h2>

                <p className="text-zinc-400 mt-2 text-sm">

                  Galería dinámica

                </p>

              </div>

              <div className="flex-1 overflow-y-auto p-6">

                {/* UPLOAD */}
                <label className="block cursor-pointer rounded-3xl border border-dashed border-cyan-400 p-6 text-center text-cyan-300 hover:bg-cyan-500/10 transition">

                  Seleccionar Fotos

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />

                </label>

                {/* IMAGES */}
                <div className="mt-6 flex flex-col gap-4">

                  {galleryImages.map((image) => (

                    <div
                      key={image.id}
                      className="relative rounded-3xl overflow-hidden border border-white/10"
                    >

                      <img
                        src={image.imageUrl}
                        alt=""
                        className="w-full h-[140px] object-cover"
                      />

                      <button
                        onClick={() =>
                          deleteImage(image)
                        }
                        className="absolute top-3 right-3 bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-full"
                      >

                        X

                      </button>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}