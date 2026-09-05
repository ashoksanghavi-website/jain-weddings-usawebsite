/**
 * Single source of truth for every word of copy, every image URL and every list
 * used across the site. Components must not hardcode copy.
 */

// Images are served locally from public/wp so the site never depends on the old
// WordPress host (which now 403s hotlinks and is being replaced by this site).
export const IMG = "/wp";

export const LOGO = "/logo.png";

/**
 * The hero still. The old ceremony .mp4 lived only on the WordPress host, which
 * now blocks it (403), so the hero shows this poster. Add a local mp4 path here
 * to bring motion back.
 */
export const heroVideo = {
  mp4: "",
  poster: `${IMG}/revslider/slaido_96/fire-indian-wedding.jpg`,
};

export const site = {
  brand: "Jain Weddings USA",
  phone: "1-866-800-4771",
  phoneHref: "tel:+18668004771",
  email: "info@jainweddingusa.com",
  location: "Elkhart, Indiana",
  tagline: "Ordained Minister and Jain Vidhikar, Elkhart, Indiana",
  copyright: "Copyright 2026 Jain Weddings USA",
  signatory: "Ashok Hiralal Sanghavi, Ordained Minister and Jain Vidhikar",
};

export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/ashokhsanghavi", icon: "facebook" },
  { label: "X", href: "https://twitter.com/ahsanghavi", icon: "x" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCKQY104dl5ayRbBkSPjtqLQ/videos",
    icon: "youtube",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/jainweddingsusa/",
    icon: "instagram",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ashok-hiralal-sanghavi-8778976/",
    icon: "linkedin",
  },
  { label: "Jain Pooja", href: "https://jainpooja.com/", icon: "link" },
] as const;

export const routes = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/wedding-rituals", label: "Wedding Rituals" },
  { to: "/wedding-gallery", label: "Wedding Gallery" },
  { to: "/other-services", label: "Other Services" },
  { to: "/contact", label: "Contact" },
] as const;

export const weddingMenu = [
  {
    to: "/wedding-rituals",
    title: "Wedding Rituals",
    description: "Twelve rituals, each explained as it happens",
    thumb: `${IMG}/2020/06/m-fera.jpg`,
  },
  {
    to: "/wedding-gallery",
    title: "Wedding Gallery",
    description: "Photographs and films from ceremonies across North America",
    thumb: `${IMG}/2025/10/IMG_8650-400x284.jpg`,
  },
] as const;

export const servicesMenu = [
  { label: "Poojans and Rituals", to: "/other-services", external: false },
  { label: "Jain Pooja", to: "https://jainpooja.com/", external: true },
] as const;

export const meta = {
  home: {
    title: "Jain Wedding Ceremony | Ashok Sanghavi, Jain Vidhikar, USA",
    description:
      "The Jain wedding ceremony is a grand public proclamation made with the intention of the bride and groom to live together for their entire lives. All rituals explained in English, followed by Sanskrit hymns.",
  },
  about: {
    title: "About Ashok Sanghavi | Jain Weddings USA",
    description:
      "Ordained Minister and Jain Vidhikar. In the United States since 1987, performing weddings and poojas across North America.",
  },
  rituals: {
    title: "Jain Wedding Rituals and Traditions | Jain Weddings USA",
    description:
      "Twelve rituals, each with symbolic, philosophical and spiritual meaning, explained in English at the ceremony itself.",
  },
  gallery: {
    title: "Wedding Gallery | Jain Weddings USA",
    description: "Photographs and films from Jain ceremonies performed across North America.",
  },
  services: {
    title: "Poojans and Rituals | Jain Weddings USA",
    description: "Beside wedding rituals we perform many other Jain Poojans and Rituals.",
  },
  contact: {
    title: "Contact | Jain Weddings USA",
    description:
      "Call 1-866-800-4771 for consultation. Ashok travels to any domestic and international destination.",
  },
};

export const images = {
  hero: {
    src: `${IMG}/revslider/slaido_96/indian-wedding-photography-groom-bride-hands_96696-793.jpg`,
    alt: "The hands of the bride and groom during the ceremony",
  },
  heroSideA: { src: `${IMG}/2020/06/2-1.jpg`, alt: "A Jain wedding celebration" },
  heroSideB: {
    src: `${IMG}/revslider/slaido_96/fire-indian-wedding.jpg`,
    alt: "The sacred fire at the mandap",
  },
  celebration: {
    src: "/rituals/celebration.jpg",
    alt: "The baraat arriving, with the groom leading the procession",
  },
  ganesh: { src: `${IMG}/2020/06/ganeshji1-scaled.jpg`, alt: "Ganesh Pooja before the wedding" },
  puja: { src: `${IMG}/2020/06/puja-scaled.jpg`, alt: "Dev Guru Shastra Pooja" },
  mandap: {
    src: `${IMG}/2020/06/asian-wedding-photographer-leicester-226pp_w768_h512.jpg`,
    alt: "Mandap Muhrat, grounding the energies",
  },
  vidhikar: { src: `${IMG}/2020/06/photo-1.png`, alt: "Ashok Sanghavi, Jain Vidhikar" },
  aboutPortrait: {
    src: `${IMG}/2020/06/JW_Ashok_Sanghavi_Vidhikar.png`,
    alt: "Ashok Sanghavi, Ordained Minister",
  },
  certificate: { src: `${IMG}/2020/06/ordination-certificate.jpg`, alt: "Ordination certificate" },
  aboutMission: { src: `${IMG}/2020/06/JW_aboutusimg4-1.jpg`, alt: "A Jain wedding ceremony" },
  contactBand: {
    src: `${IMG}/2020/06/asian-wedding-photographer-leicester-226pp_w768_h512.jpg`,
    alt: "",
  },
};

