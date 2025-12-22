import { motion as Motion } from 'framer-motion';

const AboutUsPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const scaleUp = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">CityFix</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Building better cities through community collaboration and technology
            </p>
          </Motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Motion.div
              variants={slideInLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 absolute -top-8 -left-8"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                  <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    Founded in 2020, CityFix began as a simple idea: what if citizens could easily report
                    public infrastructure issues and track their resolution in real-time?
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Today, we've grown into a comprehensive platform connecting thousands of citizens
                    with local authorities across 50+ cities, resolving over 10,000 issues and
                    making communities safer and better for everyone.
                  </p>
                </div>
              </div>
            </Motion.div>

            <Motion.div
              variants={slideInRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-6">
                {[2020, 2021, 2022, 2023].map((year, index) => (
                  <Motion.div
                    key={year}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl text-white text-center shadow-lg"
                  >
                    <div className="text-3xl font-bold mb-2">{year}</div>
                    <div className="text-sm opacity-90">Milestone Achieved</div>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <Motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <Motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-green-500 to-teal-600 p-8 rounded-3xl text-white shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg opacity-90">
                To empower every citizen to improve city infrastructure through transparency and technology.
              </p>
            </Motion.div>

            <Motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-3xl text-white shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg opacity-90">
                A world where no public issue goes unresolved — where technology builds smarter cities.
              </p>
            </Motion.div>
          </Motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Meet Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to making cities better
            </p>
          </Motion.div>

          <Motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { name: "Alex Chen", role: "Founder & CEO", color: "from-blue-500 to-cyan-500" },
              { name: "Sarah Johnson", role: "Head of Operations", color: "from-purple-500 to-pink-500" },
              { name: "Marcus Rivera", role: "Lead Developer", color: "from-green-500 to-teal-500" }
            ].map((member) => (
              <Motion.div
                key={member.name}
                variants={scaleUp}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <div className={`w-48 h-48 rounded-full bg-gradient-to-r ${member.color} mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-xl`}>
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <Motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Our <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Core Values</span>
          </Motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparency",
                description: "Open communication and clear tracking at every step",
                icon: "👁️",
                color: "from-blue-400 to-indigo-500"
              },
              {
                title: "Community",
                description: "Power of collective action and shared responsibility",
                icon: "🤝",
                color: "from-green-400 to-emerald-500"
              },
              {
                title: "Innovation",
                description: "Leveraging technology for smarter city solutions",
                icon: "💡",
                color: "from-purple-400 to-pink-500"
              }
            ].map((value, index) => (
              <Motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${value.color} p-8 rounded-3xl text-white shadow-xl`}
              >
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="opacity-90">{value.description}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-bold mb-6">Join Our Movement</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Together, we can build cleaner, safer, and better cities for everyone.
          </p>

          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-full text-lg hover:shadow-2xl transition-all"
          >
            Start Reporting Issues
          </Motion.button>
        </Motion.div>
      </section>
    </div>
  );
};

export default AboutUsPage;