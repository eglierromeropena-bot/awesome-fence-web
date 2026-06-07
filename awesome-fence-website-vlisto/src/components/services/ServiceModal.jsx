
export default function ServiceModal({ service, onClose }) {

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">

      <div className="bg-zinc-900 rounded-3xl overflow-hidden max-w-4xl w-full relative shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white text-3xl z-10"
        >
          ×
        </button>

        <img
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-96 object-cover"
        />

        <div className="p-10 text-white">

          <h2 className="text-5xl font-bold mb-6">
            {service.title}
          </h2>

          <p className="text-zinc-300 leading-8 text-lg mb-8">
            {service.fullDescription}
          </p>

          <button
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold"
          >
            Get Quote
          </button>

        </div>

      </div>

    </div>
  );
}
