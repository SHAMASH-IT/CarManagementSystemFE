"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Wrench,
  Car,
  SprayCan,
  Clock,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Star,
  ArrowRight,
  Sparkles,
  Shield,
  CheckCircle,
  Calendar,
  Settings,
  Zap,
  Award,
  PenToolIcon as Tool,
  Gauge,
  FileText,
  Bell,
  Smartphone,
  HelpCircle,
  ChevronDown,
  ChartBar,
  Users,
  Play,
  ArrowDownToLine,
  Info,
} from "lucide-react"
import Footer from "./common/Footer"

export default function Home() {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Refs for scroll sections
  const servicesRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const testimonialsRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  // Refs for animation sections
  const statsRef = useRef<HTMLElement>(null)
  const serviceCardsRef = useRef<HTMLDivElement>(null)
  const featureCardsRef = useRef<HTMLDivElement>(null)
  const testimonialCardsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Animation visibility state
  const [animatedElements, setAnimatedElements] = useState<{ [key: string]: boolean }>({
    stats: false,
    services: false,
    features: false,
    testimonials: false,
    cta: false,
  })

  // Active section tracking
  const [activeSection, setActiveSection] = useState("")

  // Service detail modal
  const [selectedService, setSelectedService] = useState<number | null>(null)

  // État pour gérer les cartes actives
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  // Smooth scroll function
  const scrollToSection = (elementRef: React.RefObject<HTMLElement>) => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 80, // Adjust for header height
        behavior: "smooth",
      })
    }
    setMobileMenuOpen(false)
  }

  // Check if element is in viewport
  const isInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 && rect.bottom >= 0
  }

  // Update active section on scroll and handle animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      // Update active section
      if (
        servicesRef.current &&
        scrollPosition >= servicesRef.current.offsetTop - 100 &&
        scrollPosition < (featuresRef.current?.offsetTop || Number.POSITIVE_INFINITY) - 100
      ) {
        setActiveSection("services")
      } else if (
        featuresRef.current &&
        scrollPosition >= featuresRef.current.offsetTop - 100 &&
        scrollPosition < (testimonialsRef.current?.offsetTop || Number.POSITIVE_INFINITY) - 100
      ) {
        setActiveSection("features")
      } else if (
        testimonialsRef.current &&
        scrollPosition >= testimonialsRef.current.offsetTop - 100 &&
        scrollPosition < (contactRef.current?.offsetTop || Number.POSITIVE_INFINITY) - 100
      ) {
        setActiveSection("testimonials")
      } else if (contactRef.current && scrollPosition >= contactRef.current.offsetTop - 100) {
        setActiveSection("contact")
      } else {
        setActiveSection("")
      }

      // Check for animations
      if (statsRef.current && !animatedElements.stats && isInViewport(statsRef.current)) {
        setAnimatedElements((prev) => ({ ...prev, stats: true }))
      }

      if (serviceCardsRef.current && !animatedElements.services && isInViewport(serviceCardsRef.current)) {
        setAnimatedElements((prev) => ({ ...prev, services: true }))
      }

      if (featureCardsRef.current && !animatedElements.features && isInViewport(featureCardsRef.current)) {
        setAnimatedElements((prev) => ({ ...prev, features: true }))
      }

      if (testimonialCardsRef.current && !animatedElements.testimonials && isInViewport(testimonialCardsRef.current)) {
        setAnimatedElements((prev) => ({ ...prev, testimonials: true }))
      }

      if (ctaRef.current && !animatedElements.cta && isInViewport(ctaRef.current)) {
        setAnimatedElements((prev) => ({ ...prev, cta: true }))
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Trigger once on mount to check initial viewport
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [animatedElements])

  // Stats counter state and logic
  const [stats, setStats] = useState({
    vehicles: 0,
    customers: 0,
    services: 0,
    satisfaction: 0,
  })

  useEffect(() => {
    if (!animatedElements.stats) return

    const duration = 3000 // 3 seconds for the animation
    const startTime = Date.now()
    const targetStats = {
      vehicles: 5000,
      customers: 1000,
      services: 50,
      satisfaction: 98,
    }

    const animateStats = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      setStats({
        vehicles: Math.floor(progress * targetStats.vehicles),
        customers: Math.floor(progress * targetStats.customers),
        services: Math.floor(progress * targetStats.services),
        satisfaction: Math.floor(progress * targetStats.satisfaction),
      })

      if (progress < 1) {
        requestAnimationFrame(animateStats)
      }
    }

    requestAnimationFrame(animateStats)
  }, [animatedElements.stats])

  // Service details with prices and tips
  const services = [
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Réparation Mécanique",
      description: "Diagnostic et réparation de tous types de pannes mécaniques par nos experts certifiés.",
      price: "À partir de 200 DT",
      duration: "1-3 heures",
      benefits: ["Diagnostic précis", "Pièces d'origine", "Garantie 6 mois"],
      includes: ["Diagnostic électronique", "Main d'œuvre", "Pièces de rechange"],
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Entretien Régulier",
      description: "Vidange, filtres, freins et tous les services d'entretien préventif pour votre véhicule.",
      price: "À partir de 150 DT",
      duration: "1-2 heures",
      benefits: ["Prolonge la durée de vie", "Économie de carburant", "Prévention des pannes"],
      includes: ["Vidange d'huile", "Remplacement des filtres", "Vérification des niveaux"],
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
    {
      icon: <SprayCan className="h-8 w-8" />,
      title: "Service de Lavage",
      description: "Nettoyage intérieur et extérieur professionnel pour redonner l'éclat à votre véhicule.",
      price: "À partir de 80 DT",
      duration: "30-60 minutes",
      benefits: ["Protection de la carrosserie", "Élimination des allergènes", "Préservation de la valeur"],
      includes: ["Lavage extérieur", "Nettoyage intérieur", "Traitement des jantes"],
      image:
        "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1741&q=80",
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: "Diagnostic Complet",
      description: "Analyse complète de l'état de votre véhicule avec rapport détaillé et recommandations.",
      price: "À partir de 120 DT",
      duration: "1 heure",
      benefits: ["Détection précoce des problèmes", "Rapport détaillé", "Conseils personnalisés"],
      includes: ["Diagnostic électronique", "Inspection visuelle", "Test routier"],
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    },
  ]

  // Image carousel state and logic
  const workshopImages = [
    {
      src: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt: "Atelier de réparation automobile moderne",
    },
    {
      src: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
      alt: "Service automobile professionnel",
    },
   
    {
      src: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt: "Équipe de mécaniciens professionnels",
    },
    {
      src: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt: "Concession automobile",
    },
  ]

  const [currentImage, setCurrentImage] = useState(0)
  const [autoplayImages, setAutoplayImages] = useState(true)

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % workshopImages.length)
  }

  const prevImage = () => {
    setCurrentImage((currentImage - 1 + workshopImages.length) % workshopImages.length)
  }

  useEffect(() => {
    if (!autoplayImages) return

    const interval = setInterval(() => {
      nextImage()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentImage, autoplayImages])

  // Enhanced testimonials
  const testimonials = [
    {
      name: "Sophie Martin",
      role: "Propriétaire de Tesla Model 3",
      content:
        "Le service est impeccable. J'apprécie particulièrement la possibilité de suivre en temps réel l'avancement des réparations de ma voiture.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      date: "15 mars 2023",
    },
    {
      name: "Thomas Dubois",
      role: "Gérant de flotte automobile",
      content:
        "Cette plateforme a révolutionné la gestion de notre flotte. La planification des rendez-vous et le suivi des interventions sont devenus beaucoup plus simples.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4,
      date: "22 avril 2023",
    },
    {
      name: "Marie Leroy",
      role: "Cliente régulière",
      content:
        "Je suis cliente depuis plus d'un an et je suis toujours aussi satisfaite. Le service est rapide, professionnel et transparent.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
      date: "7 juin 2023",
    },
    {
      name: "Jean Dupont",
      role: "Propriétaire de garage indépendant",
      content:
        "L'application nous a permis d'optimiser notre planning et de réduire les temps d'attente. Nos clients sont ravis et notre chiffre d'affaires a augmenté.",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 5,
      date: "12 mai 2023",
    },
  ]

  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [autoplayTestimonials, setAutoplayTestimonials] = useState(true)

  const nextTestimonial = () => {
    setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplayTestimonials) return

    const interval = setInterval(() => {
      nextTestimonial()
    }, 6000)

    return () => clearInterval(interval)
  }, [currentTestimonial, autoplayTestimonials])

  // Client features
  const clientFeatures = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Prendre Rendez-vous",
      description: "Réservez facilement vos services automobiles en quelques clics selon vos disponibilités.",
      steps: [
        "Choisissez votre type de service",
        "Sélectionnez une date et heure",
        "Renseignez les détails de votre véhicule",
        "Recevez votre confirmation"
      ],
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Suivre Votre Service",
      description: "Restez informé de l'avancement de votre véhicule pendant toute la durée du service.",
      steps: [
        "Consultez l'état en temps réel",
        "Recevez des notifications par email",
        "Visualisez l'estimation du temps restant",
        "Confirmez la fin du service"
      ],
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Gérer Vos Documents",
      description: "Accédez à tous vos documents importants et à l'historique de vos services.",
      steps: [
        "Consultez vos factures",
        "Téléchargez vos devis",
        "Gardez une trace des services",
        "Accédez aux garanties"
      ],
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "Gérer Vos Véhicules",
      description: "Ajoutez et gérez tous vos véhicules dans un seul espace personnalisé.",
      steps: [
        "Ajoutez vos véhicules",
        "Suivez l'historique d'entretien",
        "Recevez des rappels personnalisés",
        "Consultez les recommandations"
      ],
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Personnaliser Votre Compte",
      description: "Configurez vos préférences pour une expérience adaptée à vos besoins.",
      steps: [
        "Gérez vos informations",
        "Définissez vos préférences",
        "Choisissez vos notifications",
        "Configurez votre mode de paiement"
      ],
    },
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: "Obtenir de l'Aide",
      description: "Accédez à l'assistance et au support client quand vous en avez besoin.",
      steps: [
        "Consultez la FAQ",
        "Contactez le support",
        "Trouvez des réponses rapides",
        "Demandez un rappel"
      ],
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 5}`}></div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl text-[#3b82f6]">
              <div className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white p-2 rounded-lg">
                <Car className="h-6 w-6" />
              </div>
              <span>AutoService</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection(servicesRef)}
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === "services" ? "text-[#3b82f6]" : "text-gray-700 hover:text-[#3b82f6]"
                }`}
              >
                Services
                {activeSection === "services" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3b82f6] rounded-full animate-fadeIn"></span>
                )}
              </button>
              <button
                onClick={() => scrollToSection(featuresRef)}
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === "features" ? "text-[#3b82f6]" : "text-gray-700 hover:text-[#3b82f6]"
                }`}
              >
                Comment ça marche
                {activeSection === "features" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3b82f6] rounded-full animate-fadeIn"></span>
                )}
              </button>
              <button
                onClick={() => scrollToSection(testimonialsRef)}
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === "testimonials" ? "text-[#3b82f6]" : "text-gray-700 hover:text-[#3b82f6]"
                }`}
              >
                Témoignages
                {activeSection === "testimonials" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3b82f6] rounded-full animate-fadeIn"></span>
                )}
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className={`text-sm font-medium transition-colors relative ${
                  activeSection === "contact" ? "text-[#3b82f6]" : "text-gray-700 hover:text-[#3b82f6]"
                }`}
              >
                Contact
                {activeSection === "contact" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3b82f6] rounded-full animate-fadeIn"></span>
                )}
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-[#3b82f6] transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                S'inscrire
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-fadeIn">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection(servicesRef)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection(featuresRef)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Comment ça marche
                </button>
                <button
                  onClick={() => scrollToSection(testimonialsRef)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Témoignages
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Contact
                </button>
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                  <Link href="/login" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-white bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-lg"
                  >
                    S'inscrire
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#3b82f6] pt-40 pb-44 md:pt-56 md:pb-56">
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-glow"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="max-w-xl slide-in-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6 animate-pulse">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Solution Innovante</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight hero-text">
                Gestion des Services <span className="text-[#bfdbfe]">Automobiles</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed fade-in-delay">
                Une solution centralisée et automatisée pour les ateliers de réparation, stations de lavage et
                concessions automobiles.
              </p>
              <div className="flex flex-wrap gap-4 fade-in-delay-2">
                <Link
                  href="/login"
                  className="group px-8 py-4 bg-white text-[#3b82f6] rounded-full font-medium hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center"
                >
                  Prendre Rendez-vous
                  <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </Link>
                <button
                  onClick={() => scrollToSection(servicesRef)}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Découvrir nos services
                </button>
              </div>
            </div>
            <div className="hidden md:block relative slide-in-right">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="service-animation relative">
                  <div className="service-circle">
                    <svg viewBox="0 0 400 400" width="380" height="380" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="8" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Main circle */}
                      <circle cx="200" cy="200" r="180" fill="white" opacity="0.1" />
                      <circle
                        cx="200"
                        cy="200"
                        r="170"
                        stroke="url(#circleGradient)"
                        strokeWidth="2"
                        fill="white"
                        fillOpacity="0.05"
                      />

                      {/* Service icons circles */}
                      <g className="service-icons">
                        <circle cx="200" cy="80" r="40" fill="white" className="service-icon-bg" />
                        <circle cx="320" cy="200" r="40" fill="white" className="service-icon-bg" />
                        <circle cx="200" cy="320" r="40" fill="white" className="service-icon-bg" />
                        <circle cx="80" cy="200" r="40" fill="white" className="service-icon-bg" />
                      </g>
                    </svg>

                    {/* Service icons */}
                    <div className="absolute top-[80px] left-[200px] -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center text-[#3b82f6] service-icon">
                      <div className="bg-white rounded-full p-4 shadow-lg">
                        <Wrench className="h-10 w-10" />
                      </div>
                      <div className="absolute top-14 left-24 bg-white px-3 py-1 rounded-full text-xs font-medium shadow-md whitespace-nowrap service-label">
                        Réparation
                      </div>
                    </div>

                    <div className="absolute top-[200px] left-[320px] -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center text-[#3b82f6] service-icon">
                      <div className="bg-white rounded-full p-4 shadow-lg">
                        <Clock className="h-10 w-10" />
                      </div>
                      <div className="absolute top-14 left-0 bg-white px-3 py-1 rounded-full text-xs font-medium shadow-md whitespace-nowrap service-label">
                        Entretien
                      </div>
                    </div>

                    <div className="absolute top-[320px] left-[200px] -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center text-[#3b82f6] service-icon">
                      <div className="bg-white rounded-full p-4 shadow-lg">
                        <SprayCan className="h-10 w-10" />
                      </div>
                      <div className="absolute bottom-14 left-24 bg-white px-3 py-1 rounded-full text-xs font-medium shadow-md whitespace-nowrap service-label">
                        Lavage
                      </div>
                    </div>

                    <div className="absolute top-[200px] left-[80px] -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center text-[#3b82f6] service-icon">
                      <div className="bg-white rounded-full p-4 shadow-lg">
                        <Car className="h-10 w-10" />
                      </div>
                      <div className="absolute top-14 right-0 bg-white px-3 py-1 rounded-full text-xs font-medium shadow-md whitespace-nowrap service-label">
                        Diagnostic
                      </div>
                    </div>

                    {/* Center car */}
                    <div className="absolute top-[200px] left-[200px] -translate-x-1/2 -translate-y-1/2 w-24 h-24 flex items-center justify-center">
                      <div className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-full p-5 shadow-lg shadow-blue-500/30 pulse-animation">
                        <Car className="h-14 w-14 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="#f8fafc"
              fillOpacity="1"
              d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,197.3C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              className={`bg-white rounded-2xl shadow-xl shadow-blue-100 p-6 transform transition-all duration-700 ${animatedElements.stats ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent mb-2">
                  {stats.vehicles}
                </div>
                <div className="text-sm font-medium text-gray-600">Véhicules Servis</div>
              </div>
            </div>
            <div
              className={`bg-white rounded-2xl shadow-xl shadow-blue-100 p-6 transform transition-all duration-700 ${animatedElements.stats ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent mb-2">
                  {stats.customers}
                </div>
                <div className="text-sm font-medium text-gray-600">Clients Satisfaits</div>
              </div>
            </div>
            <div
              className={`bg-white rounded-2xl shadow-xl shadow-blue-100 p-6 transform transition-all duration-700 ${animatedElements.stats ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent mb-2">
                  {stats.services}
                </div>
                <div className="text-sm font-medium text-gray-600">Services Proposés</div>
              </div>
            </div>
            <div
              className={`bg-white rounded-2xl shadow-xl shadow-blue-100 p-6 transform transition-all duration-700 ${animatedElements.stats ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
              style={{ transitionDelay: "600ms" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent mb-2">
                  {stats.satisfaction}%
                </div>
                <div className="text-sm font-medium text-gray-600">Taux de Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} id="services" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-[#3b82f6] text-sm font-medium mb-4 fade-in">
              Nos Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent fade-in">
              Des services automobiles complets
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto fade-in">
              Découvrez notre gamme complète de services automobiles conçus pour répondre à tous vos besoins.
            </p>
          </div>

          <div ref={serviceCardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bg-white overflow-hidden rounded-3xl shadow-xl shadow-blue-100 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 group transform ${
                  animatedElements.services
                    ? "translate-y-0 opacity-100"
                    : index % 2 === 0
                      ? "translate-x-[-100px] opacity-0"
                      : "translate-x-[100px] opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">{service.icon}</div>
                      <h3 className="text-xl font-bold">{service.title}</h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">{service.price}</span>
                      <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {service.benefits.map((benefit, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Disponibilité</span>
                      <span className="flex items-center gap-1 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Immédiate
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Garantie</span>
                      <span className="text-blue-600 font-medium">6 mois</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => setSelectedService(index)}
                      className="w-full py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <Calendar className="h-4 w-4" />
                      Réserver maintenant
                      <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={() => setSelectedService(index)}
                      className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Voir les détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg border border-blue-100 transform transition-all duration-500 hover:shadow-xl hover:border-blue-200 fade-in-delay">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <Shield className="h-12 w-12 text-[#3b82f6]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-3 text-gray-800">Services supplémentaires disponibles</h3>
                <p className="text-gray-600 mb-4">
                  Nous proposons également des services spécialisés comme la climatisation, l'électronique embarquée et
                  la personnalisation. Contactez-nous pour plus d'informations.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-medium shadow-sm flex items-center gap-1">
                    <Tool className="h-4 w-4" />
                    Climatisation
                  </span>
                  <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-medium shadow-sm flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Électronique
                  </span>
                  <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-medium shadow-sm flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    Personnalisation
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Nous contacter
                </Link>
                <Link
                  href="/services"
                  className="px-6 py-3 border border-[#3b82f6] text-[#3b82f6] rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Voir tous les services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="py-24 bg-gradient-to-b from-white to-blue-50 scroll-mt-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDEwMHYxMDBIMHoiLz48cGF0aCBkPSJNMCAwbDEwMCAxMDBNMTAwIDBMMCAxMDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-5 features-bg"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-[#3b82f6] text-sm font-medium mb-4 fade-in">
              Guide Utilisateur
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent fade-in">
              Comment utiliser notre application
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto fade-in">
              Découvrez comment notre application vous permet de gérer efficacement tous vos services automobiles.
            </p>
          </div>

          <div ref={featureCardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clientFeatures.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-3xl shadow-lg border transition-all duration-500 transform cursor-pointer
                  ${activeFeature === index 
                    ? 'border-blue-400 shadow-2xl scale-105 bg-gradient-to-br from-white to-blue-50' 
                    : 'border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-2'
                  }
                  ${animatedElements.features ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={() => setActiveFeature(activeFeature === index ? null : index)}
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-0 transition-opacity duration-500
                    ${activeFeature === index ? 'opacity-20' : 'group-hover:opacity-10'}`}
                  />
                  <div className={`rounded-2xl p-4 transition-all duration-500 relative
                    ${activeFeature === index 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white transform scale-110' 
                      : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100'}`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="space-y-3">
                  <h3 className={`text-xl font-bold transition-colors duration-300
                    ${activeFeature === index ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'}`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Steps */}
                <div className={`mt-6 space-y-3 transition-all duration-500 overflow-hidden
                  ${activeFeature === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 group-hover:max-h-[500px] group-hover:opacity-100'}`}
                >
                  {feature.steps.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 transition-all duration-500 transform
                        ${activeFeature === index ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}
                      `}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300
                        ${activeFeature === index 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100'}`}
                      >
                        {i + 1}
                      </div>
                      <p className="text-gray-600 text-sm">{step}</p>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className={`mt-6 transition-all duration-500 transform
                  ${activeFeature === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}
                >
                
                </div>
              </div>
            ))}
          </div>

          {/* Application Mobile Section with Enhanced Design */}
          <div className="mt-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 p-8 rounded-3xl shadow-lg border border-blue-100 transform transition-all duration-500 hover:shadow-xl hover:border-blue-200 fade-in-delay">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                <div className="bg-white p-6 rounded-2xl shadow-md relative">
                  <Smartphone className="h-16 w-16 text-blue-500" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Application Mobile Disponible
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Téléchargez notre application mobile pour gérer vos services automobiles où que vous soyez. 
                  Profitez d'une expérience optimisée et de fonctionnalités exclusives.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {[
                    { icon: <Bell className="h-4 w-4" />, text: "Notifications instantanées" },
                    { icon: <Calendar className="h-4 w-4" />, text: "Rendez-vous faciles" },
                    { icon: <Car className="h-4 w-4" />, text: "Suivi en temps réel" }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-white rounded-xl text-blue-600 font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1"
                    >
                      {feature.icon}
                      {feature.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  href="/app-store"
                  className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                >
                  <ArrowDownToLine className="h-5 w-5" />
                  Télécharger l'application
                </Link>
                <Link
                  href="/aide"
                  className="px-6 py-4 bg-white text-blue-600 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                >
                  <HelpCircle className="h-5 w-5" />
                  Centre d'aide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-[#3b82f6] text-sm font-medium mb-4 fade-in">
              Notre Atelier
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent fade-in">
              Découvrez nos installations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto fade-in">
              Découvrez nos installations modernes et notre équipe de professionnels.
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded-3xl shadow-2xl fade-in-delay"
            onMouseEnter={() => setAutoplayImages(false)}
            onMouseLeave={() => setAutoplayImages(true)}
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              {workshopImages.map((image, index) => (
                <div key={index} className="min-w-full">
                  <div className="relative h-[500px] w-full">
                    <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white shadow-lg transform transition-transform duration-300 hover:scale-110"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Précédent</span>
              </button>

              <button
                className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white shadow-lg transform transition-transform duration-300 hover:scale-110"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Suivant</span>
              </button>
            </div>

            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center gap-2">
                {workshopImages.map((_, index) => (
                  <button
                    key={index}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      currentImage === index ? "bg-[#3b82f6] w-8" : "bg-white/50 hover:bg-white"
                    }`}
                    onClick={() => setCurrentImage(index)}
                  >
                    <span className="sr-only">Image {index + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonialsRef}
        id="testimonials"
        className="py-24 bg-gradient-to-b from-blue-50 to-white scroll-mt-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDEwMHYxMDBIMHoiLz48cGF0aCBkPSJNMCAwbDEwMCAxMDBNMTAwIDBMMCAxMDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-5 testimonials-bg"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-[#3b82f6] text-sm font-medium mb-4 fade-in">
              Témoignages
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent fade-in">
              Ce que disent nos clients
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto fade-in">
              Découvrez les témoignages de nos clients satisfaits.
            </p>
          </div>

          <div ref={testimonialCardsRef} className="grid md:grid-cols-2 gap-8 mb-12">
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-700 transform ${
                  animatedElements.testimonials
                    ? "translate-y-0 opacity-100 hover:-translate-y-2"
                    : index === 0
                      ? "translate-x-[-100px] opacity-0"
                      : "translate-x-[100px] opacity-0"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-4 border-blue-50"
                  />
                  <div>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{testimonial.date}</span>
                    </div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-4 relative">
                  <svg
                    className="absolute -top-2 -left-2 h-8 w-8 text-blue-100 transform -rotate-12"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative z-10 text-gray-700 italic">{testimonial.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`relative max-w-4xl mx-auto bg-gradient-to-r from-[#3b82f6]/5 to-[#2563eb]/5 p-1 rounded-3xl transition-all duration-700 transform ${
              animatedElements.testimonials ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
            onMouseEnter={() => setAutoplayTestimonials(false)}
            onMouseLeave={() => setAutoplayTestimonials(true)}
          >
            <div className="overflow-hidden rounded-3xl bg-white">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="min-w-full px-4 py-8">
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                      <div className="mb-6 relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] rounded-full blur opacity-50"></div>
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="relative w-20 h-20 rounded-full border-4 border-white"
                        />
                      </div>
                      <div className="flex items-center mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xl italic mb-6 text-gray-700">"{testimonial.content}"</p>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <p className="text-xs text-gray-500 mt-1">{testimonial.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-2 bg-white rounded-full shadow-lg p-1">
                <button
                  className="p-2 rounded-full text-gray-600 hover:text-[#3b82f6] transition-colors"
                  onClick={prevTestimonial}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentTestimonial === index ? "bg-[#3b82f6] w-4" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  >
                    <span className="sr-only">Témoignage {index + 1}</span>
                  </button>
                ))}

                <button
                  className="p-2 rounded-full text-gray-600 hover:text-[#3b82f6] transition-colors"
                  onClick={nextTestimonial}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-[#3b82f6] text-sm font-medium mb-4 fade-in">
              <HelpCircle className="h-4 w-4 mr-2" />
              Questions Fréquentes
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent fade-in">
              Besoin d'aide ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto fade-in">
              Consultez notre FAQ pour trouver des réponses aux questions les plus fréquentes.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {[
              {
                icon: <Calendar className="h-6 w-6" />,
                question: "Comment prendre rendez-vous pour mon véhicule ?",
                answer:
                  "Prendre rendez-vous est simple ! Connectez-vous à votre compte, sélectionnez votre véhicule, choisissez le service souhaité, puis sélectionnez une date et une heure disponibles. Vous recevrez une confirmation par email et SMS avec tous les détails de votre rendez-vous. Notre système intelligent vous propose les créneaux les plus adaptés à votre emploi du temps.",
              },
              {
                icon: <Bell className="h-6 w-6" />,
                question: "Comment suivre l'avancement de mon service ?",
                answer:
                  "Vous pouvez suivre l'avancement de votre service en temps réel via notre application mobile ou le portail web. Vous recevrez des notifications à chaque étape importante (réception du véhicule, diagnostic, début des travaux, finalisation). Vous pouvez également consulter des photos et des commentaires de nos techniciens pendant l'intervention. Notre système de suivi en temps réel vous permet de rester informé à chaque étape.",
              },
              {
                icon: <FileText className="h-6 w-6" />,
                question: "Puis-je consulter l'historique des services de mon véhicule ?",
                answer:
                  "Absolument ! Dans votre espace client, vous avez accès à l'historique complet de tous les services effectués sur votre véhicule. Vous pouvez consulter les détails de chaque intervention, télécharger les factures et voir les recommandations pour les futurs entretiens. Notre système conserve également les rapports techniques détaillés et les photos des interventions.",
              },
              {
                icon: <Car className="h-6 w-6" />,
                question: "Comment ajouter un nouveau véhicule à mon compte ?",
                answer:
                  "Pour ajouter un nouveau véhicule, connectez-vous à votre compte et accédez à la section 'Mes Véhicules'. Cliquez sur 'Ajouter un véhicule' et renseignez les informations demandées (marque, modèle, année, kilométrage, etc.). Vous pouvez également ajouter une photo et des documents comme la carte grise. Notre système vous guidera étape par étape dans le processus d'enregistrement.",
              },
             
              {
                icon: <Phone className="h-6 w-6" />,
                question: "Comment contacter le service client en cas de problème ?",
                answer:
                  "Notre service client est disponible du lundi au vendredi de 8h à 19h et le samedi de 9h à 17h. Vous pouvez nous contacter par téléphone au +216 71 234 567, par email à support@autoservice.tn, ou via le chat en direct dans l'application. Pour les urgences en dehors des heures d'ouverture, un service d'assistance téléphonique est disponible 24h/24. Notre équipe répond généralement dans les 15 minutes.",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                question: "Quelles sont vos garanties sur les services effectués ?",
                answer:
                  "Nous offrons une garantie de 6 mois sur toutes nos interventions et pièces de rechange. Cette garantie couvre les défauts de fabrication et les problèmes liés à l'installation. Pour les pièces d'origine, la garantie peut s'étendre jusqu'à 2 ans selon le fabricant. Nous fournissons un certificat de garantie détaillé pour chaque intervention.",
              },
              {
                icon: <Clock className="h-6 w-6" />,
                question: "Quels sont vos délais d'intervention habituels ?",
                answer:
                  "Nos délais d'intervention varient selon le type de service. Pour une vidange ou un entretien basique, comptez environ 1-2 heures. Les réparations mécaniques peuvent prendre de 2 à 4 heures selon la complexité. Pour les interventions majeures, nous vous fournissons un devis détaillé avec un délai estimé. Nous nous efforçons toujours de respecter les délais annoncés et vous tenons informé en cas de retard.",
              },
              {
                icon: <Tool className="h-6 w-6" />,
                question: "Proposez-vous des services de dépannage ?",
                answer:
                  "Oui, nous proposons un service de dépannage 24h/24 et 7j/7. Notre équipe de techniciens qualifiés intervient sur place pour les pannes mécaniques, les problèmes électriques, et les remorquages. Le service est disponible dans un rayon de 50 km autour de nos centres. Nous disposons d'une flotte de véhicules de dépannage équipés pour tous types d'interventions.",
              },
              {
                icon: <Award className="h-6 w-6" />,
                question: "Quelles sont vos certifications et qualifications ?",
                answer:
                  "Notre équipe est composée de techniciens certifiés par les plus grands constructeurs automobiles. Nous sommes certifiés ISO 9001 pour la qualité de nos services et ISO 14001 pour notre engagement environnemental. Nos techniciens suivent régulièrement des formations pour rester à jour avec les dernières technologies automobiles. Nous sommes également membres de plusieurs associations professionnelles reconnues.",
              },
              {
                icon: <Gauge className="h-6 w-6" />,
                question: "Proposez-vous des services de diagnostic préventif ?",
                answer:
                  "Oui, nous proposons des diagnostics préventifs complets pour votre véhicule. Ces diagnostics incluent une analyse électronique complète, une vérification des systèmes de sécurité, et une évaluation de l'état général du véhicule. Nous utilisons des équipements de pointe pour détecter les problèmes potentiels avant qu'ils ne deviennent critiques. Un rapport détaillé vous est remis avec des recommandations personnalisées.",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                question: "Proposez-vous des services pour les véhicules électriques ?",
                answer:
                  "Absolument ! Nous sommes équipés pour entretenir et réparer tous types de véhicules électriques et hybrides. Nos techniciens sont spécialement formés aux technologies électriques et disposent des équipements nécessaires pour travailler en toute sécurité sur les systèmes haute tension. Nous proposons également des services de diagnostic spécifiques pour les batteries et les systèmes de charge.",
              }
            ].map((item, index) => {
              const [isOpen, setIsOpen] = useState(false)
              const contentRef = useRef<HTMLDivElement>(null)

              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg border transition-all duration-500 overflow-hidden ${
                    isOpen ? "border-blue-200 shadow-xl" : "border-gray-100 hover:border-blue-100 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-3 transition-colors ${
                          isOpen ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-[#3b82f6] transition-transform duration-300 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-96" : "max-h-0"}`}>
                    <div ref={contentRef} className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#60a5fa]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDEwMHYxMDBIMHoiLz48cGF0aCBkPSJNMCAwbDEwMCAxMDBNMTAwIDBMMCAxMDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="cta-glow"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            ref={ctaRef}
            className={`max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 transform ${animatedElements.cta ? "translate-y-0 opacity-100 scale-100" : "translate-y-16 opacity-0 scale-95"}`}
          >
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  Prêt à simplifier la gestion de vos services automobiles ?
                </h2>
                <p className="text-lg mb-8 text-gray-600">
                  Rejoignez notre plateforme et profitez d'une solution complète pour optimiser vos opérations.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/login"
                    className="px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-full font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Commencer maintenant
                  </Link>
                 
                </div>
              </div>
              <div className="hidden md:block relative">
                <img
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80"
                  alt="Service automobile professionnel"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Service Detail Modal */}
      {selectedService !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-fadeIn">
            <div className="relative">
              <img
                src={services[selectedService].image || "/placeholder.svg"}
                alt={services[selectedService].title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-800 hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold text-white">{services[selectedService].title}</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold text-[#3b82f6]">{services[selectedService].price}</div>
                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  {services[selectedService].duration}
                </div>
              </div>
              <p className="text-gray-700 mb-6">{services[selectedService].description}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Ce service inclut:</h3>
                <ul className="space-y-2">
                  {services[selectedService].includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Avantages:</h3>
                <div className="flex flex-wrap gap-2">
                  {services[selectedService].benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors"
                >
                  Annuler
                </button>
                <button className="px-4 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
                  Réserver maintenant
                </button>
              </div>
            </div>
          </div>
        </div>



      )}

      <Footer />

      <style jsx global>{`
        /* Fade in animations */
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        .fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        /* Slide in animations */
        .slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }
        .slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }
        
        /* Hero text animation */
        .hero-text {
          background-size: 200% auto;
          background-image: linear-gradient(to right, #fff 0%, #bfdbfe 50%, #fff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: textShine 3s linear infinite;
        }
        
        /* Background animations */
        .hero-glow {
          position: absolute;
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, rgba(59, 130, 246, 0) 70%);
          opacity: 0.6;
          animation: pulse 8s ease-in-out infinite;
        }
        
        .features-bg {
          animation: moveBg 30s linear infinite;
        }
        
        .testimonials-bg {
          animation: moveBg 30s linear infinite reverse;
        }
        
        .cta-glow {
          position: absolute;
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, rgba(59, 130, 246, 0) 70%);
          opacity: 0.6;
          animation: pulse 8s ease-in-out infinite alternate;
        }
        
        /* Particles */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          pointer-events: none;
        }
        
        .particle-0 {
          top: 10%;
          left: 10%;
          animation: floatParticle 15s linear infinite;
        }
        
        .particle-1 {
          top: 20%;
          left: 80%;
          animation: floatParticle 20s linear infinite 2s;
        }
        
        .particle-2 {
          top: 80%;
          left: 30%;
          animation: floatParticle 18s linear infinite 1s;
        }
        
        .particle-3 {
          top: 40%;
          left: 60%;
          animation: floatParticle 25s linear infinite 4s;
        }
        
        .particle-4 {
          top: 70%;
          left: 90%;
          animation: floatParticle 22s linear infinite 3s;
        }
        
        /* Service animation */
        .service-animation {
          animation: float 4s ease-in-out infinite;
        }
        .service-circle {
          position: relative;
          width: 380px;
          height: 380px;
        }
        .service-icon {
          transition: all 0.5s ease;
          animation: iconPulse 3s ease-in-out infinite;
        }
        .service-icon:nth-child(2) {
          animation-delay: 0.75s;
        }
        .service-icon:nth-child(3) {
          animation-delay: 1.5s;
        }
        .service-icon:nth-child(4) {
          animation-delay: 2.25s;
        }
        .service-label {
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }
        .service-icon:hover .service-label {
          opacity: 1;
          transform: translateY(0);
        }
        .service-icon-bg {
          filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
        }
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        
        /* Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes textShine {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes moveLines {
          0% { background-position: 0 0; }
          100% { background-position: 100px 100px; }
        }
        
        @keyframes moveBg {
          0% { background-position: 0 0; }
          100% { background-position: 100px 100px; }
        }
        
        @keyframes floatParticle {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(100px, 50px);
          }
          50% {
            transform: translate(50px, 100px);
          }
          75% {
            transform: translate(-50px, 50px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  )
}
