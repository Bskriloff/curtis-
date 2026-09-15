import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 300

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured on the server." },
        { status: 500 },
      )
    }

    const body = await request.formData()
    const image = body.get("image")

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Please upload an image." }, { status: 400 })
    }
    if (image.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Image is too large (max 15 MB)." }, { status: 400 })
    }

    const prompt = String(body.get("prompt") || "").trim()
    const userPrompt = [
      "CURTIFY IMAGE EDIT.",
      "The second image is the target image supplied by the user.",
      "The first image is the Curtis face reference.",
      "Create a convincing photo edit that incorporates Curtis's recognizable facial appearance into the target image.",
      "Preserve the target image's composition, setting, clothing, lighting, pose, and important objects unless the user's prompt asks for changes.",
      "Make the face integration look natural and photorealistic, with correct proportions, skin texture, lighting, and perspective.",
      prompt
        ? `User's additional instruction: ${prompt}`
        : "No additional instruction: make the most natural Curtis transformation possible.",
      "Do not add captions, watermarks, logos, or extra text.",
    ].join("\n")

    const curtisBuffer = await readFile(path.join(process.cwd(), "public", "curtis.jpg"))

    const form = new FormData()
    form.append("model", "gpt-image-1")
    form.append("prompt", userPrompt)
    form.append(
      "image[]",
      new Blob([new Uint8Array(curtisBuffer)], { type: "image/jpeg" }),
      "curtis.jpg",
    )
    form.append(
      "image[]",
      new Blob([await image.arrayBuffer()], { type: image.type || "image/jpeg" }),
      image.name || "target.jpg",
    )
    form.append("size", "auto")
    form.append("quality", "auto")

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    })

    const data = await response.json()
    if (!response.ok) {
      console.log("[v0] OpenAI image edit error:", JSON.stringify(data))
      return NextResponse.json(
        { error: data?.error?.message || "The image edit failed." },
        { status: response.status },
      )
    }

    const item = data?.data?.[0]
    if (!item?.b64_json) {
      return NextResponse.json(
        { error: "The image service returned no image." },
        { status: 502 },
      )
    }

    return NextResponse.json({ image: `data:image/png;base64,${item.b64_json}` })
  } catch (error) {
    console.log("[v0] CURTIFY route error:", error)
    return NextResponse.json(
      { error: "Something went wrong while CURTIFY was processing the image." },
      { status: 500 },
    )
  }
}
