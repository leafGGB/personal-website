export type Lang = "zh" | "en"

export const translations = {
  journalDetail: {
    back: { zh: "返回随笔列表", en: "Back to journal" },
  },
  language: {
    toggle: { zh: "EN", en: "中" },
  },
  nav: {
    brand: { zh: "个人作品", en: "Portfolio" },
    home: { zh: "首页", en: "Home" },
    work: { zh: "作品", en: "Work" },
    travel: { zh: "旅行", en: "Travel" },
    journal: { zh: "随笔", en: "Journal" },
    about: { zh: "关于", en: "About" },
    contact: { zh: "联系", en: "Contact" },
  },
  home: {
    greeting: { zh: "你好，我是", en: "Hello, I'm" },
    creative: { zh: "一个富有", en: "a creative" },
    developer: { zh: "创意的开发者", en: "developer" },
    desc: { zh: "我打造兼具设计感与工程品质的数字体验。欢迎来到我的小站。", en: "I build digital experiences that blend thoughtful design with clean engineering. Welcome to my corner of the web." },
    viewWork: { zh: "查看作品", en: "View my work" },
    moreAbout: { zh: "了解更多", en: "More about me" },
    featured: { zh: "精选项目", en: "Featured projects" },
    viewAll: { zh: "查看全部", en: "View all" },
    latestJourney: { zh: "最新旅程", en: "Latest journey" },
    allTravels: { zh: "全部旅行", en: "All travels" },
    noProjects: { zh: "暂无作品，添加后将在这里展示。", en: "No projects yet. Coming soon." },
    viewProject: { zh: "查看项目", en: "View project" },
    noTravels: { zh: "暂无旅行记录，添加后将在这里展示。", en: "Travel stories will appear here once added." },
    latestWritings: { zh: "最新文字", en: "Latest writings" },
    viewAllWritings: { zh: "全部文章", en: "All articles" },
    noWritings: { zh: "暂无文章，添加后将在这里展示。", en: "Articles will appear here once added." },
  },
  work: {
    subtitle: { zh: "做过的一些", en: "Things I've built" },
    title: { zh: "精选作品", en: "Selected work" },
    desc: { zh: "这里汇集了我设计和开发的项目。每一个都是一次独特的挑战，一个用心的方案。", en: "A collection of projects I've designed and built. Each one represents a unique challenge and a thoughtful solution." },
    empty: { zh: "暂无作品，敬请期待。", en: "No projects yet. Coming soon." },
  },
  workDetail: {
    back: { zh: "返回作品列表", en: "Back to projects" },
    oops: { zh: "哎呀！", en: "Oops!" },
    notFound: { zh: "作品未找到", en: "Project not found" },
    liveSite: { zh: "在线预览", en: "Live Site" },
    sourceCode: { zh: "源代码", en: "Source Code" },
  },
  travel: {
    subtitle: { zh: "足迹地图", en: "Wanderlust" },
    title: { zh: "足迹", en: "Footprints" },
    stops: { zh: "个足迹", en: " stops" },
    empty: { zh: "暂无旅行记录，敬请期待。", en: "No travel stories yet. Coming soon." },
    readMore: { zh: "阅读全文 \u2192", en: "Read more \u2192" },
  },
  travelDetail: {
    back: { zh: "返回旅行列表", en: "Back to travels" },
    oops: { zh: "迷路了", en: "Lost my way" },
    notFound: { zh: "旅行记录未找到", en: "Travel story not found" },
  },
  journal: {
    subtitle: { zh: "文字角落", en: "Reading corner" },
    title: { zh: "思考与笔记", en: "Thoughts & notes" },
    desc: { zh: "随想、学习笔记、日常观察。", en: "Random thoughts, learnings, and everyday observations." },
    comingSoon: { zh: "文章功能即将上线", en: "Articles coming soon" },
  },
  about: {
    subtitle: { zh: "关于我", en: "A bit about me" },
    title: { zh: "我是谁", en: "Who I am" },
    para1: { zh: "一名热爱创造的前端开发者，喜欢把设计和技术结合在一起，做出让人用着舒服的产品。", en: "A creative developer who loves blending design and technology to build products that feel good to use." },
    para2: { zh: "除了写代码，我还喜欢旅行、摄影、和记录生活。这个网站就是我把这些兴趣融在一起的地方。", en: "Beyond code, I love traveling, photography, and documenting life. This site is where all these interests come together." },
    photo: { zh: "你的照片", en: "Your photo" },
  },
  contact: {
    subtitle: { zh: "聊一聊", en: "Let's talk" },
    title: { zh: "保持联系", en: "Get in touch" },
    desc: { zh: "有项目想聊聊，或者只是打个招呼？给我留言吧。", en: "Have a project in mind or just want to say hi? Drop me a message." },
    name: { zh: "姓名", en: "Name" },
    namePlaceholder: { zh: "你的名字", en: "Your name" },
    email: { zh: "邮箱", en: "Email" },
    emailPlaceholder: { zh: "your@email.com", en: "your@email.com" },
    message: { zh: "留言", en: "Message" },
    messagePlaceholder: { zh: "你的留言...", en: "Your message..." },
    send: { zh: "发送留言", en: "Send message" },
  },
  notFound: {
    oops: { zh: "哎呀！", en: "Oops!" },
    title: { zh: "页面未找到", en: "Page not found" },
    back: { zh: "返回首页", en: "Go back home" },
  },
  footer: {
    text: { zh: "个人主页 \u00b7 用心打造", en: "Portfolio \u00b7 Built with care" },
  },
}

export type TranslationKey = keyof typeof translations
type TranslationSubKey<K extends TranslationKey> = keyof (typeof translations)[K]

export function t(lang: Lang, section: string, key: string): string {
  const sectionData = (translations as any)[section]
  const entry = sectionData?.[key]
  if (entry && typeof entry === "object" && lang in entry) return entry[lang]
  return key
}
