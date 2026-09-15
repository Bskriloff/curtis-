"use client"

import { useRef, useState } from "react"

const QUICK_PROMPTS = [
  { label: "Main person", prompt: "Put Curtis's face on the main person in this photo." },
  { label: "Face swap", prompt: "Replace the person's face with Curtis's face." },
  { label: "Natural", prompt: "Make Curtis fit naturally into this scene." },
]

export function CurtifyStudio() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const resultRef = useRef<HTMLElement | null>(null)

  function selectFile(next: File | undefined | null) {
    if (!next || !next.type.startsWith("image/")) return
    setFile(next)
    setPreviewUrl(URL.createObjectURL(next))
  }

  async function curtify() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    const form = new FormData()
    form.append("image", file)
    form.append("prompt", prompt)

    try {
      const response = await fetch("/api/curtify", { method: "POST", body: form })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "CURTIFY failed.")
      setResult(data.image)
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "CURTIFY failed.")
    } finally {
      setLoading(false)
    }
  }

  function download() {
    if (!result) return
    const a = document.createElement("a")
    a.href = result
    a.download = "curtified.png"
    a.click()
  }

  return (
    <>
      <section id="studio" className="creator">
        <div className="creator-head">
          <div>
            <div className="section-kicker">CREATE YOUR IMAGE</div>
            <h2>Two things. That&apos;s it.</h2>
          </div>
          <div className="step-note">1 upload · 2 describe · 3 CURTIFY</div>
        </div>

        <div className="steps">
          <div className={`step-card${file ? "" : " active"}`} id="uploadCard">
            <div className="step-number">1</div>
            <div className="step-title">Upload your image</div>
            <div className="step-help">Choose the photo you want Curtis added to.</div>
            <label
              className={`upload-area${dragging ? " drag" : ""}`}
              id="dropzone"
              onDragEnter={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setDragging(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                selectFile(e.dataTransfer.files[0])
              }}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={(e) => selectFile(e.target.files?.[0])}
              />
              <div className="upload-plus">+</div>
              <strong id="fileTitle">{file ? file.name : "Tap to choose an image"}</strong>
              <span id="fileHint">
                {file
                  ? `${Math.round(file.size / 1024)} KB • ready to CURTIFY`
                  : "or drag and drop a photo here"}
              </span>
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  id="preview"
                  className="show"
                  src={previewUrl}
                  alt="Uploaded image preview"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img id="preview" alt="" />
              )}
            </label>
          </div>

          <div className="step-card" id="promptCard">
            <div className="step-number">2</div>
            <div className="step-title">Describe what you want</div>
            <div className="step-help">Be as simple or specific as you like.</div>
            <div className="prompt-wrap">
              <textarea
                id="prompt"
                maxLength={500}
                placeholder="Example: Put Curtis's face on the person in this photo..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="prompt-bottom">
                <span>What should CURTIFY change?</span>
                <span id="counter">{prompt.length} / 500</span>
              </div>
            </div>
            <div className="quick-prompts">
              {QUICK_PROMPTS.map((q) => (
                <button key={q.label} type="button" onClick={() => setPrompt(q.prompt)}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          id="curtifyBtn"
          className={`curtify-btn${loading ? " loading" : ""}`}
          disabled={!file || loading}
          onClick={curtify}
        >
          <span className="button-label">CURTIFY MY IMAGE</span>
          <span className="spinner" />
          <span className="arrow">→</span>
        </button>
        <p className="fineprint">
          CURTIFY uses the built-in Curtis reference photo for every edit. Only upload images
          you have permission to edit.
        </p>
      </section>

      <section
        className="result-section"
        id="resultSection"
        ref={resultRef as React.RefObject<HTMLElement>}
      >
        <div className="result-head">
          <div>
            <div className="section-kicker">YOUR RESULT</div>
            <h2>Here&apos;s the CURTIFIED version.</h2>
          </div>
          {result ? (
            <button id="downloadBtn" className="download" onClick={download}>
              DOWNLOAD PNG ↓
            </button>
          ) : null}
        </div>
        <div className="result-card">
          {!result && !error ? (
            <div id="resultEmpty">
              <div className="result-mark">C</div>
              <strong>Your result will appear here.</strong>
              <p>Upload an image above to get started.</p>
            </div>
          ) : null}
          {result ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img id="resultImage" className="show" src={result} alt="CURTIFIED result" />
          ) : null}
          {error ? (
            <div id="error" className="error" style={{ display: "block" }}>
              {error}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