export type Ritual = {
  number: string;
  name: string;
  meaning: string;
  image: string;
  sa: string;
  body: string;
};

export const rituals: Ritual[] = [
  {
    number: "01",
    name: "Var Aagaman",
    sa: "वर आगमन",
    body: "The groom and his family arrive and are received at the door. Nothing has formally begun yet, and that is deliberate. Two households meet as families first, before either becomes anything else to the other.",
    meaning: "Arrival of Groom",
    image: `${IMG}/2020/06/Skype_Picture_2020_06_15T16_29_44_533Z-scaled.jpeg`,
  },
  {
    number: "02",
    name: "Mangala Charan",
    sa: "मंगलाचरण",
    body: "The opening invocation. The Navkar Mantra is recited, which belongs to no single person and asks nothing for itself. Everything that follows is built on top of it.",
    meaning: "Commencement of Rituals",
    image: `${IMG}/2025/07/IMG_8618.jpg`,
  },
  {
    number: "03",
    name: "Mangal Tilak",
    sa: "मंगल तिलक",
    body: "The bride's mother marks the groom's forehead and welcomes him in. A small act, and the first time the two households formally accept one another in front of witnesses.",
    meaning: "Receiving Groom",
    image: `${IMG}/2025/07/IMG_7281-scaled.jpg`,
  },
  {
    number: "04",
    name: "Haldi",
    sa: "नवग्रह पूजन",
    body: "Reverence is offered to the nine grahas and the ten dikpals, so the ceremony is placed inside something older and larger than the couple standing in it.",
    meaning: "Nav Grah and Dash Dikpal Poojan",
    image: "/rituals/haldi.jpg",
  },
  {
    number: "05",
    name: "Anatrpat",
    sa: "अंतरपट",
    body: "A cloth is held between them and then lowered. They see each other for the first time as two people about to be married rather than two people who are not. Everyone in the room feels the moment change.",
    meaning: "Arrival of Bride",
    image: `${IMG}/2020/06/dan.jpg`,
  },
  {
    number: "06",
    name: "Kanya Daan",
    sa: "कन्यादान",
    body: "The parents place their daughter's hand into the groom's. This is the rite most often performed without explanation, and it is the one families most often thank me for explaining.",
    meaning: "Giving Away Bride",
    image: "/rituals/kanya-daan.jpg",
  },
  {
    number: "07",
    name: "Chheda Bandhan",
    sa: "छेड़ा बंधन",
    body: "The ends of their garments are tied together. From this point the two of them move as one, physically, in front of everybody, and the knot is not undone for the rest of the ceremony.",
    meaning: "Holy Knot",
    image: `${IMG}/2020/06/amish-thakkar-EiGfP6DxgN8-unsplash-scaled.jpg`,
  },
  {
    number: "08",
    name: "Var Malla Hasta Melap",
    sa: "हस्तमेलाप",
    body: "Garlands are exchanged and hands are joined. Each of them chooses and places the garland freely, which matters a great deal more than it appears to.",
    meaning: "Union of Hands and Hearts",
    image: `${IMG}/2020/06/m-fera.jpg`,
  },
  {
    number: "09",
    name: "Mangal Phera",
    sa: "मंगल फेरा",
    body: "The heart of a Jain wedding. The couple circles the sacred fire, and each round carries its own promise about how they will live, what they will build, and what they will refuse to do to one another.",
    meaning: "Circling Universal Energy",
    image: `${IMG}/2020/06/feraq.jpg`,
  },
  {
    number: "10",
    name: "Sindoor and Mangal Sutra",
    sa: "मंगल सूत्र",
    body: "The visible marks of the marriage are given. From here it is no longer a private understanding between two people. It is a public fact, and the community that witnessed it now shares responsibility for it.",
    meaning: "Exchanging Vows",
    image: `${IMG}/2020/06/sindoor1.jpg`,
  },
  {
    number: "11",
    name: "Kansar",
    sa: "कंसार",
    body: "They eat together for the first time as a married couple. Feeding each other is the plainest promise in the whole ceremony, and the one that will be kept most often, on ordinary days, when nobody is watching.",
    meaning: "First Sweet Meal",
    image: `${IMG}/2020/06/kans.png`,
  },
  {
    number: "12",
    name: "Akhand Saubhagyavati",
    sa: "अखंड सौभाग्यवती",
    body: "The married women of both families bless the bride and offer counsel. The ceremony ends with the people who have already lived it, which is the right place for it to end.",
    meaning: "Advice from Married Women",
    image: `${IMG}/2020/06/advice.jpg`,
  },
];

