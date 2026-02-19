import heroImage from "../assets/home/home.jpg";
import equipment from "../assets/home/equipment.jpg";
import about from "../assets/home/about.jpg";
import couch from "../assets/home/couch.jpg";
import nutrition from "../assets/home/nutrition.jpg";
import trainer from "../assets/home/trainer.jpg";
import progress from "../assets/home/progress.jpg";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Home = () => {
  const features = [
    {
      title: "Personalized Training Programs",
      desc: "Tailored training plans based on your fitness level, goals, and progress tracking.",
      image: trainer,
    },
    {
      title: "Top-Notch Equipment",
      desc: "We provide a wide range of high-quality gym equipment — from free weights and resistance machines to cardio and functional training tools.",
      image: equipment,
    },
    {
      title: "Certified & Experienced Coaches",
      desc: "Our trainers are certified fitness professionals with expertise in strength training, fat loss transformation, and athletic conditioning.",
      image: couch,
    },
    {
      title: "Performance Tracking Dashboard",
      desc: "Track workouts, monitor improvements, and analyze performance metrics with our integrated tracking system.",
      image: progress,
    },
    {
      title: "Nutrition Guidance & Meal Plans",
      desc: "Customized nutrition plans designed to complement your workouts and accelerate results.",
      image: nutrition,
    },
  ];

  // Programs Data
  const programs = [
    {
      title: "Strength Training",
      desc: "Build muscle and increase power with guided strength workouts.",
    },
    {
      title: "Fat Loss Program",
      desc: "Burn calories effectively with high-intensity sessions.",
    },
    {
      title: "Personal Training",
      desc: "1-on-1 expert coaching for faster and safer results.",
    },
    {
      title: "Cardio & Endurance",
      desc: "Improve stamina and heart health with dynamic cardio training.",
    },
    {
      title: "Yoga & Flexibility",
      desc: "Enhance mobility, posture and recovery through guided yoga.",
    },
  ];

  return (
    <div className="text-white font-sans bg-[#0F0F14]">
      {/* HERO */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0F0F14]/85"></div>

        <div className="relative z-10 text-center px-6">
          <span
            className="inline-block mb-6 px-6 py-2 text-xs tracking-[4px] uppercase 
          bg-[#7C3AED]/10 text-[#C4B5FD] border border-[#7C3AED]/30 rounded-full"
          >
            STRIVEFIT • TRANSFORM YOUR LIFE
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Elevate Your
            <span className="block bg-gradient-to-r from-[#7C3AED] to-[#C4B5FD] bg-clip-text text-transparent">
              Strength & Precision
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-[#9CA3AF] text-base md:text-lg mb-10">
            Elite coaching, state-of-the-art facilities, and results-driven
            programs designed for individuals committed to achieving their best.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-5">
            <button
              className="px-8 py-3 rounded-lg bg-[#7C3AED] text-white font-semibold 
            hover:scale-105 hover:shadow-[0_0_25px_#7C3AED] transition duration-300"
            >
              Begin Membership
            </button>

            <button
              className="px-8 py-3 rounded-lg border border-[#7C3AED] 
            text-[#C4B5FD] hover:bg-[#7C3AED]/10 transition duration-300"
            >
              Explore Programs
            </button>
          </div>
        </div>
      </motion.section>

      {/* ABOUT SECTION */}
      <section className="py-16 bg-[#0F0F14]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
          >
            <img
              src={about}
              alt="About Gym"
              className="rounded-2xl shadow-lg border border-[#7C3AED]/30"
            />
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-[#C4B5FD] mb-4">
              Built For Serious Results
            </h2>

            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              StriveFit is a performance-driven training club designed for
              individuals who are committed to achieving real results. We
              combine elite coaching, state-of-the-art equipment, and tailored
              programs to help you build strength, endurance, and confidence.
              Whether your goal is muscle growth, fat loss, or overall fitness,
              StriveFit provides a structured approach with measurable progress
              tracking and personalized support every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-[#18181F] relative z-10">
        <motion.h2
          className="text-4xl font-bold text-center text-[#7C3AED] mb-20"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
        >
          Why Train With Us
        </motion.h2>

        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="relative grid md:grid-cols-2 items-center gap-6 px-4 py-6 rounded-2xl overflow-hidden shadow-lg border border-[#7C3AED]/30"
              style={{
                backgroundImage: `url(${f.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
            >
              <div className="absolute inset-0 bg-black/70"></div>

              {/* image on left */}
              <div className="z-10 flex justify-center md:justify-start md:order-first">
                <img
                  src={f.image}
                  className="w-32 h-32 rounded-full border-4 border-[#7C3AED] object-cover"
                  alt={f.title}
                />
              </div>

              {/* Text on right */}
              <div className="z-10 md:px-10 text-center md:text-left md:order-last">
                <h3 className="text-3xl font-bold text-[#C4B5FD] mb-2">
                  {f.title}
                </h3>
                <p className="text-[#9CA3AF]">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <motion.section
        className="py-24 bg-[#18181F]"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#C4B5FD] mb-16 tracking-wide">
            Our Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              ["500+", "Active Members"],
              ["25", "Elite Trainers"],
              ["1000+", "Successful Transformations"],
              ["24/7", "Full Access Facility"],
            ].map(([stat, label], i) => (
              <motion.div
                key={i}
                className="bg-[#0F0F14] rounded-2xl shadow-lg border border-[#7C3AED]/30 flex flex-col items-center justify-center py-12 px-6"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
              >
                <h3 className="text-5xl md:text-6xl font-extrabold text-[#C4B5FD]">
                  {stat}
                </h3>
                <p className="mt-4 text-[#9CA3AF] uppercase tracking-widest text-sm md:text-xs text-center">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* PROGRAMS */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-[#111111] py-20 px-6 text-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-purple-500">
            Our Program
          </h2>

          <p className="text-gray-400 mb-12">
            Choose your transformation journey with our professional training
            programs.
          </p>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="!pb-14"
          >
            {programs.map((program, index) => (
              <SwiperSlide key={index} className="h-full">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-[#1A1A1A] p-6 rounded-2xl shadow-lg min-h-[180px]
 flex flex-col"
                >
                  <h3 className="text-xl font-semibold text-purple-400">
                    {program.title}
                  </h3>

                  <p className="text-gray-400 mt-4">{program.desc}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
