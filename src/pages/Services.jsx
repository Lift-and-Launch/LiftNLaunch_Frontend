import React from "react";
import { CheckCircle } from "lucide-react";
import Clients from "../components/Clients";
import FAQSection from "../components/FAQSection";

const services = [
  {
    title: "Branding",
    image: "/service/image.png",
    description:
      "Don’t let your boring designs push your competitor ahead.\nWe provide amazing designs for your brand so that your audience’s jaw drops every time!\n\nMany desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years.",
    features: [
      "Logo Design",
      "Business Cards & Stationery",
      "Flyer & Brochure Design",
      "Social Media Design",
      "Signage Design",
      "Packaging & Label Design"
    ]
  },
  {
    title: "Website Solution",
    image: "/service/image.png",
    description:
      "Don’t let your boring designs push your competitor ahead.\nWe provide amazing designs for your brand so that your audience’s jaw drops every time!\n\nMany desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years.",
    features: [
      "Logo Design",
      "Business Cards & Stationery",
      "Flyer & Brochure Design",
      "Social Media Design",
      "Signage Design",
      "Packaging & Label Design"
    ]
  },
  {
    title: "Web Development",
    image: "/service/image.png",
    description:
      "Don’t let your boring designs push your competitor ahead.\nWe provide amazing designs for your brand so that your audience’s jaw drops every time!\n\nMany desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years.",
    features: [
      "Logo Design",
      "Business Cards & Stationery",
      "Flyer & Brochure Design",
      "Social Media Design",
      "Signage Design",
      "Packaging & Label Design"
    ]
  }
];

export default function Services() {
  return (
    <div className="bg-white text-black">
      <section className="max-w-screen-xl mx-auto px-4 pt-5 md:pt-20">
        <h2 className="text-3xl font-bold mb-12 text-[#001d59] underline decoration-yellow-400">IT SERVICES</h2>

        {services.map((service, i) => (
          <div key={i} className="grid md:grid-cols-2 gap-10 items-center mb-24">
            {i % 2 === 0 ? (
              <>
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded-lg w-full md:w-4/5 h-auto object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                  <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">{service.description}</p>
                  <div className="grid grid-cols-2 gap-x-4 text-sm text-black mb-6">
                    {service.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-yellow-500 mt-[2px]" /> {f}
                      </div>
                    ))}
                  </div>
                  <button className="bg-yellow-400 text-black text-sm px-6 py-2 rounded hover:bg-yellow-500 transition">
                    CONTACT US
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                  <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">{service.description}</p>
                  <div className="grid grid-cols-2 gap-x-4 text-sm text-black mb-6">
                    {service.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-yellow-500 mt-[2px]" /> {f}
                      </div>
                    ))}
                  </div>
                  <button className="bg-yellow-400 text-black text-sm px-6 py-2 rounded hover:bg-yellow-500 transition">
                    CONTACT US
                  </button>
                </div>
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded-lg w-full md:w-4/5 h-auto object-cover"
                />
              </>
            )}
          </div>
        ))}
      </section>

      {/* Highlight Section */}
      <section className="relative w-full bg-white mb-[160px]">
        {/* Background Image */}
        <div className="relative w-full h-96 md:h-[500px]">
          <img
            src="/service/banner.webp"
            alt="Award support background"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Floating Text Block */}
        <div className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 z-10 w-[90%] md:w-auto">
          <div className="rounded-2xl md:px-20 px-5 py-7 md:py-12 text-center bg-[radial-gradient(ellipse_at_50%_50%,#ffffff,#FFD700_90%)] shadow-lg">
            <h1 className="md:text-2xl text-xl font-semibold text-gray-900">
              Get the award-winning support you deserve
            </h1>
            <p className="text-gray-700 mt-4 md:text-base text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, esse! Maiores voluptas harum, corporis recusandae magni explicabo excepturi delectus similique dolore non quo, cumque eum doloribus suscipit, nemo autem dicta.
            </p>
            <button className="bg-black text-white px-12 py-2 rounded-full hover:bg-black/90 transition-all duration-300 text-center mt-6">
              CONTACT US
            </button>
          </div>
        </div>
      </section>
      {/* Trusted Partners */}
      <section className="md:py-14 pb-8 mb-10 max-w-7xl mx-auto md:px-8 px-4">
        <h1 className="md:text-5xl text-3xl text-gray-900 font-semibold text-center relative">
          Our Trusted Partners
          <div className="absolute md:bottom-1 bottom-1 md:right-[30%] right-[55%] md:w-64 w-24 h-2 bg-yellow-400/75 -rotate-2 -z-10"></div>
        </h1>

        <div className="flex items-center md:gap-16 mt-14 md:justify-center gap-10 flex-wrap justify-center">
          <img alt="logo1" src="/service/ey.png" className="md:h-14 md:w-auto w-36 object-contain" />
          <img alt="logo2" src="/service/utkarsh.png" className="md:h-14 md:w-auto w-36 object-contain" />
          <img alt="logo3" src="/service/reliance.png" className="md:h-14 md:w-auto w-36 object-contain" />
          <img alt="logo4" src="/service/flipkart.png" className="md:h-14 md:w-auto w-36 object-contain" />
        </div>
      </section>

      <Clients />
      <FAQSection />
    </div>
  );
}