export type GalleryItem = { full: string; thumb: string; caption: string };

export const gallery: GalleryItem[] = [
  {
    full: `${IMG}/2025/10/IMG_5822-scaled.jpg`,
    thumb: `${IMG}/2025/10/IMG_5822-400x284.jpg`,
    caption: "Blessing the couple",
  },
  {
    full: `${IMG}/2025/10/IMG_8650-scaled.jpg`,
    thumb: `${IMG}/2025/10/IMG_8650-400x284.jpg`,
    caption: "Pranav and Priya",
  },
  {
    full: `${IMG}/2025/07/IMG_7281-scaled.jpg`,
    thumb: `${IMG}/2025/07/IMG_7281-400x284.jpg`,
    caption: "Mangal Tilak",
  },
  {
    full: `${IMG}/2020/06/8-3.jpg`,
    thumb: `${IMG}/2020/06/8-3-400x284.jpg`,
    caption: "Shruti and Rishabh",
  },
  {
    full: `${IMG}/2025/10/IMG_8611-scaled.jpg`,
    thumb: `${IMG}/2025/10/IMG_8611-400x284.jpg`,
    caption: "At the mandap",
  },
  {
    full: `${IMG}/2025/10/IMG_8619-scaled.jpg`,
    thumb: `${IMG}/2025/10/IMG_8619-400x284.jpg`,
    caption: "The ceremony",
  },
  {
    full: `${IMG}/2025/10/IMG_8595-scaled.jpg`,
    thumb: `${IMG}/2025/10/IMG_8595-400x284.jpg`,
    caption: "Family blessings",
  },
  {
    full: `${IMG}/2025/10/IMG_5863-scaled.jpg`,
    thumb: `${IMG}/2025/10/IMG_5863-400x284.jpg`,
    caption: "Around the sacred fire",
  },
  {
    full: `${IMG}/2020/06/2.jpg`,
    thumb: `${IMG}/2020/06/2.jpg`,
    caption: "Jain rituals and customs",
  },
  {
    full: `${IMG}/revslider/slaido_96/e7d6312076c96c1fc8a1207f976e3591-scaled.jpg`,
    thumb: `${IMG}/revslider/slaido_96/e7d6312076c96c1fc8a1207f976e3591-scaled.jpg`,
    caption: "Traditions and customs",
  },
  {
    full: `${IMG}/2020/06/Skype_Picture_2020_06_15T16_29_44_560Z.jpeg`,
    thumb: `${IMG}/2020/06/Skype_Picture_2020_06_15T16_29_44_560Z.jpeg`,
    caption: "Var Aagaman",
  },
  {
    full: `${IMG}/2020/06/Skype_Picture_2020_06_15T16_29_44_562Z.jpeg`,
    thumb: `${IMG}/2020/06/Skype_Picture_2020_06_15T16_29_44_562Z.jpeg`,
    caption: "Ceremony moments",
  },
];

export const films = [
  { src: `${IMG}/2022/01/VIDEO-2021-11-20-20-31-39-2.mp4`, title: "A ceremony in full" },
  { src: `${IMG}/2022/01/VIDEO-2022-01-16-17-07-52-1.mp4`, title: "Blessings and vows" },
];

