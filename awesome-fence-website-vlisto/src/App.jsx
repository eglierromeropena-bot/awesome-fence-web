import { useState, useEffect } from "react";

import ChatBox from "./components/ChatBox";

import { db } from "./firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function App() {

  const [language, setLanguage] = useState("EN");

  const [currentSlide, setCurrentSlide] = useState(0);

  const [galleryImages, setGalleryImages] = useState([]);

  // CONTACT FORM
  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [projectMessage, setProjectMessage] = useState("");

  // STATIC SERVICES IMAGES
  const slides = [
    "/fence1.jpg",
    "/fence2.jpg",
    "/fence3.jpg",
  ];

  // FIREBASE GALLERY
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

  // HERO SLIDER
  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentSlide((prev) =>
        (prev + 1) % slides.length
      );

    }, 5000);

    return () => clearInterval(timer);

  }, []);

  // LANGUAGES
  const translations = {

    EN: {
      hero: "Professional Fence Installation",
      sub: "Premium residential and commercial fencing with modern finishes and professional craftsmanship.",
      estimate: "Free Estimate",
      projects: "View Projects",

      home: "Home",
      services: "Services",
      gallery: "Gallery",
      contact: "Contact",

      insured: "Fully Insured • Free Estimates",

      servicesTitle: "Premium Fence Services",

      chain: "Chain Link Fence",
      commercial: "Commercial Fence",
      wire: "Wire Fence Installation",

      realProjects:
        "Real projects completed by Awesome Fence Of Louisville LLC.",

      learnMore: "Learn More",

      galleryTitle: "Real Fence Projects",

      contactTitle: "Contact Us Today",

      contactSub:
        "Contact our team today for premium fence installation services.",

      fullName: "Full Name",

      email: "Email Address",

      project:
        "Tell us about your project",

      submit: "Submit Request",

      footer:
        "© 2026 Awesome Fence Of Louisville LLC",
    },

    ES: {
      hero: "Instalación Profesional De Cercas",
      sub: "Cercas residenciales y comerciales con acabados modernos y calidad profesional.",
      estimate: "Cotización Gratis",
      projects: "Ver Proyectos",

      home: "Inicio",
      services: "Servicios",
      gallery: "Galería",
      contact: "Contacto",

      insured: "Totalmente Asegurados • Presupuesto Gratis",

      servicesTitle: "Servicios Premium De Cercas",

      chain: "Cerca De Malla",
      commercial: "Cerca Comercial",
      wire: "Instalación De Cercas",

      realProjects:
        "Proyectos reales completados por Awesome Fence Of Louisville LLC.",

      learnMore: "Más Información",

      galleryTitle: "Proyectos Reales",

      contactTitle: "Contáctanos Hoy",

      contactSub:
        "Contacte hoy mismo con nuestro equipo para obtener servicios de instalación de cercas de primera calidad.",

      fullName: "Nombre Completo",

      email: "Correo Electrónico",

      project:
        "Cuéntanos sobre tu proyecto",

      submit: "Enviar Solicitud",

      footer:
        "© 2026 Awesome Fence Of Louisville LLC",
    },

    FR: {
      hero: "Installation Professionnelle De Clôtures",
      sub: "Clôtures résidentielles et commerciales modernes.",
      estimate: "Devis Gratuit",
      projects: "Voir Projets",

      home: "Accueil",
      services: "Services",
      gallery: "Galerie",
      contact: "Contact",

      insured: "Entièrement Assuré • Devis Gratuit",

      servicesTitle: "Services Premium De Clôtures",

      chain: "Clôture Grillagée",
      commercial: "Clôture Commerciale",
      wire: "Installation De Clôtures",

      realProjects:
        "Projets réels réalisés par Awesome Fence Of Louisville LLC.",

      learnMore: "Voir Plus",

      galleryTitle: "Projets Réels",

      contactTitle: "Contactez-Nous",

      contactSub:
        "Contactez notre équipe dès aujourd'hui pour des services premium d'installation de clôtures.",

      fullName: "Nom Complet",

      email: "Adresse E-mail",

      project:
        "Parlez-nous de votre projet",

      submit: "Envoyer La Demande",

      footer:
        "© 2026 Awesome Fence Of Louisville LLC",
    },

  };

  const t = translations[language];

  // CONTACT FORM -> FIREBASE
  const sendContactForm = async (e) => {

    e.preventDefault();

    try {

      await addDoc(collection(db, "contactRequests"), {

        name: fullName,

        email: email,

        phone: "Not Provided",

        message: projectMessage,

        createdAt: Date.now(),

      });

      alert("Request sent successfully!");

      setFullName("");

      setEmail("");

      setProjectMessage("");

    } catch (error) {

      console.error(error);

      alert("Error sending request");

    }

  };

  return (

    <div className="bg-[#f4f4f4] overflow-x-hidden font-sans text-gray-900">

      <ChatBox />

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-4">

            <div className="bg-white p-2 rounded-2xl shadow-xl">

              <img
                src="/logo.png"
                alt="Logo"
                className="w-14 h-14 object-contain"
              />

            </div>

            <div>

              <h1 className="text-lg md:text-xl font-black text-blue-950 leading-tight">
                AWESOME FENCE OF LOUISVILLE LLC
              </h1>

              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500">
                Chain Link • Wood • Aluminum • Vinyl
              </p>

            </div>

          </div>

          {/* MENU */}
          <nav className="hidden lg:flex items-center gap-10 font-semibold text-gray-700">

            <a href="#home" className="hover:text-blue-900">
              {t.home}
            </a>

            <a href="#services" className="hover:text-blue-900">
              {t.services}
            </a>

            <a href="#gallery" className="hover:text-blue-900">
              {t.gallery}
            </a>

            <a href="#contact" className="hover:text-blue-900">
              {t.contact}
            </a>

          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* LANGUAGES */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full border border-gray-200">

              {["EN", "ES", "FR"].map((lang) => (

                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-full text-sm font-bold transition ${
                    language === lang
                      ? "bg-blue-900 text-white"
                      : "hover:bg-white"
                  }`}
                >
                  {lang}
                </button>

              ))}

            </div>

            {/* FREE ESTIMATE */}
            <a
              href="#contact"
              className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-7 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition"
            >

              {t.estimate}

            </a>

          </div>

        </div>

      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative h-screen overflow-hidden flex items-center"
      >

        {/* SLIDER */}
        <div className="absolute inset-0">

          {slides.map((slide, index) => (

            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${slide})`,
              }}
            />

          ))}

        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 inline-flex items-center gap-3 px-5 py-3 rounded-full mb-8 shadow-2xl">

            <div className="w-3 h-3 bg-green-400 rounded-full"></div>

            <span className="font-semibold">
              {t.insured}
            </span>

          </div>

          <h2 className="text-6xl md:text-8xl font-black leading-[0.9] max-w-5xl drop-shadow-2xl">

            {t.hero}

          </h2>

          <p className="mt-8 text-xl text-gray-200 max-w-2xl leading-relaxed">

            {t.sub}

          </p>

          <div className="flex flex-wrap gap-5 mt-10">

            <a
              href="#contact"
              className="bg-gradient-to-r from-blue-900 to-blue-700 px-9 py-5 rounded-full text-lg font-bold shadow-2xl hover:scale-105 transition"
            >

              {t.estimate}

            </a>

            <button className="bg-white/10 backdrop-blur-xl border border-white/20 px-9 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-black transition">

              {t.projects}

            </button>

          </div>

        </div>

      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="py-28 bg-[#f4f4f4]"
      >

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-20">

            <h3 className="text-5xl font-black text-blue-950">
              {t.servicesTitle}
            </h3>

          </div>

          <div className="grid lg:grid-cols-3 gap-10">

            {[
              {
                title: t.chain,
                image: slides[0],
              },

              {
                title: t.commercial,
                image: slides[1],
              },

              {
                title: t.wire,
                image: slides[2],
              },

            ].map((service, index) => (

              <div
                key={index}
                className="bg-white rounded-[35px] overflow-hidden shadow-2xl hover:-translate-y-3 hover:rotate-1 transition-all duration-500"
              >

                <div className="overflow-hidden">

                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[420px] object-cover hover:scale-110 transition duration-700"
                  />

                </div>

                <div className="p-8">

                  <h4 className="text-3xl font-black text-blue-900 mb-4">

                    {service.title}

                  </h4>

                  <p className="text-gray-600 text-lg leading-relaxed mb-6">

                    {t.realProjects}

                  </p>

                  <button className="bg-blue-900 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition">

                    {t.learnMore}

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="py-28 bg-white"
      >

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-20">

            <h3 className="text-5xl font-black text-blue-950">
              {t.galleryTitle}
            </h3>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {galleryImages.length > 0 ? (

              galleryImages.map((image) => (

                <div
                  key={image.id}
                  className="rounded-[35px] overflow-hidden shadow-2xl group bg-white hover:-translate-y-2 transition"
                >

                  <div className="overflow-hidden">

                    <img
                      src={image.imageUrl}
                      alt="Fence"
                      className="w-full h-[420px] object-cover group-hover:scale-110 transition duration-700"
                    />

                  </div>

                </div>

              ))

            ) : (

              [...slides, ...slides].map((image, index) => (

                <div
                  key={index}
                  className="rounded-[35px] overflow-hidden shadow-2xl group bg-white hover:-translate-y-2 transition"
                >

                  <div className="overflow-hidden">

                    <img
                      src={image}
                      alt="Fence"
                      className="w-full h-[420px] object-cover group-hover:scale-110 transition duration-700"
                    />

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-28 bg-blue-950 text-white"
      >

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <h3 className="text-5xl font-black mb-8">
              {t.contactTitle}
            </h3>

            <p className="text-xl text-gray-300 leading-relaxed mb-10">
              {t.contactSub}
            </p>

            <div className="space-y-5 text-xl">

              <p>📞 (502) 836-8275</p>

              <p>📧 RosarioYanez2345@gmail.com</p>

              <p>📍 Louisville, Kentucky</p>

            </div>

          </div>

          {/* FORM */}
          <div className="bg-white rounded-[35px] p-10 text-black shadow-2xl">

            <form
              onSubmit={sendContactForm}
              className="space-y-6"
            >

              <input
                type="text"
                placeholder={t.fullName}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl p-5 text-lg"
              />

              <input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl p-5 text-lg"
              />

              <textarea
                rows="5"
                placeholder={t.project}
                value={projectMessage}
                onChange={(e) => setProjectMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl p-5 text-lg"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-5 rounded-2xl text-xl font-black hover:scale-[1.02] transition shadow-xl"
              >

                {t.submit}

              </button>

            </form>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-black text-gray-400 py-12 text-center border-t border-gray-800">

        <p className="text-lg tracking-wide">
          {t.footer}
        </p>

      </footer>

    </div>

  );

}
