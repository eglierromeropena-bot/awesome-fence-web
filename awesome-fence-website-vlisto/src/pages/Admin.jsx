import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import {
  collection, addDoc, onSnapshot, query, orderBy,
  where, deleteDoc, doc, getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function Admin() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const groupedChats = [
        ...new Map(
          allMessages
            .filter((msg) => msg.chatId)
            .map((msg) => [String(msg.chatId), { chatId: String(msg.chatId), lastMessage: msg.text }])
        ).values(),
      ];
      setChatList(groupedChats);
      if (!selectedChat && groupedChats.length > 0) setSelectedChat(groupedChats[0].chatId);
      const activeChat = selectedChat || groupedChats[0]?.chatId;
      setMessages(allMessages.filter((msg) => String(msg.chatId) === String(activeChat)));
    });
    return () => unsubscribe();
  }, [selectedChat]);

  useEffect(() => {
    const q = query(collection(db, "contactRequests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGalleryImages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || !selectedChat) return;
    await addDoc(collection(db, "messages"), {
      text: trimmed, sender: "admin", chatId: String(selectedChat).trim(), createdAt: Date.now(),
    });
    setMessage("");
  };

  const deleteConversation = async (chatId) => {
    const q = query(collection(db, "messages"), where("chatId", "==", String(chatId)));
    const snapshot = await getDocs(q);
    for (const d of snapshot.docs) await deleteDoc(doc(db, "messages", d.id));
    setSelectedChat(null);
    setMessages([]);
  };

  const deleteRequest = async (id) => {
    await deleteDoc(doc(db, "contactRequests", id));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imageRef = ref(storage, `gallery/${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      await addDoc(collection(db, "galleryImages"), {
        imageUrl: downloadURL, path: imageRef.fullPath, createdAt: Date.now(),
      });
    } catch (err) { console.log(err); }
  };

  const deleteImage = async (image) => {
    try {
      await deleteObject(ref(storage, image.path));
      await deleteDoc(doc(db, "galleryImages", image.id));
    } catch (err) { console.log(err); }
  };

  const handleCloseAdmin = async () => {
    try { await signOut(auth); navigate("/"); } catch { alert("No se pudo cerrar la sesion."); }
  };

  return (
    <div className="min-h-screen lg:h-screen overflow-x-hidden lg:overflow-hidden bg-black text-white">

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-950 to-blue-950"></div>

      {/* GLOW */}
      <div className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[180px] opacity-20"></div>
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[180px] opacity-20"></div>

      {/* MAIN */}
      <div className="relative z-10 min-h-screen lg:h-screen p-4 md:p-6 flex flex-col">

        {/* HEADER */}
        <div className="mb-4 md:mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.1em] md:tracking-[0.2em]">ADMIN CONTROL</h1>
            <p className="text-zinc-400 mt-1 uppercase tracking-[0.3em] text-xs md:text-sm">Premium Control Panel</p>
          </div>
          <button
            onClick={handleCloseAdmin}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/10 hover:bg-red-600 transition flex items-center justify-center text-xl font-black shrink-0"
            title="Cerrar Admin"
          >
            ×
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:flex-1 lg:min-h-0">

          {/* SIDEBAR */}
          <div className="lg:col-span-3 h-[38vh] sm:h-[42vh] lg:h-auto lg:min-h-0 rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden flex flex-col">
            <div className="p-4 md:p-6 border-b border-white/10">
              <h2 className="text-xl md:text-3xl font-black">Conversaciones</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 md:p-4 flex flex-col gap-3 md:gap-4">
              {chatList.length === 0 && (
                <div className="text-zinc-500 text-center mt-10">No hay conversaciones</div>
              )}
              {chatList.map((chat) => (
                <div
                  key={chat.chatId}
                  onClick={() => setSelectedChat(chat.chatId)}
                  className={`relative rounded-3xl p-4 md:p-5 border cursor-pointer transition ${
                    selectedChat === chat.chatId
                      ? "bg-gradient-to-r from-blue-700 to-cyan-500 border-cyan-300"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="font-black text-sm md:text-base">Cliente</div>
                  <div className="text-xs md:text-sm opacity-70 truncate mt-1 md:mt-2">{chat.lastMessage}</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(chat.chatId); }}
                    className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-600 hover:bg-red-500 text-white text-xs px-2 md:px-3 py-1 rounded-full"
                  >X</button>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT */}
          <div className="lg:col-span-6 h-[56vh] sm:h-[60vh] lg:h-auto lg:min-h-0 rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden flex flex-col">
            <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-4xl font-black">Live Chat</h2>
                <p className="text-zinc-400 mt-0.5 text-sm">Tiempo real</p>
              </div>
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)]"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 md:gap-6">
              {messages.length === 0 && (
                <div className="text-zinc-500 text-center mt-20">No hay mensajes</div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] md:max-w-[75%] p-4 md:p-5 rounded-[30px] border ${
                    msg.sender === "admin"
                      ? "self-end bg-gradient-to-r from-blue-700 to-cyan-500 border-cyan-300"
                      : "self-start bg-white/10 border-white/10"
                  }`}
                >
                  <div className="text-xs uppercase opacity-70 mb-1 md:mb-2">
                    {msg.sender === "admin" ? "Administrador" : "Cliente"}
                  </div>
                  <div className="text-sm md:text-lg">{msg.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
            <div className="p-4 md:p-6 border-t border-white/10">
              <div className="flex gap-3 md:gap-4">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Responder..."
                  className="flex-1 rounded-3xl bg-white/10 border border-white/10 px-4 md:px-6 py-3 md:py-5 outline-none text-sm md:text-base"
                />
                <button
                  onClick={sendMessage}
                  className="px-6 md:px-10 rounded-3xl font-black bg-gradient-to-r from-blue-700 to-cyan-500 text-sm md:text-base"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-3 min-h-0 flex flex-col gap-4 md:gap-6">

            {/* REQUESTS */}
            <div className="h-[38vh] sm:h-[42vh] lg:h-auto lg:flex-1 lg:min-h-0 rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden flex flex-col">
              <div className="p-4 md:p-6 border-b border-white/10">
                <h2 className="text-xl md:text-3xl font-black">Solicitudes</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-3 md:p-5 flex flex-col gap-3 md:gap-5">
                {requests.map((req) => (
                  <div key={req.id} className="relative rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
                    <button
                      onClick={() => deleteRequest(req.id)}
                      className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-600 text-xs px-2 md:px-3 py-1 rounded-full"
                    >X</button>
                    <div className="font-black text-base md:text-xl">{req.name}</div>
                    <div className="text-xs md:text-sm text-zinc-400 mt-1 md:mt-2">{req.email}</div>
                    <div className="mt-2 md:mt-4 text-xs md:text-sm">{req.message}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* GALLERY */}
            <div className="h-[42vh] sm:h-[46vh] lg:h-[420px] min-h-0 rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden flex flex-col">
              <div className="p-4 md:p-6 border-b border-white/10">
                <h2 className="text-xl md:text-3xl font-black">Contenido</h2>
                <p className="text-zinc-400 mt-1 text-xs md:text-sm">Galeria dinamica</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <label className="block cursor-pointer rounded-3xl border border-dashed border-cyan-400 p-4 md:p-6 text-center text-cyan-300 hover:bg-cyan-500/10 transition text-sm md:text-base">
                  Seleccionar Fotos
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <div className="mt-4 md:mt-6 flex flex-col gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative rounded-3xl overflow-hidden border border-white/10">
                      <img src={image.imageUrl} alt="" className="w-full h-[100px] md:h-[140px] object-cover" />
                      <button
                        onClick={() => deleteImage(image)}
                        className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-600 hover:bg-red-500 text-white text-xs px-2 md:px-3 py-1 rounded-full"
                      >X</button>
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
