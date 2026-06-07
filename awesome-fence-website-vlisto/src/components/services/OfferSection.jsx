
import { useState } from "react";
import ServiceModal from "./ServiceModal";

const demoServices = [
  {
    id: 1,
    title: "Fence Installation",
    shortDescription: "Premium residential and commercial fence installation.",
    fullDescription: "Professional fence installation with durable materials and premium finishes. Perfect for residential and commercial projects.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Custom Gates",
    shortDescription: "Modern and secure custom gate systems.",
    fullDescription: "Custom automatic and manual gates designed for security, elegance, and long-term durability.",
    imageUrl: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Wood Fencing",
    shortDescription: "Elegant wood fencing with premium craftsmanship.",
    fullDescription: "Beautiful wood fence solutions with custom designs and high-quality materials.",
    imageUrl: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function OfferSection() {

  const [selectedService, setSelectedService] = useState(null);

  return (
    <section className="py-24 bg-black text-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-zinc-400 mb-4">
            OFFERS
          </p>

          <h2 className="text-5xl font-bold">
            Premium Fence Services
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {demoServices.map((service) => (
            <div
              key={service.id}
              className="group bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-2 transition duration-300"
            >

              <div className="overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-72 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-8">

                <h3 className="text-3xl font-bold mb-4">
                  {service.title}
                </h3>

                <p className="text-zinc-400 leading-7 mb-8">
                  {service.shortDescription}
                </p>

                <button
                  onClick={() => setSelectedService(service)}
                  className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
                >
                  Learn More
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />

    </section>
  );
}