export const home = {
  kicker: "JAIN WEDDING CEREMONY, UNITED STATES",
  h1a: "A wedding is a poetry",
  h1b: "of love and celebration.",
  intro:
    "When two hearts become one in a ritual to create love, peace, harmony, joy, and abundance. I love to be part of that creation.",
  primaryCta: "Contact us",
  arrowCta: "See the twelve rituals",
  heroCaption: "THE MANDAP, ELKHART, INDIANA AND EVERYWHERE ELSE",
  heroSecondary: "See the wedding gallery",
  heroNote: "Every ritual explained in English before it is performed.",
  facts: [
    "IN THE UNITED STATES SINCE 1987",
    "ORDAINED MINISTER AND JAIN VIDHIKAR",
    "CEREMONIES ACROSS NORTH AMERICA",
  ],
  celebration: {
    kicker: "CELEBRATION OF JAIN WEDDING",
    h2: "Every step carries a meaning of its own",
    paragraphs: [
      "The Jain wedding ceremony is a grand public proclamation made with the intention of the bride and groom to live together for their entire lives.",
      "The Traditional Jain wedding ceremony is a religious ritual solemnized in accordance with Jain Scriptures. Each step in the ceremony has symbolic, philosophical, and spiritual meaning.",
    ],
    quote: "All rituals are explained in English, followed by Sanskrit hymns and mantras.",
    arrow: "See the rituals",
  },
  ceremonies: [
    {
      number: "01",
      title: "Ganesh Pooja",
      image: images.ganesh,
      body: [
        "Ganesh Pooja is also known as Ganesha Sthapan. This is the beginning of the wedding ceremonies and rituals. The family offers prayers to Ganesha, as Lord Ganesha is considered the symbol of good luck, wisdom, and peace. Both families conduct Ganesh Pooja at their homes before the wedding.",
      ],
      verse: [] as string[],
    },
    {
      number: "02",
      title: "Dev Guru Shashtra Pooja",
      image: images.puja,
      verse: [
        "Keval Ravi kirano se jiska, sampoorna prakashit hai antar",
        "Us shri Jinvaani mai hota tattvon ka sundartam darshan",
        "Sad darshan, bodhacharn path pe r aviral jo badtey hain munigan",
        "Unn Dev, param Aagam, Guru ko shat shat vandan, shat shat vandan",
      ],
      body: [
        "I bow down hundreds of times to Dev, Shastra and Guru. The Dev is the one who is illuminated with the light of the sun of keval gyaan. The Shastra is the words of the kevali dev in which all the tattvas or realities are described in a beautiful way. And the Guru is the one who walks continuously on the path of right faith, right knowledge and right conduct.",
      ],
    },
    {
      number: "03",
      title: "Mandap Muhrat",
      image: images.mandap,
      verse: [] as string[],
      body: [
        "This ceremony has a deep religious significance because the couple and their loved ones seek the blessings of Mother Earth. This is a ceremony to ground their energies with the symbolic Manek Stambh.",
      ],
    },
  ],
  vidhikar: {
    kicker: "THE VIDHIKAR",
    h2: "Time flies when you are having fun",
    paragraphs: [
      "A Jain wedding ceremony incorporates every aspect of a marriage. One of the most beautiful ceremonies you will ever witness, performing all the rituals with a Jain Vidhikar takes time. I bring great energy to an Indian Jain wedding. The ceremony is professional yet light hearted and fun filled, and will keep you so engaged at the wedding that you will soon understand why time flies.",
      "I live in Elkhart, Indiana and travel to any domestic and international destination. Jain weddings and pre wedding ceremonies are performed in such a way that everyone present can understand and enjoy the ceremony in English, with Sanskrit as the basis of the ceremonial scriptures.",
      "I provide information and educate the couple during the planning process. I convey my knowledge in person, by phone, email and WhatsApp, with detailed planning of their ceremony to make sure it is the exact ceremony they want. I do everything I can to make sure that the part I play in the most important day in the couple's life is perfect.",
      "Members of the Jain community are looking for Jain priests who can perform weddings, pujas, and poojans in a way that not only combines knowledge and rituals, but most importantly, the ability to communicate with and involve everyone present.",
    ],
    signature: "Ashok Sanghavi",
    signatureRole: "ORDAINED MINISTER, JAIN VIDHIKAR",
  },
  marquee: ["Love", "Harmony", "Peace", "Joy", "Abundance", "Unconditional Love"],
  corridorLine: "Every one of these was a blessing being given.",
  corridorArrow: "See the wedding gallery",
  ritualsArrow: "View the complete list of rituals",
};

export const testimonials = [
  {
    quote:
      "Words cannot express how blessed we feel to have found you and to have you perform our wedding ceremony. It was the most heartfelt and touching ceremony that could not have happened unless you were a part of it. Thank you for giving us the best gift that we will cherish for our whole lives.",
    name: "Shruti Kankaria and Rishabh Jain",
  },
  {
    quote:
      "Ashok uncle just performed a few wedding rituals, and did a wonderful job. He has a loving personality and does an excellent job of including everyone in the family. Thanks for helping us to make our day memorable.",
    name: "Vrunda and Raj",
  },
  {
    quote:
      "You brought so much joy and humour to the ceremony. And your love for the grooms was so evident. Thank you and God bless.",
    name: "Betsy Kim",
  },
  {
    quote:
      "You did such a wonderful job. Thank you for creating an experience that reached us all.",
    name: "Ben Lenet",
  },
  {
    quote:
      "It is all about love, love, and unconditional love. We have no words to express our gratitude for your blessings in our life.",
    name: "Dolly and Jay",
  },
  {
    quote:
      "Your blessings, guidance, and intention throughout the whole wedding process was amazing and we truly cannot thank you enough. You were so patient with us and helped guide us to make this such a beautiful memory.",
    name: "Satish and family",
  },
];

