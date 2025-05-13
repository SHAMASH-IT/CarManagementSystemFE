import Link from "next/link"
import {
  Car,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="fade-in">
            <div className="flex items-center gap-2 font-bold text-xl mb-6">
              <div className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white p-2 rounded-lg">
                <Car className="h-6 w-6" />
              </div>
              <span>AutoService</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Votre partenaire de confiance pour tous vos besoins automobiles. Nous offrons des services de qualité
              pour maintenir votre véhicule en parfait état.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#3b82f6] hover:text-white transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#3b82f6] hover:text-white transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#3b82f6] hover:text-white transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#3b82f6] hover:text-white transition-all duration-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="fade-in-delay">
            <h3 className="text-lg font-bold mb-6 text-white">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[#3b82f6]">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>123 Rue de l'Automobile, Tunis</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[#3b82f6]">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+216 71 234 567</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[#3b82f6]">
                  <Mail className="h-4 w-4" />
                </div>
                <span>contact@autoservice.tn</span>
              </div>
            </div>
          </div>

          <div className="fade-in-delay-2">
            <h3 className="text-lg font-bold mb-6 text-white">Horaires d'ouverture</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Lundi - Vendredi:</span>
                <span className="text-[#3b82f6]">8h00 - 19h00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Samedi:</span>
                <span className="text-[#3b82f6]">9h00 - 17h00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Dimanche:</span>
                <span className="text-gray-400">Fermé</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} AutoService. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
} 