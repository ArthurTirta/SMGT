import { Children } from "react";

// index.js
export const servicesData = [
  {
    title: "FullStack Development",
    description:
      "Your business deserves a fast, secure, and future-proof digital foundation. I develop custom web apps with clean architecture, optimized databases, and seamless integrations—ensuring reliability at every layer.",
    items: [
      {
        title: "Backend Engineering",
        description: "(REST APIs,Express JS, Javascript, PHP)",
      },
      {
        title: "Frontend Excellence",
        description: "(React, Interactive UI/UX)",
      },
      {
        title: "Database Design",
        description: "(SQL)",
      },
    ],
  },
  // {
  //   title: "DevOps & Cloud Solutions",
  //   description:
  //     "Deploying software shouldn't be a gamble. I automate infrastructure, enforce security, and leverage cloud platforms (AWS/Azure) to keep your app running smoothly—24/7, at any scale.",
  //   items: [
  //     {
  //       title: "CI/CD Pipelines",
  //       description: "(GitHub Actions, Docker, Kubernetes)",
  //     },
  //     {
  //       title: "Server Management ",
  //       description: "(Linux, Nginx, Load Balancing)",
  //     },
  //     {
  //       title: "Performance Tuning",
  //       description: "(Caching, Compression, Lighthouse 90+ Scores)",
  //     },
  //   ],
  // },
  // {
  //   title: "Security & Optimization",
  //   description:
  //     "Slow or hacked apps destroy trust. I harden security (XSS/SQLI protection, OAuth) and optimize bottlenecks so your app stays fast, safe, and scalable as you grow.",
  //   items: [
  //     {
  //       title: "Code Audits",
  //       description: "(Refactoring, Tech Debt Cleanup)",
  //     },
  //     {
  //       title: "Pen Testing",
  //       description: "(Vulnerability Assessments)",
  //     },
  //     {
  //       title: "SEO Tech Stack",
  //       description: "(SSR, Metadata, Structured Data)",
  //     },
  //   ],
  // },
  // {
  //   title: "Website Apps",
  //   description:
  //     "A clunky interface can sink even the best ideas. I craft responsive, pixel perfect web and mobile apps (React Native/Flutter) that users love—bridging design and functionality seamlessly.",
  //   items: [
  //     {
  //       title: "Cross-Platform Apps",
  //       description: "(Single codebase for iOS/Android/Web)",
  //     },
  //     {
  //       title: "PWAs",
  //       description: "(Offline mode, Push Notifications)",
  //     },
  //     {
  //       title: "E-Commerce",
  //       description: "(Checkout flows, Payment Gateways, Inventory APIs)",
  //     },
  //   ],
  // },
];
export const projects = [
  {
    id: 1,
    name: "Mobile Accessories E-commerce",
    description:
      "An online store specializing in phone accessories including cases, chargers, cables, and power banks with MagSafe compatibility.",
    href: "",
    image: "/assets/projects/mobile-accessories-store.jpg",
    bgImage: "/assets/backgrounds/blanket.jpg",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Next.js" },
      { id: 3, name: "Node.js" },
      { id: 4, name: "MongoDB" },
      { id: 5, name: "Tailwind CSS" },
    ],
  },
  {
    id: 2,
    name: "Plant Shop E-commerce",
    description:
      "An online store specializing in rare and decorative plants with a clean, user-friendly interface.",
    href: "",
    image: "/assets/projects/plant-shop.jpg",
    bgImage: "/assets/backgrounds/curtains.jpg",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Next.js" },
      { id: 3, name: "Stripe API" },
      { id: 4, name: "Tailwind CSS" },
    ],
  },
  {
    id: 3,
    name: "Apple Tech Marketplace",
    description:
      "An e-commerce platform for Apple products and accessories with deals and category filtering.",
    href: "",
    image: "/assets/projects/apple-tech-store.jpg",
    bgImage: "/assets/backgrounds/map.jpg",
    frameworks: [
      { id: 1, name: "Blazor" },
      { id: 2, name: "ASP.NET Core" },
      { id: 3, name: "SQL Server" },
      { id: 4, name: "Bootstrap" },
    ],
  },
  {
    id: 4,
    name: "Electronics & Gadgets Store",
    description:
      "A multi-category online shop featuring electronics, home appliances, and gaming gear with special offers.",
    href: "",
    image: "/assets/projects/electronics-store.jpg",
    bgImage: "/assets/backgrounds/poster.jpg",
    frameworks: [
      { id: 1, name: "Vue.js" },
      { id: 2, name: "Laravel" },
      { id: 3, name: "MySQL" },
      { id: 4, name: "SCSS" },
    ],
  },
  {
    id: 5,
    name: "Home Decor Marketplace",
    description:
      "A curated collection of designer home decor items, including furniture and artisan vases.",
    href: "",
    image: "/assets/projects/home-decor-store.jpg",
    bgImage: "/assets/backgrounds/table.jpg",
    frameworks: [
      { id: 1, name: "Angular" },
      { id: 2, name: "Firebase" },
      { id: 3, name: "GraphQL" },
      { id: 4, name: "Material UI" },
    ],
  },
  {
    id: 6,
    name: "Digital Game Store",
    description:
      "A gaming platform featuring discounted titles, top sellers, and genre-based browsing.",
    href: "",
    image: "/assets/projects/game-store.jpg",
    bgImage: "/assets/backgrounds/curtains.jpg",
    frameworks: [
      { id: 1, name: "Svelte" },
      { id: 2, name: "Node.js" },
      { id: 3, name: "MongoDB" },
      { id: 4, name: "Chakra UI" },
    ],
  },
];
export const kontak = [
  { name: "Instagram", title:"@smgtpnielmanggar", href: "https://www.instagram.com/smgtpnielmanggar/", gambar: "../src/assets/icons/instagram.svg" },
  // { name: "LinkedIn",title: "Arthur Tirtajaya Jehuda", href: "https://www.linkedin.com/in/arthur-tirtajaya/", gambar: "/src/assets/linkedin.svg"},
  // { name: "GitHub",title:"ArthurTirta", href: "https://github.com/ArthurTirta",gambar: "/src/assets/github.svg"  },
  { name: "Gmail",title:"smgtjemaatpnielmanggar@gmail.com", 
    // href:"",
    gambar: "../src/assets/icons/icons8-gmail.svg"  },
];

export const kelas = [
  {
    name : "Toddlers",
    age: "0-5",
    description: "Interactive Bible stories, songs, and playtime to introduce toddlers to God's love. Our toddler program introduces young children to the love of God through fun activities and stories.",
     image: "/src/assets/Indria.jpg"
  },
  {
    name: " Preteens",
    age: "5-11",
    description: "Engaging lessons, crafts, and games that teach biblical values and encourage friendship. Our young children's classes focus on building a strong foundation of faith through interactive lessons and activities.",
    image: "/src/assets/bb.jpg"
  },
  {
    name : "Teenagers",
    age : "11-14",
    description: "Dynamic discussions, service projects, and mentorship to help teens navigate faith and life. Our youth group provides a supportive community where teenagers can explore their faith and develop leadership skills.",
     image: "/src/assets/xbesar.jpg"
  },
  {
    name : "Old Children",
    age : "14-18",
    description: "In-depth Bible studies, leadership opportunities, and mission trips to empower young adults in their faith journey. Our young adult ministry offers opportunities for spiritual growth and service through Bible studies and outreach programs.",
    image: "/src/assets/remaja.jpg"
  }
]