export const about = {
  kicker: "ABOUT US",
  h1: "Abundance comes to those who are blessed",
  line: "Ashok Hiralal Sanghavi, Ordained Minister and Jain Vidhikar.",
  paragraphs: [
    "Hi, I am Ashok. I am happily married with two children and live in Indiana.",
    "I came to the United States in 1987 and brought with me a rich knowledge of Eastern philosophy. Over the years, I synthesized that philosophy with Western values and started to teach meditation and inner reflection.",
    "By profession, I am a financial planner, and I love bringing peace of mind to my clients by protecting their assets and helping them grow their wealth. I always bring a touch of my spiritual teachings to my professional work, and I know my clients appreciate having a financial advisor that sometimes serves as a spiritual advisor.",
    "With respect to degrees, I am a Certified Financial Planner, and I have also completed my Certified Public Accountant qualification. I am a Chartered Accountant from India. In addition, I have also achieved certifications of Chartered Life Underwriter and Chartered Financial Consultant.",
    "I have clients all over the United States. Currently I am working with clients in Indiana, Illinois, Michigan, California, Ohio, Wisconsin, Missouri, New Jersey, New York, and Georgia on various financial planning aspects.",
    "I have also performed poojas and weddings all over North America for many Jain Sanghs, societies, private homes and businesses.",
  ],
  quote:
    "A wedding ceremony is a poetry of love and celebration when two hearts become one. I love to be part of that creation.",
  factsHeading: "In short",
  facts: [
    { k: "Role", v: "Ordained Minister and Jain Vidhikar" },
    { k: "Based", v: "Elkhart, Indiana" },
    { k: "Travel", v: "Any domestic or international destination" },
    { k: "In the USA since", v: "1987" },
    { k: "Qualifications", v: "CFP, CPA, ChFC, CLU, Chartered Accountant" },
    { k: "Also performs", v: "Poojans for sanghs, homes and businesses" },
  ],
  notBusiness:
    "I offer Jain wedding services as grace, and to maintain the traditions and values of Jain weddings. This is not a business or a professional venture for me.",
  mission: {
    kicker: "MISSION STATEMENT",
    h2: "Merging both ends of the world",
    lead: "Indian values and Western culture, held together rather than traded against each other.",
    body: "Work is important, but even with my busy work life, my goal is to bless Jain youth getting married in North America and India with Indian values and Western culture, merging both ends of the world and making it universal.",
    pillars: [
      {
        num: "01",
        title: "Said in English",
        body: "Every rite is explained in plain English before it is performed, so nobody in the room is following along by watching the person next to them.",
      },
      {
        num: "02",
        title: "Rooted in Sanskrit",
        body: "The hymns and mantras themselves are unchanged. The meaning is opened up; the ceremony is not simplified or shortened to make that easier.",
      },
      {
        num: "03",
        title: "Made universal",
        body: "Interfaith families, guests who have never sat at a mandap, grandparents who have sat at forty. All of them should leave having understood the same thing.",
      },
    ],
  },
  footerBlessing: "णमो अरिहंताणं",
  footerBlessingEn: "I BOW TO THE ENLIGHTENED ONES",
  footerBio:
    "Hi, I am Ashok. I am happily married with two children and live in Indiana. I came to the United States in 1987 and brought with me a rich knowledge of Eastern philosophy.",
};

/** Small enquiry cards attached to the three homepage ceremony rows. */
export const ceremonyEnquiry = {
  cta: "Ask about this ceremony",
  eyebrow: "WITH BLESSINGS",
  intro: "Send the date and the city. Ashok replies himself, usually within two days.",
  nameLabel: "Your name",
  emailLabel: "Email",
  dateLabel: "Wedding date",
  submit: "Send this to Ashok",
  cancel: "Not right now",
  sent: "Your email app should have opened with the details ready to send. If nothing happened, write to info@jainweddingusa.com or call 1-866-800-4771.",
  notes: {
    "01": "Ganesh Pooja is usually held at both homes on the days before the wedding. Tell me the dates and I will confirm what each household needs to have ready.",
    "02": "The Mandap Muhrat grounds the ceremony to the place it is held in. If your venue is outdoors or unusual, mention it and we will plan around it.",
    "03": "Var Aagaman sets the tone for everything after it. Let me know roughly how many people will be arriving with the groom.",
  } as Record<string, string>,
};

export const ritualsPage = {
  opening:
    "The Traditional Jain wedding ceremony is a religious ritual solemnised in accordance with Jain scriptures. Each rite carries symbolic, philosophical and spiritual meaning, and the order of them is not decorative. What follows is every rite in the order it is conducted, with what it is actually asking for said plainly beside it.",
  indexHeading: "The ceremony, ritual by ritual",
  indexLine: "Twelve rites. Choose any one to read what it means.",
  kicker: "RITUALS, TRADITIONS AND CUSTOMS",
  h1: "Simple yet stunning traditions that make it magical",
  line: "Twelve rituals, each with symbolic, philosophical and spiritual meaning, explained in English and followed by Sanskrit hymns and mantras.",
  panel: {
    kicker: "A SERVICE TO OUR KIDS AND COMMUNITY",
    h2: "Start your divine union with spiritual guidance and blessings",
    body: "We offer Jain wedding services as a blessing and to maintain traditions and values of Jain weddings.",
  },
};

