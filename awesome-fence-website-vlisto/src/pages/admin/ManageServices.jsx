
export default function ManageServices() {

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        Manage Services
      </h1>

      <div className="grid gap-8">

        {[1,2,3].map((item) => (
          <div
            key={item}
            className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800"
          >

            <h2 className="text-2xl font-bold mb-6">
              Service {item}
            </h2>

            <div className="grid gap-4">

              <input
                placeholder="Service Title"
                className="bg-zinc-800 p-4 rounded-xl"
              />

              <textarea
                placeholder="Short Description"
                className="bg-zinc-800 p-4 rounded-xl"
              />

              <textarea
                placeholder="Learn More Description"
                className="bg-zinc-800 p-4 rounded-xl h-40"
              />

              <input
                type="file"
                className="bg-zinc-800 p-4 rounded-xl"
              />

              <button
                className="bg-white text-black px-6 py-3 rounded-xl font-bold w-fit"
              >
                Save Changes
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
