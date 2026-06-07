export default function ServiceCard({ service, onOpen }) {

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-xl">

      <img
        src={service.imageUrl}
        alt={service.title}
        className="w-full h-64 object-cover"
      />

      <div className="p-6">

        <h3 className="text-2xl font-bold mb-3">
          {service.title}
        </h3>

        <p className="text-zinc-300 mb-5">
          {service.shortDescription}
        </p>

        <button
          onClick={() => onOpen(service)}
          className="bg-white text-black px-5 py-2 rounded-xl font-semibold"
        >
          Learn More
        </button>

      </div>
    </div>
  );
}
