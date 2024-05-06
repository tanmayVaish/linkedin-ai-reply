import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

import { Modal } from "~features/Modal"

// @ts-ignore
import iconUrl from "../assets/Frame.svg"

// Define types for the props passed to Modal component
interface ModalProps {
  setReply: React.Dispatch<React.SetStateAction<string>>
  setShowComponent: React.Dispatch<React.SetStateAction<boolean>>
}

// Define types for the PlasmoOverlay component
const PlasmoOverlay = () => {
  const [showComponent, setShowComponent] = useState<boolean>(false)
  const [reply, setReply] = useState<string>("")
  const focusedElementRef = useRef<HTMLElement | null>(null)

  // Function to toggle the component visibility
  const toggleComponent = () => {
    setShowComponent((prev) => !prev)
  }

  function handleFocus(event: FocusEvent) {
    const target = event.target as HTMLElement
    if (target.tagName === "DIV" && target.getAttribute("role") === "textbox") {
      const icon = createIcon(toggleComponent)
      target?.appendChild(icon)
      focusedElementRef.current = target
    }
  }

  function handleBlur() {
    const icon = document.getElementById(ICON_ID)
    if (icon) {
      icon.parentNode?.removeChild(icon)
    }
  }

  // Event listeners when component mounts
  useEffect(() => {
    document.addEventListener("focus", handleFocus, true)
    document.addEventListener("blur", handleBlur, true)
    return () => {
      document.removeEventListener("focus", handleFocus, true)
      document.removeEventListener("blur", handleBlur, true)
    }
  }, [])

  useEffect(() => {
    if (reply.length > 0 && focusedElementRef.current) {
      // Access the brother div element where "Write a message" placeholder is there
      const brotherDiv = focusedElementRef.current
        .nextElementSibling as HTMLDivElement
      // Remove the class to hide the placeholder
      brotherDiv.classList.remove("msg-form__placeholder")

      focusedElementRef.current.childNodes[0].textContent = reply

      setReply("")
      setShowComponent(false)
    }
  }, [reply])

  // Function to create the icon element
  function createIcon(toggleComponent: () => void) {
    const icon = document.createElement("img")
    icon.src = iconUrl
    icon.id = ICON_ID
    icon.style.position = "absolute"
    icon.style.bottom = "5px"
    icon.style.right = "5px"
    icon.style.width = "30px"
    icon.style.height = "30px"
    icon.style.zIndex = "9999"
    icon.style.cursor = "pointer"
    icon.style.userSelect = "none"
    icon.addEventListener("click", toggleComponent)
    return icon
  }

  return (
    <>
      {showComponent && (
        <Modal setReply={setReply} setShowComponent={setShowComponent} />
      )}
    </>
  )
}

// Define types for the PlasmoOverlay component configuration
export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

// Define types for the style obtained from the data-text source
export const getStyle = (): HTMLStyleElement => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// Define a constant for the icon ID
const ICON_ID: string = "plasmo-message-icon"

export default PlasmoOverlay
