import { motion as Motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUserCheck, FaTools, FaCheckCircle } from 'react-icons/fa';

const HowItWorks = () => {
  // Framer Motion Variants (Copied from AboutUsPage to maintain consistency and fix unused warning)
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    hover: { scale: 1.03, transition: { type: "spring", stiffness: 300 } }
  };

  const steps = [
    {
      icon: FaMapMarkerAlt,
      title: "Step 1: Report & Locate",
      description: "Citizens use the platform to submit a report, upload photos, and pinpoint the exact location of the infrastructure issue.",
      color: "from-blue-500 to-cyan-500",
      delay: 0,
    },
    {
      icon: FaUserCheck,
      title: "Step 2: Assign & Verify",
      description: "The Admin reviews the incoming issue, assigns it to the relevant Staff member, and the issue status moves to 'In-Progress'.",
      color: "from-purple-500 to-indigo-500",
      delay: 0.1,
    },
    {
      icon: FaTools,
      title: "Step 3: Track & Resolve",
      description: "Staff members work on the issue, updating the timeline with progress notes. The status changes to 'Resolved' upon completion.",
      color: "from-orange-500 to-red-500",
      delay: 0.2,
    },
    {
      icon: FaCheckCircle,
      title: "Step 4: Close & Audit",
      description: "Once resolved, the Staff or Admin closes the issue. The complete lifecycle and audit trail are preserved for transparency.",
      color: "from-green-500 to-teal-500",
      delay: 0.3,
    },
  ];

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-b from-gray-50 to-blue-100">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              The <span className="bg-gradient-to-r from-pink-300 to-yellow-200 bg-clip-text text-transparent">4-Step Cycle</span> to City Repair
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              See exactly how your report moves from a pending issue to a resolved solution.
            </p>
          </Motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold text-center text-gray-800 mb-16"
          >
            How the System Works
          </Motion.h2>

          <Motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Timeline Connector Line (Desktop/Tablet) */}
            <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-1 bg-indigo-200 mx-16">
              <Motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "calc(100% - 8rem)" }} // Adjust width to match spacing
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
              />
            </div>
            
            {steps.map((step, index) => (
              <Motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                transition={{ duration: 0.6, delay: step.delay }}
                className="relative flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-2xl border-t-4 border-indigo-500"
              >
                {/* Step Icon */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-3xl mb-4 shadow-lg ring-4 ring-white relative z-10`}>
                  <step.icon />
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-full shadow-lg">
                    {index + 1}
                </div>

                <h3 className="text-xl font-extrabold text-gray-800 mb-3 mt-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* Tracking & Transparency Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* APPLYING fadeInUp HERE to resolve the warning */}
            <Motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Motion.h2
                variants={fadeInUp} // Applied fadeInUp
                className="text-4xl font-bold text-gray-800 mb-6"
              >
                Full Transparency, Every Step of the Way
              </Motion.h2>
              <Motion.p
                variants={fadeInUp} // Applied fadeInUp
                className="text-lg text-gray-600 mb-8"
              >
                Our innovative **Issue Tracking & Timeline** feature gives you a complete, read-only audit history of your report. You'll never be left in the dark.
              </Motion.p>
              <Motion.ul 
                variants={staggerContainer} 
                initial="initial" 
                whileInView="animate" 
                viewport={{ once: true }}
                className="space-y-4 text-gray-700"
              >
                {[
                  { text: "Detailed timeline entries for every status change.", icon: "✅" },
                  { text: "Tracking records for staff assignment and boost payments.", icon: "✅" },
                  { text: "Notifications delivered directly to citizens and staff.", icon: "✅" },
                ].map((item, index) => (
                  <Motion.li
                    key={index}
                    variants={fadeInUp} // Applied fadeInUp
                    className="flex items-start"
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="text-lg">{item.text}</span>
                  </Motion.li>
                ))}
              </Motion.ul>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8 bg-white rounded-3xl shadow-2xl relative"
            >
              {/* Timeline Mockup */}
              <h3 className="text-2xl font-bold mb-6 text-indigo-700">Issue Timeline (Mockup)</h3>
              <div className="space-y-6 border-l-4 border-gray-200 pl-6">
                {['Issue Closed by Staff', 'Marked as Resolved', 'Work Started on Issue', 'Issue Assigned to Staff', 'Issue Reported by Citizen'].map((event, index) => (
                    <div key={index} className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-indigo-500 -left-8 border-4 border-white"></div>
                        <p className="font-semibold text-gray-800">{event}</p>
                        <p className="text-sm text-gray-500">Dec 10, 2025 - 10:30 AM</p>
                    </div>
                ))}
              </div>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-green-500 to-teal-600 rounded-3xl p-10 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg opacity-90 mb-6">
            Start the cycle of change by submitting your first report today.
          </p>

          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-green-700 font-bold px-8 py-3 rounded-full text-lg hover:shadow-xl transition-all"
          >
            Report an Issue Now
          </Motion.button>
        </Motion.div>
      </section>
    </div>
  );
};

export default HowItWorks;