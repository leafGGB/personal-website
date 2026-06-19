import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { translations, t as translateFn, type Lang } from "../i18n/translations"

interface LanguageContextType {
  lang: Lang
  toggleLang: () => void
  t: (section: string, key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem("lang")
    return stored === "en" || stored === "zh" ? stored : "zh"
  })

  useEffect(() => {
    localStorage.setItem("lang", lang)
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en"
  }, [lang])

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"))

  const t = useCallback(
    (section: string, key: string) => translateFn(lang, section as any, key as any),
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    console.warn("useLanguage outside LanguageProvider - using defaults")
    return { lang: "zh" as const, toggleLang: () => {}, t: (s: string, k: string) => k }
  }
  return ctx
}