export const galleryPage = {
  kicker: "CAPTURING THE MOMENT",
  h1: "I want to bless young people who start a new life",
  line: "I offer Jain wedding services as grace and to maintain traditions and values of Jain weddings. This is not a business or a professional venture for me.",
  folderName: "Jain Weddings, our favourites",
  dragHint: "Swipe or drag the reel, then tap a photograph to open it",
  occasionsHeading: "By occasion",
  occasionsLine:
    "Five ceremonies, in five different states, across five different kinds of family. Choose one to see what that day actually looked like.",
  occasions: [
    {
      couple: "Karishma and Ashwin",
      place: "Chicago, Illinois",
      season: "Summer",
      note: "A full Vidhi with both families taking part in the Kanya Daan, and a Mangal Phera the guests followed round by round.",
      image: `${IMG}/2025/10/IMG_8611-scaled.jpg`,
    },
    {
      couple: "Keshav and Kritika",
      place: "Detroit, Michigan",
      season: "Autumn",
      note: "Ganesh Pooja at both homes on separate days, then the ceremony itself with the meaning of every rite said aloud in English.",
      image: `${IMG}/2025/10/IMG_8619-scaled.jpg`,
    },
    {
      couple: "Lin and Jirsa",
      place: "California",
      season: "Spring",
      note: "An interfaith ceremony, shaped with the other officiant so both traditions were carried properly rather than reduced to a gesture.",
      image: `${IMG}/2025/10/IMG_8595-scaled.jpg`,
    },
    {
      couple: "Pranav and Priya",
      place: "Indiana",
      season: "Winter",
      note: "A smaller gathering, held indoors, with the whole family close enough to the fire to see what was happening at every step.",
      image: `${IMG}/2025/10/IMG_8650-scaled.jpg`,
    },
    {
      couple: "Shruti and Rishabh",
      place: "New Jersey",
      season: "Summer",
      note: "The ceremony that produced the first note on this page. Parents flown in from three countries, and every one of them followed it.",
      image: `${IMG}/2020/06/8-3.jpg`,
    },
  ],
  mosaicHeading: "Every photograph",
  mosaicLine:
    "Twelve moments from ceremonies across North America. Open any one of them to see it full size, and use the arrows to move through the set.",
  filmsHeading: "Films from the mandap",
  filmsLine:
    "Two short films, recorded by the families themselves and shared here with their permission. Neither is edited, which is rather the point.",
};

