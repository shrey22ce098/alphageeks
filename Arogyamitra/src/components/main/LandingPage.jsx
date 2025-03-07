import { useState } from "react";
import {
  Search,
  Heart,
  Shield,
  Stethoscope,
  Bot,
  MapPin,
  Phone,
  Calendar,
  Menu as MenuIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SignUp from "../auth/SignUp";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const closeSignUp = () => {
    setShowSignUp(false);
  };

  // If showing signup, render that instead of the main page
  if (showSignUp) {
    return <SignUp onClose={closeSignUp} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-8">
              <h1 className="text-4xl font-extrabold text-blue-800 leading-tight md:text-5xl">
                Your AI-Powered{" "}
                <span className="text-green-600">Health Assistant</span>
              </h1>
              <p className="mt-4 text-lg text-gray-700 max-w-lg">
                Get AI-driven health support, vaccination reminders, and doctor
                consultations all in one place for you and your family.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-md"
                  onClick={handleSignUpClick}
                >
                  Get Started
                </button>

                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center">
                  <Bot size={20} className="mr-2" />
                  Try AI Chat
                </button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <img
                src="/assets/health.png"
                alt="Healthcare professionals"
                className="rounded-xl shadow-xl mx-auto"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Search Section */}
      <section id="find-doctors" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-800">
              Find the Right Doctor
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Search by specialty, location, or doctor name
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Doctor name or keyword"
                  className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope size={18} className="text-gray-400" />
                </div>
                <select
                  className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  value={searchSpecialty}
                  onChange={(e) => setSearchSpecialty(e.target.value)}
                >
                  <option value="">Select Specialty</option>
                  <option value="cardiologist">Cardiologist</option>
                  <option value="dermatologist">Dermatologist</option>
                  <option value="neurologist">Neurologist</option>
                  <option value="pediatrician">Pediatrician</option>
                  <option value="orthopedic">Orthopedic</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-md">
                Search Doctors
              </button>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <DoctorCard
              name="Dr. Sharma"
              specialty="Cardiologist"
              location="Delhi"
              rating={4.9}
            />
            <DoctorCard
              name="Dr. Patel"
              specialty="Pediatrician"
              location="Mumbai"
              rating={4.8}
            />
            <DoctorCard
              name="Dr. Reddy"
              specialty="Neurologist"
              location="Hyderabad"
              rating={4.7}
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-2">
              Our Services
            </h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed to meet all your
              medical needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Heart className="text-red-500" size={32} />}
              title="Health Monitoring"
              description="Personalized health tracking and reminders for medications, appointments, and preventive care."
            />
            <ServiceCard
              icon={<Shield className="text-blue-500" size={32} />}
              title="Vaccination Tracker"
              description="Stay updated with immunization schedules for you and your family with timely reminders."
            />
            <ServiceCard
              icon={<Stethoscope className="text-green-500" size={32} />}
              title="Doctor Consultations"
              description="Connect with specialists through video calls, chat, or in-person appointments."
            />
            <ServiceCard
              icon={<Calendar className="text-purple-500" size={32} />}
              title="Appointment Scheduling"
              description="Book appointments with doctors and healthcare providers with ease."
            />
            <ServiceCard
              icon={<Bot className="text-blue-600" size={32} />}
              title="AI Health Assistant"
              description="Get instant answers to health queries and initial symptom analysis."
            />
            <ServiceCard
              icon={<Phone className="text-green-600" size={32} />}
              title="24/7 Support"
              description="Round-the-clock assistance for all your healthcare needs and emergencies."
            />
          </div>
        </div>
      </section>

      {/* AI Health Bot Section */}
      <section
        id="health-bot"
        className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-8">
              <h2 className="text-3xl font-bold mb-4">AI Health Assistant</h2>
              <p className="text-lg mb-6 opacity-90">
                Our advanced AI can help you understand symptoms, provide health
                information, and guide you to appropriate care options.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  Symptom assessment and guidance
                </li>
                <li className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  24/7 health information
                </li>
                <li className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  Medication reminders
                </li>
              </ul>
              <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-md flex items-center">
                <Bot size={20} className="mr-2" />
                Start AI Chat
              </button>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
              <div className="bg-white p-4 rounded-xl shadow-xl max-w-md w-full">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Bot size={20} className="text-blue-700" />
                    </div>
                    <div className="bg-blue-100 rounded-lg py-2 px-4 text-gray-800">
                      <p>
                        Hello! I'm your health assistant. How can I help you
                        today?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <div className="bg-gray-200 rounded-lg py-2 px-4 text-gray-800 ml-auto">
                      <p>I've been having headaches for the past few days.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Bot size={20} className="text-blue-700" />
                    </div>
                    <div className="bg-blue-100 rounded-lg py-2 px-4 text-gray-800">
                      <p>
                        I'm sorry to hear that. Could you tell me more about
                        your symptoms? How severe is the pain, and where is it
                        located?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type your health question..."
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-700 p-1">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section id="tips" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-800">
              Health Tips & Updates
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Stay informed with the latest health advice
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <HealthTipCard
              image="/api/placeholder/400/300"
              title="Stay Hydrated"
              description="Drink at least 8 glasses of water daily to maintain your body's fluid balance."
            />
            <HealthTipCard
              image="/api/placeholder/400/300"
              title="Balanced Diet"
              description="Include proteins, fruits, vegetables, and whole grains in your daily meals."
            />
            <HealthTipCard
              image="/api/placeholder/400/300"
              title="Regular Check-ups"
              description="Schedule preventive health check-ups at least once a year."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Arogyamitra for their healthcare
            needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-md"
              onClick={handleSignUpClick}
            >
              Sign Up Now
            </button>
            <button className="bg-white border border-blue-700 text-blue-700 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Arogyamitra</h3>
              <p className="text-gray-400">
                Your AI-powered health assistant for personalized healthcare
                solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#find-doctors"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Find Doctors
                  </a>
                </li>
                <li>
                  <a
                    href="#health-bot"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    AI Assistant
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12.07a10 10 0 01-8.48 9.88v-7h2.38l.45-3h-2.83V9.8c0-.8.4-1.6 1.6-1.6h1.2V5.7s-1.08-.2-2.16-.2c-2.16 0-3.6 1.3-3.6 3.7v2.1H8.25v3h2.3v7A10 10 0 0112 2a10 10 0 110 10.07z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 5.8a8.6 8.6 0 01-2.36.6 4.07 4.07 0 001.8-2.27 8.5 8.5 0 01-2.6 1 4.1 4.1 0 00-7 3.8 11.6 11.6 0 01-8.38-4.2 4.1 4.1 0 001.27 5.5A4 4 0 012 9.8v.05a4.1 4.1 0 003.3 4.03 4.1 4.1 0 01-1.86.07 4.1 4.1 0 003.83 2.85A8.2 8.2 0 012 18.4a11.67 11.67 0 006.29 1.84c7.55 0 11.67-6.25 11.67-11.67l-.01-.53A8.3 8.3 0 0022 5.8z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-pink-600 flex items-center justify-center hover:bg-pink-500 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2a10 10 0 00-3.16 19.5c.5.08.66-.22.66-.48l-.01-1.7c-2.68.58-3.25-1.3-3.25-1.3-.44-1.1-1.07-1.4-1.07-1.4-.87-.6.07-.58.07-.58.96.07 1.46.99 1.46.99.86 1.47 2.25 1.05 2.8.8.08-.62.33-1.05.6-1.29-2.1-.24-4.33-1.05-4.33-4.7 0-1.04.37-1.89 1-2.56-.1-.24-.42-1.25.1-2.6 0 0 .8-.26 2.6.98a9.04 9.04 0 014.8 0c1.8-1.24 2.58-.98 2.58-.98.52 1.35.2 2.36.1 2.6.62.67 1 1.52 1 2.56 0 3.67-2.23 4.46-4.35 4.7.35.3.66.9.66 1.8l-.01 2.67c0 .26.16.57.68.48A10 10 0 0012 2z" />
                  </svg>
                </a>
              </div>
              <p className="text-gray-400">Email: contact@arogyamitra.com</p>
              <p className="text-gray-400">Phone: +91 123 456 7890</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Arogyamitra. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Service Card Component
function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Doctor Card Component
function DoctorCard({ name, specialty, location, rating }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="bg-gray-200 h-16 w-16 rounded-full overflow-hidden mr-4">
          <img
            src="/api/placeholder/80/80"
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-blue-700">{specialty}</p>
        </div>
      </div>
      <div className="flex items-center mb-2">
        <MapPin size={16} className="text-gray-500 mr-2" />
        <span className="text-gray-600">{location}</span>
      </div>
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-600 ml-2">
          {rating} ({Math.floor(Math.random() * 100 + 50)} reviews)
        </span>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
          Book Appointment
        </button>
      </div>
    </div>
  );
}

// Health Tip Card Component
function HealthTipCard({ image, title, description }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <button className="text-blue-700 font-medium hover:text-blue-800 transition-colors flex items-center">
          Learn more
          <svg
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
