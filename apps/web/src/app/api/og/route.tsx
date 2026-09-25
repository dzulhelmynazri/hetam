import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const searchParamtitle = searchParams.get("title");

  const title = searchParamtitle ? searchParamtitle.slice(0, 100) : "Welcome to hetam's Family <3";

  try {
    return new ImageResponse(
      <div tw="flex flex-col items-center justify-center h-full">
        <h1
          style={{ fontFamily: "Instrument Serif" }}
          tw="text-7xl font-medium leading-none max-w-[900px] absolute top-[300px] left-[94px] text-white"
        >
          {title}
        </h1>
      </div>,
      {
        fonts: [
          {
            name: "Instrument Serif",
            style: "normal",
            data: await loadGoogleFont(),
            weight: 400,
          },
          {
            name: "JetBrains Mono",
            style: "normal",
            data: await loadJetbrainsMonoGoogleFont(),
            weight: 400,
          },
        ],
      },
    );
  } catch (error) {
    // to log error in console
    console.error("Failed to generate OG image", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}

async function loadGoogleFont() {
  const url = `https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

async function loadJetbrainsMonoGoogleFont() {
  const url = `https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}