export const servicesPage = {
  kicker: "OTHER SERVICES",
  h1: "Poojans and Rituals",
  line: "It has been a pleasure and honour for me to serve our community by performing Jain religious Poojans and Rituals ceremonies.",
  paragraphs: [
    "It is my priority to make each function as stress free and enjoyable for everyone involved by being organized, punctual, easy to work with, and respectful.",
    "Beside wedding rituals we perform many other Jain Pooja, Poojans and Rituals.",
  ],
  quote: "Siddhachakra Poojan. Siddha refers to a liberated soul, while chakra means wheel.",
  afterQuote: [
    "It is believed that worshiping Siddhachakra results in freedom from the cycles of life and death within a universal wheel known as Sansar Chakra, and leads to the freedom called Mokhsha. This freedom is freedom from Karma, Thoughts, Emotions, Feelings and Body. One becomes Omnipotent, Omniscient and Omnipresent.",
    "There are Navapada in this Siddha Chakra. Navapada means nine petals in reference to the centre of the yantra. It also represents nine steps to attain the final step to become Siddha. The journey starts with Right Information, Samyak Darshan, Right Knowledge, Gyan, Right Conduct, Charitra, and Tapas. Here one moves through stages of Sadhana as Sadhu, slowly grows to become Arihant, and finally attains Siddha Pada. This is a very powerful combination of Mantra, Tantra and Yantra which enlightens the spirit within.",
  ],
  listHeading: "Every poojan we perform",
  listLine:
    "Fourteen ceremonies, performed for sanghs, societies, private homes and businesses across North America. Open any one of them to read what it is for and how long it runs.",
  cardCta: "Read what this is for",
  omLine: "Not on this list? Most ceremonies can be arranged. Tell me what the occasion is.",
  omCta: "Ask about a ceremony",
  poojans: [
    {
      number: "01",
      name: "Shri Siddha Chakra Maha Poojan",
      sub: "The nine petals",
      duration: "Three to four hours",
      setting: "Sangh or derasar",
      summary: "The best known of the maha poojans, and the one asked for most often.",
      body: [
        "Siddha refers to a liberated soul and chakra means wheel. Worshipping the Siddhachakra is held to bring freedom from the cycle of life and death inside the universal wheel known as Sansar Chakra, and to lead towards Moksha.",
        "Navapada means nine petals, in reference to the centre of the yantra. It also represents the nine steps to becoming Siddha, beginning with right faith, right knowledge and right conduct, and with tapas.",
      ],
      note: "A powerful combination of mantra, tantra and yantra.",
    },
    {
      number: "02",
      name: "Shree Parshwa Padmavati Maha Poojan",
      sub: "For protection",
      duration: "Two to three hours",
      setting: "Sangh, home or business",
      summary: "Performed when a family or a sangh is asking for obstacles to be cleared.",
      body: [
        "Devotion to Bhagwan Parshwanath together with Padmavati Devi, invoked for protection and for the removal of what is standing in the way.",
        "Families often ask for this before something significant begins, a new business, a move, or a year that already looks difficult.",
      ],
      note: "Frequently paired with a Snatra Pooja on the same day.",
    },
    {
      number: "03",
      name: "Shri Bhaktamer Maha Poojan",
      sub: "Forty eight verses",
      duration: "Three hours",
      setting: "Sangh or derasar",
      summary: "The Bhaktamar Stotra, recited in full rather than in part.",
      body: [
        "Composed by Acharya Manatunga in praise of Bhagwan Adinath, the first Tirthankara. Each of the forty eight verses carries its own meaning, and each is explained before it is recited.",
        "It is long, and it is meant to be. The point is not to get through it but to sit inside it.",
      ],
      note: "Individual verses can also be performed on their own.",
    },
    {
      number: "04",
      name: "Shri Gautam Swami Maha Poojan",
      sub: "Knowledge and abundance",
      duration: "Two to three hours",
      setting: "Sangh, home or business",
      summary: "Often performed around Diwali and at the start of a new financial year.",
      body: [
        "Gautam Swami was the first Ganadhar of Bhagwan Mahavir. He is remembered for knowledge and for abundance that arrives honestly.",
        "Businesses commonly ask for this at the opening of their books, which is a tradition worth keeping rather than a superstition worth humouring.",
      ],
      note: "Popular for Bestu Varas and new ledger ceremonies.",
    },
    {
      number: "05",
      name: "Laghu Shanti Snatra Poojan",
      sub: "For peace",
      duration: "Two hours",
      setting: "Sangh or home",
      summary: "The shorter Shanti Snatra, for a household or a community.",
      body: [
        "Performed for peace in a home or in a sangh, and often after a difficult period rather than before an auspicious one.",
        "The abhishek is central to it, and everyone present takes part rather than watching.",
      ],
      note: "Suitable when time is limited but the occasion still matters.",
    },
    {
      number: "06",
      name: "Shri Mahalaxmi and Saraswati Maha Poojan",
      sub: "Wealth and learning",
      duration: "Two to three hours",
      setting: "Home or business",
      summary: "Wealth and learning asked for together, which is the older way to ask.",
      body: [
        "Mahalaxmi for abundance and Saraswati for knowledge, performed as one poojan because the tradition does not treat them as separate requests.",
        "Families with children beginning their education often ask for this alongside a business or ledger ceremony.",
      ],
      note: "Frequently performed at Diwali.",
    },
    {
      number: "07",
      name: "Bhoomi Poojan",
      sub: "Before ground is broken",
      duration: "One to two hours",
      setting: "The site itself",
      summary: "Performed on the land, before any construction begins.",
      body: [
        "Reverence is offered to the earth before it is disturbed. In Jain practice this is not a formality, it is an acknowledgement that the ground was not empty and did not belong to us.",
        "Performed for houses, for derasars and for commercial premises alike.",
      ],
      note: "Usually followed later by Shila Sthapan.",
    },
    {
      number: "08",
      name: "18 Abhishek",
      sub: "The eighteen anointments",
      duration: "Three to four hours",
      setting: "Derasar",
      summary: "The eighteen ceremonial anointments, performed in sequence.",
      body: [
        "Eighteen substances, each with its own mantra and its own reason for being in the list. The sequence is fixed and the meaning of each is said aloud as it is offered.",
        "This is one of the more elaborate ceremonies and it rewards a family that has time for it.",
      ],
      note: "Often part of a Pratishtha or an anniversary of one.",
    },
    {
      number: "09",
      name: "Snatra Pooja",
      sub: "The daily rite",
      duration: "One hour",
      setting: "Derasar or home",
      summary: "The everyday rite, performed properly rather than quickly.",
      body: [
        "The bathing ceremony of the Tirthankara, re-enacting the Janma Kalyanak. It is the most commonly performed of all Jain poojas and the most commonly rushed.",
        "Performed carefully it is a complete ceremony in an hour, and it is a good first experience for a family new to this.",
      ],
      note: "A good starting point if you have never hosted a poojan.",
    },
    {
      number: "10",
      name: "Panch Kalyanak Pooja",
      sub: "Five auspicious events",
      duration: "Three hours",
      setting: "Sangh or derasar",
      summary: "The five great moments in the life of a Tirthankara.",
      body: [
        "Chyavan, Janma, Diksha, Keval Gyan and Nirvana. The five are performed in order, and each is introduced before it begins so that everyone present can follow the arc rather than a series of rituals.",
        "Children usually follow this one better than the adults expect them to.",
      ],
      note: "Well suited to a full community gathering.",
    },
    {
      number: "11",
      name: "Antray Karma Pooja",
      sub: "For what obstructs",
      duration: "Two hours",
      setting: "Home or sangh",
      summary: "Performed when something keeps getting in the way.",
      body: [
        "Antaray karma is the karma that obstructs. This poojan addresses the five obstructions described in the scriptures rather than a single named problem.",
        "Families often ask for this quietly and privately, and that is entirely appropriate.",
      ],
      note: "Can be performed in a private home.",
    },
    {
      number: "12",
      name: "Vastu Pooja",
      sub: "A new home or premises",
      duration: "One to two hours",
      setting: "The property itself",
      summary: "For a house or a business you are about to move into.",
      body: [
        "Performed at the property before the family or the business takes occupation. The whole house is included rather than one room.",
        "Frequently combined with a Snatra Pooja and a small gathering of neighbours and family.",
      ],
      note: "Often the first thing families do in a new home.",
    },
    {
      number: "13",
      name: "Shila Sthapan",
      sub: "The foundation stone",
      duration: "One to two hours",
      setting: "The site itself",
      summary: "The laying of the foundation stone.",
      body: [
        "Performed once the ground has been prepared and the building is ready to begin rising. The stone is consecrated and set with the mantras said aloud.",
        "For derasars this is a significant community occasion and is usually planned months ahead.",
      ],
      note: "Follows Bhoomi Poojan.",
    },
    {
      number: "14",
      name: "Jin Pratishtha",
      sub: "Consecration of an idol",
      duration: "A full day or more",
      setting: "Derasar",
      summary: "The largest ceremony on this list, and the one planned furthest ahead.",
      body: [
        "The consecration of a Jin Pratima in a derasar. It runs across a full day and sometimes several, and it involves the whole sangh rather than one family.",
        "This requires planning many months in advance and a conversation long before a date is set.",
      ],
      note: "Please begin the conversation early for this one.",
    },
  ],
};

