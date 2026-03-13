import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useMeasure from "react-use-measure"

const timezones = [
  { name: "email",     delta: "-5 hours", tz: "GTM-8" },
  { name: "skilli",    delta: "-2 hours", tz: "GTM-5" },
  { name: "Your time", delta: "",         tz: "GTM-3" },
]

const barHeights = [14, 20, 26]
const avatars = [
  `${import.meta.env.BASE_URL}avatar/avatar1.jpg`,
  `${import.meta.env.BASE_URL}avatar/avatar2.jpg`,
  `${import.meta.env.BASE_URL}avatar/avatar3.jpg`,
]

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#ffffff",
    }}>
      <CalendarWidget />
    </div>
  )
}

function CalendarWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredAvatar, setHoveredAvatar] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [activeBar, setActiveBar] = useState(null)
  const [ref, { height }] = useMeasure()
  const [hoveredIcon, setHoveredIcon] = useState(false)

  const activeIndex = hoveredBar ?? activeBar

  return (
    <motion.div
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ width: 200 }}
      animate={{ width: isExpanded ? 400 : 200 }}
      transition={{ duration: 0.35, ease: [0.34, 1.2, 0.64, 1] }}
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,.1)",
        borderRadius: 16,
        padding: "16px 16px",
        boxShadow: "0 1px 16px rgba(0,0,0,.04)",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        cursor: "pointer",
      }}
    >

      {/* Badge + 视频按钮 */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          background: "#fff3f7",
          color: "#f40d3b",
          fontSize: 12,
          fontWeight: 400,
          padding: "6px 14px",
          borderRadius: 99,
          marginBottom: 18,
          whiteSpace: "nowrap",
        }}>
          In 15 mins
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: [0.34, 1.2, 0.64, 1] }}
              onMouseEnter={() => setHoveredIcon(true)}
              onMouseLeave={() => setHoveredIcon(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: hoveredIcon ? "rgb(226, 16, 58)" : "#f40d3b",
                padding: "6px 14px",
                borderRadius: 99,
                marginBottom: 18,
                transition: "background 0.2s ease"
              }}
            >
              <img src={`${import.meta.env.BASE_URL}icon-camera.svg`} alt="camera" style={{ width: 16, filter: "brightness(0) invert(1)" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title + Time */}
      <div style={{ fontSize: 14, fontWeight: 400, whiteSpace: "nowrap" }}>
        <div style={{ color: "#000000", marginBottom: 8, whiteSpace: "nowrap"}}>Design Sync</div>
        <div style={{ color: "rgba(0,0,0,.6)", fontWeight: 360, whiteSpace: "nowrap"}}>1:30PM → 2:30PM</div>
      </div>

      {/* 展开区域 */}
      <motion.div
        animate={{
          height: isExpanded ? height + 20 : 0,
          opacity: isExpanded ? 1 : 0,
          whiteSpace: "nowrap",
        }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ overflow: "hidden" }}
      >
        <div ref={ref} style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid #f2f2f2",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>

          {/* 第一行：Guests + 时区 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#000" }}>
              <span>Guests</span>
              <img src={`${import.meta.env.BASE_URL}icon-global.svg`} alt="global" style={{ width: 16, opacity: 0.25, verticalAlign: "middle" }} />
              <span style={{ color: "rgba(0,0,0,.6)", fontWeight: 360 }}>3</span>
            </div>

            <motion.div
              animate={{ opacity: activeIndex !== null ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: 12, color: "rgba(0,0,0,.4)", display: "flex", gap: 8 }}
            >
              {activeIndex !== null && (
                <>
                  <span>{timezones[activeIndex].name}</span>
                  {timezones[activeIndex].delta && <span>{timezones[activeIndex].delta}</span>}
                  <span style={{ color: "rgba(0,0,0,.6)" }}>{timezones[activeIndex].tz}</span>
                </>
              )}
            </motion.div>

          </div>

          {/* 第二行：头像 + 波形条 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 28 }}>

            {/* 头像 */}
            <div
              onMouseEnter={() => setHoveredAvatar(true)}
              onMouseLeave={() => setHoveredAvatar(false)}
              style={{ display: "flex" }}
            >
              {avatars.map((src, i) => (
                <motion.div
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveBar(i) }}
                  animate={{ marginLeft: i === 0 ? 0 : (hoveredAvatar ? 4 : -8) }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{
                    width: 28, height: 28,
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img src={src} alt={`avatar${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </motion.div>
              ))}
            </div>

            {/* 波형条 */}
            <div
              onClick={e => e.stopPropagation()}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              {barHeights.map((h, i) => (
                <motion.div
                  key={i}
                  onMouseEnter={() => { setHoveredBar(i); setActiveBar(null) }}
                  onMouseLeave={() => setHoveredBar(null)}
                  animate={{
                    backgroundColor: hoveredBar === i || activeBar === i ? "#ff1a48" : "rgba(0,0,0,.08)",
                  }}
                  transition={{ duration: 0.25, ease: [0.34, 1.2, 0.64, 1] }}
                  style={{
                    width: 8, height: 28,
                    borderRadius: 99,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

          </div>

        </div>
      </motion.div>

    </motion.div>
  )
}