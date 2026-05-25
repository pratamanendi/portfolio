// Shared translations - imported by React components at build time
export const translations = {
  en: {
    nav: { home: 'Home', projects: 'Projects', blog: 'Blog', contact: 'Contact' },
    hero: { title: 'FRONTEND ENGINEER', subtitle: '& FULLSTACK DEVELOPER', description: 'Building digital experiences at the intersection of bold design and rigorous engineering.', cta: 'Explore System' },
    about: { title: 'ABOUT ME', description1: 'I build digital experiences that live at the intersection of bold design and rigorous engineering. As a Frontend Engineer and Fullstack Web Developer, I refuse to settle for generic interfaces.', description2: "Whether it's a lightning-fast static site or a complex web application, I craft solutions that demand attention and perform flawlessly. I'm passionate about AI integration, modern web technologies, and building scalable systems.", cta: 'Read My Blog' },
    projects: { title: 'FEATURED PROJECTS', description: 'A selection of projects showcasing my expertise in frontend development, AI integration, and full-stack engineering.', viewProject: 'View Project →', project1: { title: 'AI Chat Interface', description: 'Real-time chat application powered by Claude API with streaming responses and conversation history.' }, project2: { title: 'Hermes Portfolio', description: 'Personal portfolio built with Astro, showcasing AI-powered blog and project showcase.' }, project3: { title: 'OpenRouter Dashboard', description: 'Dashboard for managing multiple LLM APIs through OpenRouter with cost tracking and model comparison.' }, project4: { title: 'AI Content Generator', description: 'Automated content generation tool using multiple AI models with quality scoring and optimization.' }, project5: { title: 'Smart Form Builder', description: 'AI-powered form builder with intelligent field suggestions and validation using machine learning.' }, project6: { title: 'Code Review Assistant', description: 'Automated code review tool that analyzes pull requests and suggests improvements using Claude.' } },
    contact: { title: "LET'S COLLABORATE", description: "Have a project in mind? Let's build something amazing together. Reach out and let's talk.", email: 'Email', message: 'Message', placeholder: 'Tell me about your project...', send: 'Send Message', sending: 'Sending...', success: '✓ Message sent successfully!', successMsg: "I'll get back to you soon." },
    footer: { copyright: 'Built with', and: '&' },
    blog: { title: 'SYSTEM LOGS', readMore: 'Read More →' }
  },
  id: {
    nav: { home: 'Beranda', projects: 'Proyek', blog: 'Blog', contact: 'Kontak' },
    hero: { title: 'FRONTEND ENGINEER', subtitle: '& FULLSTACK DEVELOPER', description: 'Membangun pengalaman digital di persimpangan desain berani dan engineering yang ketat.', cta: 'Jelajahi Sistem' },
    about: { title: 'TENTANG SAYA', description1: 'Saya membangun pengalaman digital yang hidup di persimpangan desain berani dan engineering yang ketat. Sebagai Frontend Engineer dan Web Developer Fullstack, saya tidak mau berkompromi dengan antarmuka generik.', description2: 'Baik itu situs statis yang super cepat atau aplikasi web yang kompleks, saya membuat solusi yang menarik perhatian dan berkinerja sempurna. Saya bersemangat tentang integrasi AI, teknologi web modern, dan membangun sistem yang scalable.', cta: 'Baca Blog Saya' },
    projects: { title: 'PROYEK UNGGULAN', description: 'Pilihan proyek yang menampilkan keahlian saya dalam pengembangan frontend, integrasi AI, dan engineering full-stack.', viewProject: 'Lihat Proyek →', project1: { title: 'AI Chat Interface', description: 'Aplikasi chat real-time bertenaga Claude API dengan streaming response dan riwayat percakapan.' }, project2: { title: 'Hermes Portfolio', description: 'Portfolio pribadi dibangun dengan Astro, menampilkan blog bertenaka AI dan showcase proyek.' }, project3: { title: 'OpenRouter Dashboard', description: 'Dashboard untuk mengelola multiple LLM API melalui OpenRouter dengan tracking cost dan perbandingan model.' }, project4: { title: 'AI Content Generator', description: 'Tool generasi konten otomatis menggunakan multiple model AI dengan scoring kualitas dan optimasi.' }, project5: { title: 'Smart Form Builder', description: 'Form builder bertenaga AI dengan intelligent field suggestions dan validasi menggunakan machine learning.' }, project6: { title: 'Code Review Assistant', description: 'Tool code review otomatis yang menganalisis pull request dan menyarankan improvement menggunakan Claude.' } },
    contact: { title: 'MARI BERKOLABORASI', description: 'Punya proyek di pikiran? Mari kita buat sesuatu yang luar biasa bersama. Hubungi saya dan mari kita bicara.', email: 'Email', message: 'Pesan', placeholder: 'Ceritakan tentang proyek Anda...', send: 'Kirim Pesan', sending: 'Mengirim...', success: '✓ Pesan berhasil dikirim!', successMsg: 'Saya akan segera menghubungi Anda.' },
    footer: { copyright: 'Dibangun dengan', and: '&' },
    blog: { title: 'LOG SISTEM', readMore: 'Baca Selengkapnya →' }
  }
};

export function getTranslation(lang, key) {
  const dict = translations[lang] || translations.en;
  const keys = key.split('.');
  let value = dict;
  for (const k of keys) {
    if (value == null) return key;
    value = value[k];
  }
  return value != null ? value : key;
}