export const contactPage = {
  kicker: "CONTACT",
  h1: "Getting married?",
  line: "Call 1-866-800-4771 for consultation, or send the form and I will reply myself.",
  ceremonyTypes: [
    "Jain wedding ceremony",
    "Ganesh Pooja",
    "Mandap Muhrat",
    "Engagement or Roka",
    "Poojan or ritual",
    "Something else",
  ],
  formHeading: "Tell me your date",
  privacy: "Your details are used only to reply to you, and are never shared.",
  submit: "Send this to Ashok",
  success: "Thank you. Your message has reached Ashok and he will reply personally.",
  error: "That did not send. Please call 1-866-800-4771 or email info@jainweddingusa.com.",
  fields: {
    name: "Your name",
    email: "Email",
    phone: "Phone",
    date: "Wedding date",
    city: "City and venue",
    type: "Type of ceremony",
    message: "Anything you would like me to know",
  },
};

export const invitationBand = {
  eyebrow: "WITH BLESSINGS",
  h2: "Getting married?",
  line: "Send the date and the city, or simply call. I travel to any domestic and international destination, and the first conversation costs nothing.",
  primary: "Send your date",
  secondaryLabel: "Or call, any day",
  aside: {
    heading: "What happens next",
    steps: [
      "You send the date, the city, and roughly how many people will be sitting in front of us",
      "I reply myself with what the ceremony looks like and how long it runs",
      "We read through the mantras together, well before the day",
    ],
    foot: "No cost and no obligation on either side.",
  },
};

export const invite = {
  eyebrow: "WITH BLESSINGS",
  couple: "For the two of you",
  heading: "Are you planning a wedding?",
  line: "Send the date and the city. Ashok replies himself, usually within two days, with what the ceremony looks like, how long it runs, and what is worth talking through before the day.",
  points: [
    "No cost and no obligation on either side",
    "Every ritual explained in English before it is performed",
    "Travelling to any domestic or international destination",
  ],
  nameLabel: "Your name",
  emailLabel: "Email",
  dateLabel: "Wedding date",
  cityLabel: "City",
  submit: "Send this to Ashok",
  dismiss: "Not right now",
  sent: "Your email app should have opened with the details ready to send. If nothing happened, write to info@jainweddingusa.com or call 1-866-800-4771.",
};

/** Cross links, so no page is a dead end. */
export const pathways = {
  heading: "Where to go next",
  line: "Every part of this site connects to the others. These are the doors people use most.",
  cards: [
    {
      to: "/wedding-rituals",
      kicker: "THE CEREMONY",
      title: "Twelve rituals, explained",
      body: "Var Aagaman through Akhand Saubhagyavati. Twelve rites in the order they are conducted, each with the Sanskrit name, the English meaning, and what it is actually asking of the two people sitting there.",
      cta: "Read the rituals",
    },
    {
      to: "/wedding-gallery",
      kicker: "THE GALLERY",
      title: "Photographs and films",
      body: "Photographs and short films from ceremonies across North America, shared by the families themselves. Swipe the reel, or open any one of them full size.",
      cta: "See the gallery",
    },
    {
      to: "/other-services",
      kicker: "BEYOND THE WEDDING",
      title: "Poojans and rituals",
      body: "Fourteen ceremonies performed for sanghs, societies, private homes and businesses across the continent. Siddha Chakra, Bhaktamer, Panch Kalyanak and more, each with what it is for and how long it runs.",
      cta: "See every poojan",
    },
    {
      to: "/about",
      kicker: "THE VIDHIKAR",
      title: "About Ashok",
      body: "An ordained Jain Vidhikar and a Certified Financial Planner, in the United States since 1987. Weddings are offered as grace rather than as a business, which is why the first conversation costs nothing.",
      cta: "More about Ashok",
    },
  ],
  blessing: {
    sa: "णमो अरिहंताणं",
    en: "I BOW TO THE ENLIGHTENED ONES",
    line: "Or simply send the date, and we will begin from there.",
    cta: "Tell me your date",
  },
};

export const notFoundPage = {
  h1: "This page has not been written yet",
  line: "Everything on this site lives in one of five places. Try the rituals, the gallery, the other services, about, or send a message.",
  button: "Back to the beginning",
};
