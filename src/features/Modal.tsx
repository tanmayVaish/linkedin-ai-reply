import { useEffect, useState } from "react"

import DownIcon from "../../assets/down.svg"
import ReIcon from "../../assets/re.svg"
import GenerateIcon from "../../assets/Vector.svg"

interface ChatInterface {
  role: string
  content: string
}

// Define props type for the Modal component
interface ModalProps {
  setReply: React.Dispatch<React.SetStateAction<string>>
  setShowComponent: React.Dispatch<React.SetStateAction<boolean>>
}

export const Modal = (props: ModalProps) => {
  const [chatToggle, setChatToggle] = useState<boolean>(false)
  const [prompt, setPrompt] = useState<string>("")
  const [apiToggle, setApiToggle] = useState<boolean>(false)
  const [chat, setChat] = useState<ChatInterface[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const generateAnswer = () => {
    if (prompt === "") return
    setChat((prev) => [...prev, { role: "user", content: prompt }])
    setApiToggle(true)
    setPrompt("")
  }

  const mockApi = () => {
    setIsLoading(true) // Set loading state to true
    return new Promise((resolve) => {
      setTimeout(() => {
        setChat((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
          }
        ])
        setIsLoading(false) // Set loading state to false when API response is received
      }, 2000)
    })
  }

  useEffect(() => {
    if (apiToggle) mockApi().then(() => setApiToggle(false))
  }, [apiToggle])

  useEffect(() => {
    if (chat.length > 0) setChatToggle(true)
    else setChatToggle(false)
  }, [chat])

  const insertMessageToLinkedIn = (message: string) => {
    if (isLoading) return
    props.setReply(message)
  }

  // Function to close the Modal after the user clicks outside of it
  const handleWrapperClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      props.setShowComponent(false)
    }
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
      onClick={handleWrapperClick}
    >
      <div className="bg-white shadow-lg rounded-lg p-6 w-[500px]">
        <div className="flex flex-col max-h-[500px] overflow-y-auto">
          {chat.map((message, index) =>
            message.role === "user" ? (
              <div
                key={index}
                className="text-xl mb-4 text-[#666D80] bg-gray-200 rounded-lg p-4 self-end max-w-[60%]">
                {message.content}
              </div>
            ) : (
              <div
                key={index}
                className="text-xl mb-4 text-[#666D80] bg-[#DBEAFE] rounded-lg p-4 max-w-[60%]">
                {message.content}
              </div>
            )
          )}
          {isLoading && (
            <div className="text-xl mb-4 text-[#666D80] bg-[#DBEAFE] rounded-lg p-4 max-w-[60%]">
              Typing...
            </div>
          )}
        </div>
        <div className="flex flex-col w-full">
          <input
            type="text"
            placeholder="Your Prompt..."
            className="border border-gray-300 p-5 rounded-md mb-4 text-xl w-full"
            onChange={(e) => setPrompt(e.target.value)}
          />

          {chatToggle ? (
            <div className="flex gap-2 self-end">
              <button
                type="button"
                className="flex items-center space-x-2 font-semibold text-[#666D80] border-2 border-[#666D80] px-4 py-3 rounded-md"
                onClick={() =>
                  insertMessageToLinkedIn(chat[chat.length - 1].content)
                }>
                <img src={DownIcon} alt="Inser Icon" className="h-5 w-8" />
                <span className="font-bold text-xl">Insert</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-md">
                <img src={ReIcon} alt="Re Icon" className="h-6 w-10" />
                <span className="font-bold text-xl">Regenerate</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-md self-end"
              onClick={() => {
                generateAnswer()
              }}>
              <img
                src={GenerateIcon}
                alt="Generate Icon"
                className="h-6 w-10"
              />
              <span className="font-bold text-xl">Generate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
