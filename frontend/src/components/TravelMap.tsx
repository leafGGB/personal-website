import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Link } from "react-router-dom"
import type { TravelPost } from "../api/travel"
import { useLanguage } from "../contexts/LanguageContext"

// Fix Leaflet default marker icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

const accentIcon = L.divIcon({
  className: "custom-marker",
  html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#2dd4bf" stroke="#0d9488" stroke-width="1.5"><path d="M12 21s-6-5.5-6-10a6 6 0 0112 0c0 4.5-6 10-6 10z"/></svg>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

const highlightedIcon = L.divIcon({
  className: "custom-marker-highlighted",
  html: '<svg width="32" height="32" viewBox="0 0 24 24" fill="#f97316" stroke="#ea580c" stroke-width="1.5"><path d="M12 21s-6-5.5-6-10a6 6 0 0112 0c0 4.5-6 10-6 10z"/></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

interface Props {
  posts: TravelPost[]
  highlightedSlug?: string
  className?: string
}

function FitBounds({ posts }: { posts: TravelPost[] }) {
  const map = useMap()
  useEffect(() => {
    if (posts.length > 0) {
      const bounds = L.latLngBounds(posts.map((p) => [p.latitude, p.longitude] as [number, number]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 })
    } else {
      map.setView([20, 0], 2)
    }
  }, [posts, map])
  return null
}

export default function TravelMap({ posts, highlightedSlug, className = "" }: Props) {
  const { t, lang } = useLanguage()
  return (
    <div className={`rounded-sm overflow-hidden border border-[var(--color-border)] ${className}`}>
      <MapContainer center={[20, 0]} zoom={2} className="w-full h-full" zoomControl={true} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds posts={posts} />
        {posts.map((post) => (
          <Marker key={post.id} position={[post.latitude, post.longitude]} icon={post.slug === highlightedSlug ? highlightedIcon : accentIcon}>
            <Popup>
              <div className="font-sans text-sm min-w-[180px]">
                <Link to={`/travel/${post.slug}`} className="font-semibold text-[#2dd4bf] hover:underline block mb-1">{lang === "zh" && post.title_zh ? post.title_zh : post.title}</Link>
                <p className="text-[#78716c] text-xs">{lang === "zh" && post.location_name_zh ? post.location_name_zh : post.location_name}</p>
                {post.date_visited && <p className="text-[#78716c] text-xs mt-0.5">{post.date_visited}</p>}
                <Link to={`/travel/${post.slug}`} className="inline-block mt-2 text-xs font-medium text-[#f97316] hover:underline">{t("travel", "readMore")}</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
