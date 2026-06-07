import { useState } from "react";

export default function AdminServices() {

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  async function handleCreateService(e) {

    e.preventDefault();

    alert("Connect Firestore CRUD here.");
  }

  return (
    <div className="p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Services CMS
      </h1>

      <form
        onSubmit={handleCreateService}
        className="space-y-4 max-w-2xl"
      >

        <input
          type="text"
          placeholder="Service title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-800"
        />

        <textarea
          placeholder="Short description"
          value={shortDescription}
          onChange={(e)=>setShortDescription(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-800"
        />

        <textarea
          placeholder="Full description"
          value={fullDescription}
          onChange={(e)=>setFullDescription(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-800 h-48"
        />

        <button
          type="submit"
          className="bg-white text-black px-6 py-3 rounded-xl font-bold"
        >
          Save Service
        </button>

      </form>

    </div>
  );
}
