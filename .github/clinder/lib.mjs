import { createInterface } from "readline";
import { Readable } from "stream";

export const USER_AGENT = "clinder/0.0.0";
export async function startBinder(hub, spec) {
  if (spec.githubRepo !== undefined) {
    const url = new URL(`build/gh/${spec.githubRepo}/${spec.githubRef}`, hub);
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
    const stream = Readable.fromWeb(response.body);
    const rl = createInterface({
      input: stream,
      crlfDelay: Infinity, // Important for handling potential line ending variations
    });
    for await (const line of rl) {
      console.log(line);
      if (!line.startsWith("data:")) continue;
      const data = JSON.parse(line.slice("data:".length));
      switch (data.phase) {
        case "failed":
          throw new Error(data.messge);
        case "ready":
          return {
            url: data.url,
            token: data.token,
          };
      }
    }
  } else {
    throw new Error();
  }
}

export async function stopBinder(session) {
  const url = new URL("/api/shutdown", session.url);
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Authorization: `token ${session.token}`,
    },
    method: "post",
  });
  if (!response.ok) {
    throw new Error("Error during shutdown");
  }
}
